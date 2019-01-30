import { isNullOrUndefined } from 'util';
import 'bootstrap';
import 'bootstrap-select';

import { bindable, autoinject, observable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ParametersService } from 'services/parameters-service';
import { CardDataService } from 'services/card-data-service';
import { CurrentDeckService, NewDeck } from 'services/current-deck-service';
import { I18nService } from 'services/i18n-service';
import { DeckLanguageChanged } from '../editor';

enum ErrorStatesClasses {
  Valid = 'is-valid',
  Warning = 'border-warning',
  Error = 'is-invalid'
}

@autoinject
export class CardCustomElement {
  @bindable private index: number;
  @observable private cardNumber: string;
  private maxCardNumber: number;
  private image: string;
  private stateClass: ErrorStatesClasses;

  constructor(
    private currentDeckService: CurrentDeckService,
    private cardDataService: CardDataService,
    private i18nService: I18nService,// Do not delete: used in HTML template to interpolate strings
    private parametersService: ParametersService,
    eventAggregator: EventAggregator
  ) {
    this.maxCardNumber = this.cardDataService.getCardCount();
    
    // Subscribe to any current deck change
    eventAggregator.subscribe(NewDeck, msg => this.readCardNumber());
    eventAggregator.subscribe(DeckLanguageChanged, msg => this.updateCardDisplay());
  }

  private readCardNumber() {
    // Initialize the card number based on the index
    this.cardNumber = `${this.currentDeckService.deck.cards[this.index]}`;
    this.updateStateClass();
  }

  cardNumberChanged() {
    this.updateCardDisplay();
  }

  private updateCardDisplay() {
    this.updateStateClass();
    if (this.stateClass === ErrorStatesClasses.Valid) {
      const cardNumber: number = parseInt(this.cardNumber);
      const selectedCard = this.cardDataService.getByNumber(cardNumber, this.currentDeckService.deck.language);
      if (isNullOrUndefined(selectedCard)) {
        this.image = 'images/misc/no-card.png';
      } else {
        this.currentDeckService.deck.cards[this.index] = cardNumber;
        this.image = selectedCard.image;
      }
    }
    // If error or warning, display an empty image
    else {
      this.image = 'images/misc/no-card.png';
    }
  }

  private updateStateClass() {
    if (isNullOrUndefined(this.cardNumber) || this.cardNumber === '') {
      this.stateClass = ErrorStatesClasses.Warning;
    } else if (
      this.cardNumber.match('\\d{1,3}')
      && this.cardDataService.has(parseInt(this.cardNumber), this.currentDeckService.deck.language)
    ) {
      this.stateClass = ErrorStatesClasses.Valid;
    } else {
      this.stateClass = ErrorStatesClasses.Error
    }
  }
}
