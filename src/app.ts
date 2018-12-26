import { CardModel } from "models/card-model";

const NB_CARDS = 36;

export class App {
  cards: Array<CardModel>;

  constructor() {
    this.cards = new Array<CardModel>(NB_CARDS);
    for (let cur = 0; cur < NB_CARDS; cur++) {
      let card = new CardModel();
      card.title = `Default ${cur}`;
      this.cards[cur] = card;
    }
  }
}
