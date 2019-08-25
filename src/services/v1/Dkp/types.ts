type Name = string;

export type XmlAttributes = {
  version: string;
  encoding: string;
}

export type Declaration = {
  attributes: XmlAttributes;
}

export type Guild = {
  list: string;
  time: string;
  guild: Name;
  exporter: Name;
}

export type Player = {
  playername: Name;
  class: Name;
  rank: Name;
  net: string;
  total: string;
  spent: string;
  hours: string;
}

export type Players = {
  type: string;
  name: Name;
  attributes: Player;
}

export type RaidData = {
  type: string;
  name: string;
  attributes: Guild;
  elements: Players[];
}

export type DkpXml = {
  declaration: Declaration;
  elements: RaidData[];
}
