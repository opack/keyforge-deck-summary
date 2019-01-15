export const NB_CARDS = 36;

export class DeckModel {
  /**
   * Global Unique IDentifier
   */
  guid: string;
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
