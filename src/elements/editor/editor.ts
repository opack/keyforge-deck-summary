import { bindable } from 'aurelia-framework';

import { CardModel } from "models/card-model";

export class EditorCustomElement {
  @bindable
  cards: Array<CardModel>;

  constructor() {
  }
}
