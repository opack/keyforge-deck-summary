import { isNullOrUndefined } from 'util';
import 'bootstrap';
import 'bootstrap-select';

import { bindable, autoinject, observable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { CardDataService } from 'services/card-data-service';
import { CurrentDeckService, NewDeck } from 'services/current-deck-service';

@autoinject
export class CardCustomElement {
  @bindable private index: number;
  @observable private cardNumber: number;
  private maxCardNumber: number;
  private image: string;

  constructor(
    private currentDeckService: CurrentDeckService,
    private cardDataService: CardDataService,
    eventAggregator: EventAggregator
  ) {
    this.maxCardNumber = this.cardDataService.getCardCount();
    
    // Subscribe to any current deck change
    eventAggregator.subscribe(NewDeck, msg => this.readCardNumber());
  }

  private readCardNumber() {
    // Initialize the card number based on the index
    this.cardNumber = this.currentDeckService.deck.cards[this.index];
  }

  cardNumberChanged() {
    this.currentDeckService.deck.cards[this.index] = this.cardNumber;

    const selectedCard = this.cardDataService.get(this.cardNumber);
    if (isNullOrUndefined(selectedCard)) {
      this.image = 'images/misc/no-card.png';
    } else {
      this.image = selectedCard.image;
    }
  }
}
