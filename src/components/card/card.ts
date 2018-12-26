import { TypesEnum } from 'components/card/TypesEnum';
import {customElement, bindable} from 'aurelia-framework';

import { CardModel } from 'components/card/card-model';

@customElement('card')
export class Card {
  @bindable
  private model: CardModel;
  
  constructor() {
  }
}
