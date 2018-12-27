import {customElement, bindable, computedFrom} from 'aurelia-framework';

import { CardModel } from 'models/card-model';
import { HousesEnum } from 'enums/houses-enum';
import { TypesEnum } from 'enums/types-enum';

export class CardCustomElement {
  @bindable
  private model: CardModel;

  getTypeValue(type: TypesEnum) {
    return TypesEnum[type];
  }

  getHouseValue(house: HousesEnum) {
    return HousesEnum[house];
  }
}