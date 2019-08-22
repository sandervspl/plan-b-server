import * as i from 'types';

export type Characterrole = i.BaseResponseBody & {
  name: string;
  icon: i.Image;
}

export type Profession = i.BaseResponseBody & {
  name: string;
  primary: boolean;
  icon: i.Image;
}

export type ApplicationProfessionDetail = i.BaseResponseBody & {
  profession: number;
  application: number;
  level: number;
}

export type CmsApplicationBody = {
  char_name: string;
  char_level: number;
  char_server: string;
  name: string;
  age: number;
  story: string;
  char_raid_experience: i.RaidExperience;
  class: number;
  characterrole: string;
  reason: string;
  race: number;
  professions: number[];
  social: boolean;
}

export type CmsApplicationResponse = i.BaseResponseBody & {
  char_name: string;
  char_level: number;
  char_server: string;
  name: string;
  age: number;
  story: string;
  status: string;
  char_raid_experience: i.RaidExperience;
  class: i.Class;
  characterrole: Characterrole;
  locked: boolean;
  reason: string;
  race: i.Race;
  professions: Profession[];
  applicationprofessions: ApplicationProfessionDetail[];
  social: boolean;
};
