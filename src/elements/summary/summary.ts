import { isNullOrUndefined } from 'util';

import { bindable, observable } from 'aurelia-framework';

import * as html2canvas from 'html2canvas';
import fitty from 'fitty';
import * as QRCode from 'qrcode';

import { DeckModel } from 'models/deck-model';
import { CardModel } from 'models/card-model';
import { CardPropertiesEnum } from 'enums/card-properties-enum';

import { JsonFetcherService } from 'services/json-fetcher-service';

export class SummaryCustomElement {
  @observable({changeHandler: 'parameterChanged'}) private groupingProperty: CardPropertiesEnum;
  @observable({changeHandler: 'parameterChanged'}) private sortingProperty: CardPropertiesEnum;
  private groups: Array<string>;
  private cardsByGroup: { [group: string]: Array<CardModel> };

  @bindable
  deck: DeckModel;

  // TODO Create a service that will be used in every TS and HTML file
  i18n: any;

  constructor() {
    this.groups = new Array<string>();
    this.cardsByGroup = {};

    // TODO in parameterChanged, check if oldValue was undefined and do not rebuild in this case to avoid the following problem
    // Do this last, as it will trigger an initial summary rebuild
    this.groupingProperty = CardPropertiesEnum.Type;
    this.sortingProperty = CardPropertiesEnum.Title;
  }

  bind() {
    new JsonFetcherService().fetch('i18n-en.json').then(data => {
      this.i18n = data;
    });
  }

  getCardPropertyValue(property: string) {
    return CardPropertiesEnum[property];
  }

  parameterChanged(newValue: CardPropertiesEnum, oldValue: CardPropertiesEnum) {
    this.rebuild();
  }

  rebuild() {
    this.clear();

    if (isNullOrUndefined(this.deck) || isNullOrUndefined(this.deck.cards)) {
      return;
    }
   
    // Sort cards by grouping field
    this.groupCards();
    
    // Sort cards in each group by sorting field
    this.sortInGroups();

    // Fit titles to match container width. Titles will only scale down to ensure
    // all text title fits.
    // TODO Trigger this when the summary is displayed because if rebuild() is called while the summary is not visible, fitty does nothing :-(
    fitty('.fit');

    // Redraw QR-code
    this.updateQRCode();
  }

  private updateQRCode() {
    // If a QR code value is specified, then render it
    const canvas = this['qrcode'];
    if (isNullOrUndefined(this.deck.qrcode) || this.deck.qrcode === '') {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      QRCode.toCanvas(canvas, this.deck.qrcode);
    }
  }
  
  private clear(): void {
    this.cardsByGroup = {};
    this.groups.splice(0);
  }

  private groupCards(): void {
    this.deck.cards.forEach(card => {
      // If the card is not defined, then skip it
      if (isNullOrUndefined(card) || isNullOrUndefined(card[this.groupingProperty])) {
        return;
      }

      // Retrieve the value (as a string) of the grouping field for this card
      const group = card[this.groupingProperty].toString();

      // Retrieve the array of cards for this group
      let cardsOfThisGroup: Array<CardModel> = this.cardsByGroup[group];
      
      if (isNullOrUndefined(cardsOfThisGroup)) {
        cardsOfThisGroup = new Array<CardModel>();
        this.cardsByGroup[group] = cardsOfThisGroup;

        // There is a new group: add it to the list
        this.groups.push(group);
      }

      // Add the card to the group
      cardsOfThisGroup.push(card);
    });

    // Sort group-list
    this.groups.sort();
  }

  private sortInGroups(): void {
    for (let type in this.cardsByGroup) {
      this.cardsByGroup[type].sort((cardModelA, cardModelB) => {
        // Convert each field value to lower case string
        const valueA = cardModelA[this.sortingProperty].toString().toLowerCase();
        const valueB = cardModelB[this.sortingProperty].toString().toLowerCase();

        // Compare
        if (valueA > valueB) {
          return 1;
        }
        if (valueA < valueB) {
          return -1;
        }
        return 0;
      });
    }
  }

  /**
   * Fetch the string corresponding to the group
   * @param group 
   */
  getGroupTitle(group: string): string {
    return this.i18n.groupTitles[this.groupingProperty][group];
  }

  download() {
    html2canvas(document.getElementById('summary-cards')).then(canvas => {
        var a = document.createElement('a');
        a.href = canvas.toDataURL();
        a.download = 'summary-cards.png';
        a.click();
      }
    );
  }
}
