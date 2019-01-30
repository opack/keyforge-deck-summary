import { isNullOrUndefined } from 'util';

import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';

import { DeckModel } from 'models/deck-model';
import { StorageKeysEnum } from 'enums/storage-keys-enum';

import { LocalStorageService, DataStored, DataRemoved, DataCleared } from 'services/local-storage-service';
import { ParametersService } from 'services/parameters-service';
import { CardDataService } from 'services/card-data-service';
import { CurrentDeckService } from 'services/current-deck-service';
import { FileDownloaderService } from 'services/file-downloader-service';
import { I18nService } from 'services/i18n-service';

import { ConfirmDialog } from 'resources/elements/confirm-dialog/confirm-dialog';
import { InputDialog } from 'resources/elements/input-dialog/input-dialog';
import { JsonFetcherService } from 'services/json-fetcher-service';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

/**
 * Message sent when some deck is created
 */
export class CollectionNewDeck {
  constructor() {}
}

/**
 * Message sent when some deck is loaded from collection
 */
export class CollectionLoadDeck {
  constructor() {}
}

@autoinject
export class CollectionCustomElement {  
  decks: Array<DeckModel>;

  constructor(
    private jsonFetcherService: JsonFetcherService,
    private storage: LocalStorageService,
    private currentDeckService: CurrentDeckService,
    private fileDownloaderService: FileDownloaderService,
    private i18nService: I18nService,// Do not delete: used in HTML template to interpolate strings
    private dialogService: DialogService,
    private cardDataService: CardDataService,
    private eventAggregator: EventAggregator,
    private parametersService: ParametersService
    ) {
    // Retrieve the list of stored decks
    this.loadCollection();    

    // Subscribe to any storage change
    eventAggregator.subscribe(DataStored, msg => this.loadCollection());
    eventAggregator.subscribe(DataRemoved, msg => this.loadCollection());
    eventAggregator.subscribe(DataCleared, msg => this.loadCollection());
  }

  loadCollection() {
    this.decks = new Array<DeckModel>();
    const collection = this.storage.retrieve(StorageKeysEnum.Decks);
    if (!isNullOrUndefined(collection)) {
      Object.values(collection).forEach(deck => {
        this.decks.push(deck as DeckModel);
      });
      this.decks.sort();
    }
  }

  new() {
    if (this.currentDeckService.hasChanged()) {
      this.dialogService.open({
        viewModel: ConfirmDialog,
        model: {
          title: this.i18nService.get('ui.collection.confirm-changes-loss-modal.title'),
          message: this.i18nService.get('ui.collection.confirm-changes-loss-modal.message'),
          cancel: this.i18nService.get('ui.collection.confirm-changes-loss-modal.cancel'),
          cancelClass: "btn-success",
          ok: this.i18nService.get('ui.collection.confirm-changes-loss-modal.confirm'),
          okClass: "btn-outline-danger"
        },
        lock: false
      }).whenClosed(response => {
        if (!response.wasCancelled) {
          this.performNew();
        }
      });
    } else {
      this.performNew();
    }
  }

  private performNew(): void {
    this.currentDeckService.newDeck();
    // Switch to editor tab
    this.eventAggregator.publish(new CollectionNewDeck());
  }

  load(deck: DeckModel) {
    // Copy the deck and use it
    if (this.currentDeckService.hasChanged()) {
      this.dialogService.open({
        viewModel: ConfirmDialog,
        model: {
          title: this.i18nService.get('ui.collection.confirm-changes-loss-modal.title'),
          message: this.i18nService.get('ui.collection.confirm-changes-loss-modal.message'),
          cancel: this.i18nService.get('ui.collection.confirm-changes-loss-modal.cancel'),
          cancelClass: "btn-success",
          ok: this.i18nService.get('ui.collection.confirm-changes-loss-modal.confirm'),
          okClass: "btn-outline-danger"
        },
        lock: false
      }).whenClosed(response => {
        if (!response.wasCancelled) {
          this.performLoad(deck);
        }
      });
    } else {
      this.performLoad(deck);
    }
  }

  private performLoad(deck: DeckModel) {
    this.currentDeckService.copyFrom(deck);
    // Switch to summary tab
    this.eventAggregator.publish(new CollectionLoadDeck());
  }

  remove(deck: DeckModel): void {
    this.dialogService.open({
      viewModel: ConfirmDialog,
      model: {
        title: this.i18nService.get('ui.collection.confirm-deck-remove-modal.title'),
        message: this.i18nService.get('ui.collection.confirm-deck-remove-modal.message', {name: deck.name}),
        cancel: this.i18nService.get('ui.collection.confirm-deck-remove-modal.cancel'),
        cancelClass: "btn-success",
        ok: this.i18nService.get('ui.collection.confirm-deck-remove-modal.confirm'),
        okClass: "btn-outline-danger"
      },
      lock: false
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        const collection = this.storage.retrieve(StorageKeysEnum.Decks);
        delete collection[deck.guid];
        this.storage.store(StorageKeysEnum.Decks, collection);
      }
    });
  }

  download(deck: DeckModel): void {
    this.fileDownloaderService.downloadObjectAsJSON(deck, `${deck.name}.kdsd`);
  }

  downloadCollection() {
    // Load every deck from local storage and don't use this.decks as it may have
    // been modified and not saved
    const collection = this.storage.retrieve(StorageKeysEnum.Decks);

    const now = new Date();
    this.fileDownloaderService.downloadObjectAsJSON(collection, `deck-collection-${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}-${now.getHours()}${now.getMinutes()}.kdsc`);
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
    // Clear the value to make sure that a new selection, even with the same file name, will trigger the change event
    this['deckUpload'].value = '';
  }

  importFromKFG() {
    this.dialogService.open({
      viewModel: InputDialog,
      model: {
        title: this.i18nService.get('ui.collection.input-kfg-deck-name-modal.title'),
        message: this.i18nService.get('ui.collection.input-kfg-deck-name-modal.message'),
        cancel: this.i18nService.get('ui.collection.input-kfg-deck-name-modal.cancel'),
        cancelClass: "btn-outline-secondary",
        ok: this.i18nService.get('ui.collection.input-kfg-deck-name-modal.confirm'),
        okClass: "btn-success"
      },
      lock: false
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        const url = `https://www.keyforgegame.com/api/decks/?search=${response.output}`;
        this.jsonFetcherService.fetch(`${PROXY_URL}${url}`).then(result => {
          const data = result.data[0];
          if (isNullOrUndefined(data)) {
            return;
          }
          const deck = new DeckModel();
          deck.guid = data.id;
          deck.name = data.name;
          deck.cards.splice(0);
          const language = this.parametersService.get('app.language');
          deck.language = language;

          const cardIds = data.cards as Array<string>;
          cardIds.forEach(id => {
            const card = this.cardDataService.getById(id, language);
            if (!isNullOrUndefined(card)) {
              deck.cards.push(card.number);
            }
          });

          this.storeDeck(deck);
        });
      }
    });    
  }

  importCollection() {
    const file = this['collectionUpload'].files.item(0);
    const reader = new FileReader();

    reader.onload = event => {
      const collection = JSON.parse(reader.result as string);
      if (!isNullOrUndefined(collection)) {
        Object.values(collection).forEach(deck=> this.storeDeck(deck as DeckModel));
      }
    };
    reader.readAsText(file);
    // Clear the value to make sure that a new selection, even with the same file name, will trigger the change event
    this['collectionUpload'].value = '';
  }

  private storeDeck(deck: DeckModel) {
    let collection = this.storage.retrieve(StorageKeysEnum.Decks);
    if (isNullOrUndefined(collection)) {
      collection = {};
    }
    if (collection.hasOwnProperty(deck.guid)) {
      this.dialogService.open({
        viewModel: ConfirmDialog,
        model: {
          title: this.i18nService.get('ui.collection.confirm-deck-overwrite-modal.title'),
          message: this.i18nService.get('ui.collection.confirm-deck-overwrite-modal.message', {name: deck.name}),
          cancel: this.i18nService.get('ui.collection.confirm-deck-overwrite-modal.cancel'),
          cancelClass: "btn-success",
          ok: this.i18nService.get('ui.collection.confirm-deck-overwrite-modal.confirm'),
          okClass: "btn-outline-danger"
        },
        lock: false
      }).whenClosed(response => {
        if (!response.wasCancelled) {
          collection[deck.guid] = deck;
          this.storage.store(StorageKeysEnum.Decks, collection);
        }
      });
    } else {
      collection[deck.guid] = deck;
      this.storage.store(StorageKeysEnum.Decks, collection);
    }    
  }

  clearCollection() {
    this.dialogService.open({
      viewModel: ConfirmDialog,
      model: {
        title: this.i18nService.get('ui.collection.confirm-collection-clear-modal.title'),
        message: this.i18nService.get('ui.collection.confirm-collection-clear-modal.message'),
        cancel: this.i18nService.get('ui.collection.confirm-collection-clear-modal.cancel'),
        cancelClass: "btn-success",
        ok: this.i18nService.get('ui.collection.confirm-collection-clear-modal.confirm'),
        okClass: "btn-outline-danger"
      },
      lock: false
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.storage.remove(StorageKeysEnum.Decks);
      }
    });    
  }
}
