import {customElement, bindable} from 'aurelia-framework';

import { CardModel } from 'models/card-model';

export class CardCustomElement {
  @bindable
  private model: CardModel;
  
  constructor() {
  }
}
