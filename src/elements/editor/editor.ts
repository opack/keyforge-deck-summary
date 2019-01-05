import { autoinject } from 'aurelia-framework';

import { I18nService } from 'services/i18n-service';
import { CurrentDeckService } from 'services/current-deck-service';

@autoinject
export class EditorCustomElement {
  constructor(
    private i18nService: I18nService,// Do not delete: used in HTML template to interpolate strings
    private currentDeckService: CurrentDeckService
  ) {
  }

  save(): void {
    if (!this.currentDeckService.isValid()) {
      console.log('Cannot save deck without a name!');
      return;
    }
    // TODO Barre de progression ou spin d'attente
    this.currentDeckService.save();
  }

  importBackgoundImage(): void {
    const file = this['backgoundUpload'].files.item(0);
    const reader = new FileReader();
    const deck = this.currentDeckService.deck;

    reader.onload = event => {
      deck.backgroundImage = reader.result as string;
    };
    reader.readAsDataURL(file);
     // Clear the value to make sure that a new selection, even with the same file name, will trigger the change event
     this['deckUpload'].value = '';
  }
}
