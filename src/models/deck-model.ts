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
    // // We must define initial values so that the hash computed on the deck can be compared. Indeed, when
    // // the UI is initialized, all these values receive "undefined". However, when the deck was initially
    // // created, the fields did not exist (unless we initialized them) and thus the hash is different.
    // this.name = '';
    // this.qrcode = '';
    // this.backgroundImage = '';

    this.cards = new Array<CardModel>(nbCards);
    for (let cur = 0; cur < nbCards; cur++) {
      this.cards[cur] = new CardModel();
    }
  }
}
