import { TypesEnum } from 'enums/types-enum';
import { HousesEnum } from 'enums/houses-enum';
import { SkillsEnum } from 'enums/skills-enum';
import { TriggersEnum } from 'enums/triggers-enum';


export class CardModel {
  number: number;
  title: string;
  type: TypesEnum;
  house: HousesEnum;
  aember: number;
  image: string;

  /* Creature properties */
  power: number;
  armor: number;
  skills: Array<SkillsEnum>;

  /* Artifact properties */
  triggers: Array<TriggersEnum>;
}

