import { isNullOrUndefined } from 'util';

import { inject, bindable } from 'aurelia-framework';

import { LocalStorageService } from 'services/local-storage-service';
import { DeckModel } from 'models/deck-model';

@inject(LocalStorageService)
export class EditorCustomElement {
  @bindable deck: DeckModel;
  
  constructor(private storage: LocalStorageService) {
  }

  save(): void {
    if (isNullOrUndefined(this.deck) || isNullOrUndefined(this.deck.name)) {
      console.log('Cannot save deck without a name!');
      return;
    }
    this.storage.store(this.deck.name, this.deck);
  }
}
