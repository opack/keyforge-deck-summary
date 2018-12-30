import { CardModel } from 'models/card-model';

import fitty from 'fitty';

export class SummaryCardCustomElement {
  model: CardModel;

  activate(model: CardModel) {
    this.model = model;
  }

  attached() {
    fitty('.fit');
  }
}
