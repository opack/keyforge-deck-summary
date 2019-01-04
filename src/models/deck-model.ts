import { CardModel } from "./card-model";

export class DeckModel {
  name: string;
  qrcode: string;
  /**
   * Image as data URL
   */
  backgroundImage: string;
  cards: Array<CardModel>;

  init(nbCards: number) {
    this.cards = new Array<CardModel>(nbCards);
    for (let cur = 0; cur < nbCards; cur++) {
      this.cards[cur] = new CardModel();
    }
  }
}
