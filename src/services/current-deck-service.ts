import { isNullOrUndefined } from 'util';
import sha1 from 'sha1';
import * as _ from 'lodash';
import { Guid } from 'guid-typescript';

import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { LocalStorageService } from 'services/local-storage-service';
import { DeckModel } from "models/deck-model";
import { StorageKeysEnum } from 'enums/storage-keys-enum';

/**
 * Message sent when a new current deck has been loaded
 */
export class NewDeck {
}

@autoinject
export class CurrentDeckService {
  deck: DeckModel;
  // Hash of the current deck when it was first set as current deck
  originalHash: string;

  constructor(
    private storage: LocalStorageService,
    private eventAggregator: EventAggregator
  ) {
  }

  newDeck(): void {
    this.deck = new DeckModel();
    this.deck.guid = Guid.raw();
    this.initDeck();
  }

  copyFrom(deck: DeckModel) {
    this.deck = _.clone(deck);
    this.initDeck();
  }

  initDeck() {
    this.updateHash();
    this.eventAggregator.publish(new NewDeck());
  }

  clearCards() {
    for (let curCard = 0; curCard < this.deck.cards.length; curCard++) {
      this.deck.cards[curCard] = undefined;
    }
    this.eventAggregator.publish(new NewDeck());
  }

  updateHash(): void {
    this.originalHash = this.hashDeck(this.deck);
  }

  private hashDeck(deck: DeckModel): string {
    const hash = sha1(JSON.stringify(deck, (name, value) => {
        // Ignore fields when the value is undefined, null or empty (string, object or array)
        if (isNullOrUndefined(value)
        || value === ''
        || value === {}
        || (Array.isArray(value) && value.length === 0)) {
          return undefined;
        }
        // Else, let stringify do its job
        return value;
    }));
    return hash;
  }

  hasChanged(): boolean {
    if (isNullOrUndefined(this.deck) || isNullOrUndefined(this.originalHash)) {
      return false;
    }
    return this.hashDeck(this.deck) !== this.originalHash;
  }

  hasCards(): boolean {
    return !isNullOrUndefined(this.deck)
        && !isNullOrUndefined(this.deck.cards)
        && this.deck.cards.length > 0;
  }

  hasQRCode(): boolean {
    return !isNullOrUndefined(this.deck)
        && !isNullOrUndefined(this.deck.qrcode)
        && this.deck.qrcode !== ''
  }

  save(): void {
    if (this.originalHash !== this.hashDeck(this.deck)) {
      let collection = this.storage.retrieve(StorageKeysEnum.Decks);
      if (isNullOrUndefined(collection)) {
        collection = {};
      }
      collection[this.deck.guid] = this.deck;

      this.storage.store(StorageKeysEnum.Decks, collection);
      this.updateHash();
    }
  }

  isValid(): boolean {
    return !isNullOrUndefined(this.deck)
      && !isNullOrUndefined(this.deck.guid);
  }
}
