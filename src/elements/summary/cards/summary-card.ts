import { bindable } from "aurelia-framework";

import { CardModel } from "models/card-model";

export class SummaryCardCustomElement {
  model: CardModel;

  activate(model: CardModel) {
    this.model = model;
  }
}
