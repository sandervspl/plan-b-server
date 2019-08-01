import * as i from 'types';

export type Character = {
  server: string;
  level: number;
  name: string;
  race: number;
  class: number;
}

export type PrimaryProfession = {
  id: number;
  level: string;
}

export type SecondaryProfession = {
  id: number;
  level: string;
}

export type Professions = {
  primary: PrimaryProfession[];
  secondary: SecondaryProfession[];
}

export type Personal = {
  name: string;
  age: string;
  story: string;
  reason: string;
}

export type AddApplicationRequestBody = {
  character: Character;
  professions: Professions;
  role: string;
  raid_experience: i.RaidExperience;
  personal: Personal;
}
