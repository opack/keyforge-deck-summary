import { autoinject } from 'aurelia-framework';

import { I18nService } from 'services/i18n-service';
import { CurrentDeckService } from 'services/current-deck-service';
import { NB_CARDS } from 'models/deck-model';
import { isNullOrUndefined } from 'util';

@autoinject
export class EditorCustomElement {
  private readonly NB_CARDS = NB_CARDS;
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
     this['backgoundUpload'].value = '';
  }

  /**
   * Returns true if the dataURL is not null, not undefined and not empty
   * @param data
   */
  private isValidImageDataURL(dataURL: string) {
    return !isNullOrUndefined(dataURL) && dataURL !== '';
  }
}
