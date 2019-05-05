/* eslint-disable @typescript-eslint/no-explicit-any */

type Emblem = {
  icon: number;
  iconColor: string;
  iconColorId: number;
  border: number;
  borderColor: string;
  borderColorId: number;
  backgroundColor: string;
  backgroundColorId: number;
}

type Guild = {
  name: string;
  realm: string;
  battlegroup: string;
  members: number;
  achievementPoints: number;
  emblem: Emblem;
}

type TooltipParams = {
  transmogItem: number;
  timewalkerLevel: number;
  azeritePower0: number;
  azeritePower1: number;
  azeritePower2: number;
  azeritePower3: number;
  azeritePowerLevel: number;
  azeritePower4: number;
}

type Stat = {
  stat: number;
  amount: number;
}

type Appearance = {
  itemId: number;
  itemAppearanceModId: number;
  transmogItemAppearanceModId: number;
}

type AzeriteItem = {
  azeriteLevel: number;
  azeriteExperience: number;
  azeriteExperienceRemaining: number;
}

type AzeritePower = {
  id: number;
  tier: number;
  spellId: number;
  bonusListId: number;
}

type AzeriteEmpoweredItem = {
  azeritePowers: AzeritePower[];
}

type Head = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Stat2 = {
  stat: number;
  amount: number;
}

type Appearance2 = {
}

type AzeriteItem2 = {
  azeriteLevel: number;
  azeriteExperience: number;
  azeriteExperienceRemaining: number;
}

type AzeriteEmpoweredItem2 = {
  azeritePowers: any[];
}

type Neck = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat2[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem2;
}

type Shoulder = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Back = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Chest = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Tabard = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: any[];
  armor: number;
  context: string;
  bonusLists: any[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Wrist = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Hands = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Waist = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Legs = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Feet = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Finger1 = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Finger2 = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Trinket1 = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Trinket2 = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance;
  azeriteItem: AzeriteItem;
  azeriteEmpoweredItem: AzeriteEmpoweredItem;
}

type Damage = {
  min: number;
  max: number;
  exactMin: number;
  exactMax: number;
}

type WeaponInfo = {
  damage: Damage;
  weaponSpeed: number;
  dps: number;
}

type Appearance16 = {
  itemId: number;
  enchantDisplayInfoId: number;
  itemAppearanceModId: number;
  transmogItemAppearanceModId: number;
}

type AzeriteItem16 = {
  azeriteLevel: number;
  azeriteExperience: number;
  azeriteExperienceRemaining: number;
}

type AzeriteEmpoweredItem16 = {
  azeritePowers: any[];
}

type MainHand = {
  id: number;
  name: string;
  icon: string;
  quality: number;
  itemLevel: number;
  tooltipParams: TooltipParams;
  stats: Stat[];
  armor: number;
  weaponInfo: WeaponInfo;
  context: string;
  bonusLists: number[];
  artifactId: number;
  displayInfoId: number;
  artifactAppearanceId: number;
  artifactTraits: any[];
  relics: any[];
  appearance: Appearance16;
  azeriteItem: AzeriteItem16;
  azeriteEmpoweredItem: AzeriteEmpoweredItem16;
}

type Items = {
  averageItemLevel: number;
  averageItemLevelEquipped: number;
  head: Head;
  neck: Neck;
  shoulder: Shoulder;
  back: Back;
  chest: Chest;
  tabard: Tabard;
  wrist: Wrist;
  hands: Hands;
  waist: Waist;
  legs: Legs;
  feet: Feet;
  finger1: Finger1;
  finger2: Finger2;
  trinket1: Trinket1;
  trinket2: Trinket2;
  mainHand: MainHand;
}

export interface Primary {
  id: number;
  name: string;
  icon: string;
  rank: number;
  max: number;
  recipes: number[];
}

export interface Secondary {
  id: number;
  name: string;
  icon: string;
  rank: number;
  max: number;
  recipes: number[];
}

export interface Professions {
  primary: Primary[];
  secondary: Secondary[];
}

export type CharacterData = {
  lastModified: number;
  name: string;
  realm: string;
  battlegroup: string;
  class: {
    id: number;
    mask: number;
    powerType: string;
    name: string;
  };
  race: number;
  gender: number;
  level: number;
  achievementPoints: number;
  thumbnail: string;
  calcClass: string;
  faction: number;
  guild: Guild;
  items: Items;
  totalHonorableKills: number;
  professions: Professions;
}
