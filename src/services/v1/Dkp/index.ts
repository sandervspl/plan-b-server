import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import convert from 'xml-js';
import { ERROR_NUM } from 'helpers';
import * as entities from 'entities';
import * as DkpTypes from 'services/v1/Dkp/types';
import { DkpXml } from './types';

@Injectable()
export default class DkpService {
  constructor(
    @InjectRepository(entities.DkpHistory)
    private readonly DkpHistoryRepo: Repository<entities.DkpHistory>,
    @InjectRepository(entities.Character)
    private readonly CharacterRepo: Repository<entities.Character>,
  ) {}

  public addDkpHistory = async (file: { buffer: Buffer }) => {
    try {
      // Convert file buffer to XML string
      const xml = file.buffer.toString();

      // Convert XML string to JS object
      const result = convert.xml2js(xml) as DkpXml;

      // Extract data as readable variabes
      const [raidData] = result.elements;
      const players = raidData.elements;

      // Look up character entries from names in XML
      const playerNames = players.map(({ attributes: player }) => player.playername);
      const characters = await this.CharacterRepo.find({
        where: In(playerNames),
      });

      // Generate new Dkp History entries + character's raid data
      const entries = characters
        .map((character) => {
          const dkpEntry = new entities.DkpHistory();
          const data = players.find(({ attributes: player }) => (
            player.playername === character.name
          ));

          if (!data) {
            return null;
          }

          const characterRaidData = data.attributes;

          dkpEntry.character = character;
          dkpEntry.net = Number(characterRaidData.net);
          dkpEntry.spent = Number(characterRaidData.spent);
          dkpEntry.total = Number(characterRaidData.total);
          dkpEntry.hours = Number(characterRaidData.hours);
          dkpEntry.exporter = raidData.attributes.exporter;
          dkpEntry.exportTime = Number(raidData.attributes.time);

          return [dkpEntry, characterRaidData] as const;
        })
        .filter((val) => val != null) as [entities.DkpHistory, DkpTypes.Player][];

      const dkpEntries = entries.map((entry) => entry[0]);
      const characterData = entries.map((entry) => entry[1]);

      // Save new entries to DB
      await this.DkpHistoryRepo.save(dkpEntries);

      // Update character entries with new total DKP
      const updates = characterData.map((data) => {
        const dkp = Number(data.total);

        return new Promise((res) => (
          this.CharacterRepo.update({ name: data.playername }, { dkp }).then(res)
        ));
      });
      await Promise.all(updates);

      return {};
    } catch (err) {
      if (err && err.errno === ERROR_NUM.DUPLICATE_ENTRY) {
        throw new BadRequestException('Export already submitted.');
      }

      throw new InternalServerErrorException('Error while inserting DKP history', err);
    }
  }

  public getAverageGuildDkp = async () => {
    // Get all characters
    const characters = await this.CharacterRepo.find({
      relations: ['dkpHistories'],
    });

    // Get total DKP by export times
    const totals = characters.reduce((prev, character) => {
      character.dkpHistories.forEach((entry) => {
        prev = {
          ...prev,
          [entry.exportTime]: {
            ...prev[entry.exportTime],
            dkp: prev[entry.exportTime]
              ? prev[entry.exportTime].dkp + entry.total
              : entry.total,
            count: prev[entry.exportTime] ? prev[entry.exportTime].count + 1 : 1,
            date: entry.createdAt,
          },
        };
      });

      return prev;
    }, {} as TotalDkpPerExportTime);

    // Calculate averages by export times
    const averages = Object.keys(totals).reduce((prev, cur) => {
      return {
        ...prev,
        [cur]: {
          value: totals[cur].dkp / totals[cur].count,
          date: totals[cur].date,
        },
      };
    }, {} as AverageDkpPerExportTime);

    return averages;
  }
}

type TotalDkpPerExportTime = Record<string, {
  dkp: number;
  count: number;
  date: Date;
}>

type AverageDkpPerExportTime = Record<string, {
  value: number;
  date: Date;
}>
