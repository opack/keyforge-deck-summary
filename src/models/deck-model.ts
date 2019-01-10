export const NB_CARDS = 36;

export class DeckModel {
  name: string;
  qrcode: string;
  /**
   * Image as data URL
   */
  backgroundImage: string;
  cards: Array<number>;

  constructor(nbCards = NB_CARDS) {
<<<<<<< HEAD
    this.cards = new Array<number>(nbCards);
=======
    this.cards = new Array<CardModel>(nbCards);
    for (let cur = 0; cur < nbCards; cur++) {
      this.cards[cur] = new CardModel();
    }
>>>>>>> 3deffa99fc753e3a6559c09c222ea3c976db6626
  }
}
