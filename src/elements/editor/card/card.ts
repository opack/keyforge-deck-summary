import { bindable } from 'aurelia-framework';

import { CardModel } from 'models/card-model';
import { HousesEnum } from 'enums/houses-enum';
import { TypesEnum } from 'enums/types-enum';
import { SkillsEnum } from 'enums/skills-enum';
import { TriggersEnum } from 'enums/triggers-enum';

export class CardCustomElement {
  @bindable
  private model: CardModel;

  getTypeValue(type: TypesEnum) {
    return TypesEnum[type];
  }

  getHouseValue(house: HousesEnum) {
    return HousesEnum[house];
  }

  getSkillValue(skill: SkillsEnum) {
    return SkillsEnum[skill];
  }

  getTriggerValue(trigger: TriggersEnum) {
    return TriggersEnum[trigger];
  }
}
