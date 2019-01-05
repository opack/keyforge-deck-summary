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
  skills: Array<SkillsEnum>;

  /* Artifact properties */
  trigger: TriggersEnum;

  constructor() {
    // // We must define initial values so that the hash computed on the deck can be compared. Indeed, when
    // // the UI is initialized, all these values receive "undefined". However, when the deck was initially
    // // created, the fields did not exist (unless we initialized them) and thus the hash is different.
    // this.title = undefined;
    // this.type = undefined;
    // this.house = undefined;
    // this.aember = undefined;
    // this.power = undefined;
    // this.armor = undefined;
    // this.skills = new Array<SkillsEnum>();
    // this.trigger = undefined;
  }
}

