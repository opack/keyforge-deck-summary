import { isNullOrUndefined } from 'util';

import { bindable, autoinject } from 'aurelia-framework';

import { LocalStorageService } from 'services/local-storage-service';
import { I18nService } from 'services/i18n-service';
import { DeckModel } from 'models/deck-model';

@autoinject
export class EditorCustomElement {
  @bindable deck: DeckModel;
  
  constructor(
    private storage: LocalStorageService,
    private i18nService: I18nService,// Do not delete: used in HTML template to interpolate strings
  ) {
  }

  save(): void {
    if (isNullOrUndefined(this.deck) || isNullOrUndefined(this.deck.name)) {
      console.log('Cannot save deck without a name!');
      return;
    }
    // TODO Check for modifications and prompt to indicate current modifications will be lost
    this.storage.store(this.deck.name, this.deck);
  }

  importBackgoundImage(): void {
    const file = this['backgoundUpload'].files.item(0);
    const reader = new FileReader();
    const deck = this.deck;

    reader.onload = event => {
      deck.backgroundImage = reader.result as string;
    };
    reader.readAsDataURL(file);
     // Clear the value to make sure that a new selection, even with the same file name, will trigger the change event
     this['deckUpload'].value = '';
  }
}
