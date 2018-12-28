import { CardModel } from "models/card-model";
import { HousesEnum } from "enums/houses-enum";
import { TypesEnum } from "enums/types-enum";

const NB_CARDS = 36;

export class App {
  cards: Array<CardModel>;

  constructor() {
    this.cards = new Array<CardModel>(NB_CARDS);
    for (let cur = 0; cur < NB_CARDS; cur++) {
      const rndHouse = Math.random();
      let card = new CardModel();

      card.title = `Default ${cur}`;
      card.type = TypesEnum.Creature;//(rndHouse < 0.25 ? TypesEnum.Action : (rndHouse < 0.50 ? TypesEnum.Artifact : (rndHouse < 0.75 ? TypesEnum.Creature : TypesEnum.Upgrade)));
      card.house = (cur < 12 ? HousesEnum.Logos : (cur < 24 ? HousesEnum.Shadows : HousesEnum.Untamed));
      card.aember = Math.round(Math.random() * 4);
      card.power = Math.round(Math.random() * 12);
      card.armor = Math.round(Math.random() * 2);

      this.cards[cur] = card;
    }

    this.cards.forEach(card => {console.log(`app.ts ${JSON.stringify(card)}`)});
  }
}
