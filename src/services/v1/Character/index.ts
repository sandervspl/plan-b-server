import qs from 'querystring';
import * as i from 'types';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import apiconfig from 'config/apiconfig';
import BlizzardService from 'services/v1/Blizzard';

@Injectable()
export default class CharacterService {
  private readonly SERVER = 'ragnaros';

  constructor(
    private readonly blizzardService: BlizzardService,
  ) {}

  public async getClass(classId: number) {
    const queries = qs.stringify(this.blizzardService.queries);

    try {
      const response = await fetch(
        `${apiconfig.blizzardApiUrl}/wow/data/character/classes?${queries}`
      );
      const data: i.ClassDataResponse = await response.json();

      const classData = data.classes.find((cls) => cls.id === classId);

      if (!classData) {
        throw new NotFoundException(classId);
      }

      return classData;

    } catch (err) {
      throw new InternalServerErrorException(classId, err);
    }
  }

  public async single(name: string) {
    const queries = qs.stringify({
      ...this.blizzardService.queries,
      fields: 'guild,items',
    });

    try {
      const response = await fetch(
        `${apiconfig.blizzardApiUrl}/wow/character/${this.SERVER}/${name}?${queries}`
      );
      const data: i.CharacterData = await response.json();

      const classData = await this.getClass(data.class);

      return {
        ...data,
        class: classData,
      };
    } catch (err) {
      throw new NotFoundException(name, err);
    }
  }
}
