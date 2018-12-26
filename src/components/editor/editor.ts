import { bindable } from 'aurelia-framework';

import { CardModel } from "components/card/card-model";

export class Editor {
  @bindable
  cards: Array<CardModel>;

  constructor() {
  }
}
