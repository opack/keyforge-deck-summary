import { CardModel } from "models/card-model";
import { HousesEnum } from "enums/houses-enum";
import { TypesEnum } from "enums/types-enum";

const NB_CARDS = 36;

export class App {
  cards: Array<CardModel>;

  constructor() {
    this.cards = new Array<CardModel>(NB_CARDS);
    for (let cur = 0; cur < NB_CARDS; cur++) {
      let card = new CardModel();
      card.title = `Default ${cur}`;
      card.type = TypesEnum.Creature;
      card.house = HousesEnum.Logos;
      card.aember = 3;
      card.power = 12;
      card.armor = 2;
      this.cards[cur] = card;
    }

    this.cards.forEach(card => {console.log(`app.ts ${JSON.stringify(card)}`)});
  }
}
