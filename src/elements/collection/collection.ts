import * as _ from 'lodash';

import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { DeckModel } from 'models/deck-model';

import { LocalStorageService, DataStored, DataRemoved, DataCleared } from 'services/local-storage-service';
import { CurrentDeckService } from 'services/current-deck-service';
import { FileDownloaderService } from 'services/file-downloader-service';

const NB_CARDS = 36;

@autoinject
export class CollectionCustomElement {
  decks: Array<DeckModel>;

  constructor(private storage: LocalStorageService, private currentDeck: CurrentDeckService, private eventAggregator: EventAggregator, private fileDownloaderService: FileDownloaderService) {
    // Retrieve the list of stored decks
    this.loadCollection();    

    // Subscribe to any storage change
    eventAggregator.subscribe(DataStored, msg => this.loadCollection());
    eventAggregator.subscribe(DataRemoved, msg => this.loadCollection());
    eventAggregator.subscribe(DataCleared, msg => this.loadCollection());
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
    const workingCopy = _.clone(deck);

    // Use it
    this.currentDeck.deck = workingCopy;
  }

  remove(deck: DeckModel): void {
    this.storage.remove(deck.name);
  }

  download(deck: DeckModel): void {
    this.fileDownloaderService.downloadObjectAsJSON(deck, `${deck.name}.json`);
  }

  downloadCollection() {
    // Load every deck from local storage and don't use this.decks as it may have
    // been modified and not saved
    const collection = new Array<DeckModel>();
    this.storage.getKeys().forEach(key => {
      const deck = this.storage.retrieve(key);
      collection.push(deck);
    });

    const now = new Date();
    this.fileDownloaderService.downloadObjectAsJSON(collection, `deck-collection-${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}-${now.getHours()}${now.getMinutes()}.json`);
  }

  importDeck() {
    const files = this['deckUpload'].files;
    for (let cur = 0; cur < files.length; cur++) {
      const file = files.item(cur);
      const reader = new FileReader();

      reader.onload = event => {
        const deck: DeckModel = JSON.parse(reader.result as string) as DeckModel;
        this.storeDeck(deck);
      };
      reader.readAsText(file);
    }
  }

  importCollection() {
    const file = this['collectionUpload'].files.item(0);
    const reader = new FileReader();

    reader.onload = event => {
      const collection: Array<DeckModel> = JSON.parse(reader.result as string) as Array<DeckModel>;
      collection.forEach(deck => this.storeDeck(deck));
    };
    reader.readAsText(file);
  }

  private storeDeck(deck) {
    // TODO If the deck already exists, prompt to confirm overwrite
    this.storage.store(deck.name, deck);
  }

  clearCollection() {
    this.storage.clear();
  }
}
