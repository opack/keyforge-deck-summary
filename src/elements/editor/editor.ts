import { isNullOrUndefined } from 'util';

import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { LanguagesEnum } from 'enums/languages-enum';
import { I18nService } from 'services/i18n-service';
import { CurrentDeckService } from 'services/current-deck-service';
import { NB_CARDS } from 'models/deck-model';

/**
 * Message sent when the language of the deck has been changed
 */
export class DeckLanguageChanged {
}

@autoinject
export class EditorCustomElement {
  private readonly NB_CARDS = NB_CARDS;
  constructor(
    private i18nService: I18nService,// Do not delete: used in HTML template to interpolate strings
    private currentDeckService: CurrentDeckService,
    private eventAggregator: EventAggregator
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

  removeBackgroundImage(): void {
    this.currentDeckService.deck.backgroundImage = '';
  }

  /**
   * Returns true if the dataURL is not null, not undefined and not empty
   * @param data
   */
  private isValidImageDataURL(dataURL: string) {
    return !isNullOrUndefined(dataURL) && dataURL !== '';
  }

  clearGeneralData() {
    this.currentDeckService.deck.name = '';
    this.currentDeckService.deck.qrcode = '';
    this.currentDeckService.deck.backgroundImage = '';
  }

  clearCards() {
    this.currentDeckService.clearCards();
  }

  clearAll() {
    this.clearGeneralData();
    this.clearCards();
  }

  /**
   * Thanks to Bootstrap that does nothing upon label selection (which is what it uses to render a radio BUTTON...), we had to add
   * a click listener on this label and change the value ourselves, even if we would have loved to be able to rely on the simple
   * checked.bind suggested in the Aurelia doc.
   * have lasted for, like... ever!
   * @param language 
   */
  selectLanguage(language: string) {
    this.currentDeckService.deck.language = LanguagesEnum[language];
    this.eventAggregator.publish(new DeckLanguageChanged());
  }
}
