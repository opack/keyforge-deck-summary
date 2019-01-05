import { CardModel } from "./card-model";

const NB_CARDS = 36;

export class DeckModel {
  name: string;
  qrcode: string;
  /**
   * Image as data URL
   */
  backgroundImage: string;
  cards: Array<CardModel>;

  constructor(nbCards = NB_CARDS) {
    this.cards = new Array<CardModel>(nbCards);
    for (let cur = 0; cur < nbCards; cur++) {
      this.cards[cur] = new CardModel();
    }
  }
}
