import { TypesEnum } from 'enums/types-enum';
import { HousesEnum } from 'enums/houses-enum';
import { SkillsEnum } from 'enums/skills-enum';
import { TriggersEnum } from 'enums/triggers-enum';


export class CardModel {
  title: string;
  type: TypesEnum;
  house: HousesEnum;
  aember: number;

  /* Creature properties */
  power: number;
  armor: number;
  skills: SkillsEnum[];

  /* Artifact properties */
  trigger: TriggersEnum;
}

