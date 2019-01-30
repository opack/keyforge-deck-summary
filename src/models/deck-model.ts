import { LanguagesEnum } from 'enums/languages-enum';
export const NB_CARDS = 36;

export class DeckModel {
  /**
   * Global Unique IDentifier
   */
  guid: string;
  name: string;
  qrcode: string;
  language: LanguagesEnum;
  /**
   * Image as data URL
   */
  backgroundImage: string;
  cards: Array<number>;

  constructor(nbCards = NB_CARDS) {
    this.guid = '';
    this.name = '';
    this.qrcode = '';
    this.language = LanguagesEnum.en;
    this.backgroundImage = '';
    this.cards = new Array<number>(nbCards);
  }
}
