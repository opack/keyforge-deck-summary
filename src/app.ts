import * as $ from 'jquery';

import { SummaryCustomElement } from './elements/summary/summary';
import { CardModel } from "models/card-model";
import { HousesEnum } from "enums/houses-enum";
import { TypesEnum } from "enums/types-enum";

const NB_CARDS = 36;

export class App {
  cards: Array<CardModel>;

  constructor() {
    // TODO Be able to save and load (JSON)
    this.cards = new Array<CardModel>(NB_CARDS);
    for (let cur = 0; cur < NB_CARDS; cur++) {
      const rndHouse = Math.random();
      let card = new CardModel();

      card.title = `Default ${cur}`;
      card.type = (rndHouse < 0.25 ? TypesEnum.Action : (rndHouse < 0.50 ? TypesEnum.Artifact : (rndHouse < 0.75 ? TypesEnum.Creature : TypesEnum.Upgrade)));
      card.house = (cur < 12 ? HousesEnum.Logos : (cur < 24 ? HousesEnum.Shadows : HousesEnum.Untamed));
      card.aember = Math.round(Math.random() * 4);
      card.power = Math.round(Math.random() * 12);
      card.armor = Math.round(Math.random() * 2);

      this.cards[cur] = card;
    }

    this.cards.forEach(card => {console.log(`app.ts ${JSON.stringify(card)}`)});
  }

  attached() {
    $('a[data-toggle="tab"]').on('show.bs.tab', e => {
      // If the tab that is going to be displayed is the summary, then rebuild it
      if (e.target.id === 'nav-summary-tab') {
        // Access the 'summary' variable created thanks to the view-model.ref in the html.
        // As the @child can only target immediate child, this method allows targetting
        // the view-model of the nested <summary> tag, and calling its rebuild() method.
        // As this variable is created dynamically, then we use the array way of accessing
        // the property to avoid compilation errors.
        this['summary'].rebuild();
      }
    });
  }
}
