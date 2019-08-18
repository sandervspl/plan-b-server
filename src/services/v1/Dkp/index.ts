import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import convert from 'xml-js';
import * as entities from 'entities';
import { DkpXml } from './types';

@Injectable()
export default class DkpService {
  constructor(
    @InjectRepository(entities.DkpHistory)
    private readonly DkpHistoryRepo: Repository<entities.DkpHistory>,
  ) {}

  public addDkpHistory = async (file: { buffer: Buffer }) => {
    try {
      const xml = file.buffer.toString();
      const result = convert.xml2js(xml) as DkpXml;
      const [raidData] = result.elements;
      const players = raidData.elements;

      players.forEach(({ attributes: player }) => {
        const dkpEntry = new entities.DkpHistory();

        // @TODO how to link user with in-game name?
        dkpEntry.user;
        dkpEntry.exporter = raidData.attributes.exporter;
      });

      return;
    } catch (err) {
      throw new InternalServerErrorException('Error while inserting DKP history', JSON.stringify(err));
    }
  }
}
