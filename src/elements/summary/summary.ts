import { bindable, BindingEngine, Disposable } from "aurelia-framework";

import { isNullOrUndefined } from "util";

import { CardModel } from "models/card-model";

// TODO Retrieve CardModel properties dynamically
const CARD_PROPERTIES = ['title', 'type', 'house', 'aember', 'power', 'armor'];

export class SummaryCustomElement {
  static inject = [BindingEngine];

  private bindingEngine: BindingEngine;
  private subscriptions: Array<Disposable>;
  private cardsByType: { [type: string]: Array<CardModel> };

  @bindable
  cards: Array<CardModel>;

  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
    this.subscriptions = new Array<Disposable>();

    this.cardsByType = {};
  }

  attached() {
    this.cards.forEach(card => this.subscribeToChangeOnCard(card));
  }

  private subscribeToChangeOnCard(card: CardModel) {
    CARD_PROPERTIES.forEach(property => this.subscribeToChangeOnCardProperty(card, property));
  }

  private subscribeToChangeOnCardProperty(card: CardModel, property: string) {
    const propertyObserver = this.bindingEngine.propertyObserver(card, property);
    const subscription = propertyObserver.subscribe((newValue, oldValue) => this.build());
    this.subscriptions.push(subscription);
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }

  build() {
    this.clear();
    
    // Sort cards by type
    this.sortByTypes();
    
    // Sort by title in each type category
    this.sortByTitle();

    for (let type in this.cardsByType) {
      for (let card of this.cardsByType[type]) {
        console.log(card.title);
      }
    }
  }

  private clear() {
    this.cardsByType = {};
  }

  private sortByTypes(): void {
    this.cards.forEach(card => {
      if (isNullOrUndefined(card) || isNullOrUndefined(card.title)) {
        return;
      }

      let cardsOfThisType: Array<CardModel> = this.cardsByType[card.type];

      if (isNullOrUndefined(cardsOfThisType)) {
        cardsOfThisType = new Array<CardModel>();
        this.cardsByType[card.type] = cardsOfThisType;
      }

      cardsOfThisType.push(card);
    });
  }

  private sortByTitle(): void {
    for (let type in this.cardsByType) {
      this.cardsByType[type].sort((cardModelA, cardModelB) => {
        const titleA = cardModelA.title.toLowerCase();
        const titleB = cardModelB.title.toLowerCase();
        if (titleA > titleB) {
          return 1;
        }
        if (titleA < titleB) {
          return -1;
        }
        return 0;
      });
    }
  }
}
