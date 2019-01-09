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
    this.cards = new Array<number>(nbCards);
  }
}
