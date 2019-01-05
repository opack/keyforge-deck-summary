import { isNullOrUndefined } from 'util';

import * as hash from 'object-hash';
import * as _ from 'lodash';

import { LocalStorageService } from 'services/local-storage-service';

import { DeckModel } from "models/deck-model";
import { autoinject } from 'aurelia-framework';

@autoinject
export class CurrentDeckService {
  deck: DeckModel;
  // Hash of the current deck when it was first set as current deck
  originalHash: string;

  constructor(private storage: LocalStorageService) {

  }

  newDeck(): void {
    this.deck = new DeckModel();
    this.updateHash();
  }

  copyFrom(deck: DeckModel) {
    this.deck = _.clone(deck);
    this.updateHash();
  }

  updateHash(): void {
    this.originalHash = this.hash(this.deck);
  }

  private hash(deck: DeckModel): string {
    return hash(deck, {
      excludeKeys: key => {
        // Ignore fields when the value is undefined
        return isNullOrUndefined(deck[key]);
      }
    });
  }

  hasChanged(): boolean {
    if (isNullOrUndefined(this.deck) || isNullOrUndefined(this.originalHash)) {
      return false;
    }
    return this.hash(this.deck) !== this.originalHash;
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
    if (this.originalHash !== hash(this.deck)) {
      this.storage.store(this.deck.name, this.deck);
      this.updateHash();
    }
  }

  isValid(): boolean {
    return !isNullOrUndefined(this.deck)
        && !isNullOrUndefined(this.deck.name);
  }
}
