import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { DeckModel } from 'models/deck-model';

import { LocalStorageService, DataStored, DataRemoved } from './../../services/local-storage-service';
import { CurrentDeckService } from './../../services/current-deck-service';

const NB_CARDS = 36;

@autoinject
export class CollectionCustomElement {
  decks: Array<DeckModel>;

  constructor(private storage: LocalStorageService, private currentDeck: CurrentDeckService, private eventAggregator: EventAggregator) {
    // Retrieve the list of stored decks
    this.loadCollection();    

    // Subscribe to any storage change
    eventAggregator.subscribe(DataStored, msg => this.loadCollection());
    eventAggregator.subscribe(DataRemoved, msg => this.loadCollection());
  }

  loadCollection() {
    this.decks = new Array<DeckModel>();
    this.storage.getKeys().forEach(key => {
      const deck = this.storage.retrieve(key);
      this.decks.push(deck);
    });
  }

  new() {
    const deck = new DeckModel();
    deck.init(NB_CARDS);
    this.currentDeck.deck = deck;
  }

  load(deck: DeckModel) {
    // Copy the deck
    // Attention! This copy technique might not work with dates (which we are not using... for the moment)
    const workingCopy = JSON.parse(JSON.stringify(deck));

    // Use it
    this.currentDeck.deck = workingCopy;
  }

  remove(deck: DeckModel) {
    this.storage.remove(deck.name);
  }
}
