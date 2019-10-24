import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import convert from 'xml-js';
import _ from 'lodash';
import { ERROR_NUM } from 'helpers';
import * as entities from 'entities';
import * as DkpTypes from 'services/v1/Dkp/types';
import { DkpXml } from './types';

@Injectable()
export default class DkpService {
  constructor(
    @InjectRepository(entities.DkpHistory)
    private readonly DkpHistoryRepo: Repository<entities.DkpHistory>,
    @InjectRepository(entities.DkpEvent)
    private readonly DkpEventRepo: Repository<entities.DkpEvent>,
    @InjectRepository(entities.Character)
    private readonly CharacterRepo: Repository<entities.Character>,
  ) {}

  public addDkpHistory = async (file: { buffer: Buffer }, name: string) => {
    try {
      // Convert file buffer to XML string
      const xml = file.buffer.toString();

      // Convert XML string to JS object
      const result = convert.xml2js(xml) as DkpXml;

      // Extract data as readable variabes
      const [raidData] = result.elements;
      const players = raidData.elements.map((element) => ({
        ...element,
        attributes: {
          ...element.attributes,
          playername: element.attributes.playername.split('-')[0], // Remove server from name
        },
      }));

      // Create and upsert dkp event
      const dkpEvent = new entities.DkpEvent();
      dkpEvent.name = name;
      dkpEvent.exporter = raidData.attributes.exporter;
      dkpEvent.time = Number(raidData.attributes.time);

      await this.DkpEventRepo.save(dkpEvent);

      // Look up character entries from names in XML
      const playerNames = players.map(({ attributes: player }) => player.playername.toLowerCase());

      const characters = await this.CharacterRepo.find({
        where: In(playerNames),
      });

      // Check for missing characters
      const characterNames = characters.map((character) => character.name.toLowerCase());
      const diffCharacters = _.difference(playerNames, characterNames);

      // Create new batch of characters
      const newCharacters = diffCharacters.map((name) => {
        const character = new entities.Character();
        character.name = name;

        return character;
      });

      // Batch upsert new characters
      await this.CharacterRepo.save(newCharacters);

      // Generate new Dkp History entries + character's raid data
      const allCharacters = await this.CharacterRepo.find();

      const entries = allCharacters
        .map((character) => {
          const dkpEntry = new entities.DkpHistory();

          const data = players.find(({ attributes: player }) => (
            player.playername.toLowerCase() === character.name.toLowerCase()
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
          dkpEntry.event = dkpEvent;

          return [dkpEntry, characterRaidData] as const;
        })
        .filter((val) => val != null) as [entities.DkpHistory, DkpTypes.Player][];

      const dkpEntries = entries.map((entry) => entry[0]);
      const characterData = entries.map((entry) => entry[1]);

      // Save new entries to DB
      await this.DkpHistoryRepo.save(dkpEntries);

      // Update character entries with current DKP
      const updates = characterData.map((data) => {
        const dkp = Number(data.net);

        return new Promise((res) => (
          this.CharacterRepo.update({ name: data.playername }, { dkp }).then(res)
        ));
      });
      await Promise.all(updates);

      return {};
    } catch (err) {
      console.error(err);

      if (err && err.errno === ERROR_NUM.DUPLICATE_ENTRY) {
        throw new BadRequestException('Export already submitted.');
      }

      throw new InternalServerErrorException('Error while inserting DKP history', err);
    }
  }

  public getAverageGuildDkp = async () => {
    // Get all characters
    const characters = await this.CharacterRepo.find({
      relations: ['dkpHistories', 'dkpHistories.event'],
    });

    // Get total current DKP by export times
    const totals = characters.reduce((prev, character) => {
      character.dkpHistories.forEach((entry) => {
        prev = {
          ...prev,
          [entry.event.time]: {
            ...prev[entry.event.time],
            dkp: prev[entry.event.time]
              ? prev[entry.event.time].dkp + entry.net
              : entry.net,
            count: prev[entry.event.time] ? prev[entry.event.time].count + 1 : 1,
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
