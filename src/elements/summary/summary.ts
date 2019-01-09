import { isNullOrUndefined } from 'util';

import { observable, autoinject } from 'aurelia-framework';

import * as html2canvas from 'html2canvas';
import fitty from 'fitty';
import * as QRCode from 'qrcode';

import { CardModel } from 'models/card-model';
import { CardPropertiesEnum } from 'enums/card-properties-enum';

import { FileDownloaderService } from 'services/file-downloader-service';
import { I18nService } from 'services/i18n-service';
import { CurrentDeckService } from 'services/current-deck-service';
import { CardDataService } from 'services/card-data-service';

@autoinject
export class SummaryCustomElement {
  @observable({changeHandler: 'parameterChanged'}) private showHouses: boolean;

  @observable({changeHandler: 'parameterChanged'}) private groupingProperty: CardPropertiesEnum;
  @observable({changeHandler: 'parameterChanged'}) private sortingProperty: CardPropertiesEnum;
  private groups: Array<string>;
  private cardsByGroup: { [group: string]: Array<CardModel> };
  /**
   * This field is used in the template and contains the dataURL of the image of the qr code
   */
  private qrcode: string;

  /**
   * This field is used in the template and contains the name of the first house of the deck
   */
  private house1: string;
  /**
   * This field is used in the template and contains the name of the second house of the deck
   */
  private house2: string;
  /**
   * This field is used in the template and contains the name of the third house of the deck
   */
  private house3: string;

  constructor(
    private fileDownloaderService: FileDownloaderService,
    private i18nService: I18nService,
    private currentDeckService: CurrentDeckService,
    private cardDataService: CardDataService
  ) {
    this.groups = new Array<string>();
    this.cardsByGroup = {};

    // Do this last, as it will trigger an initial summary rebuild
    this.groupingProperty = CardPropertiesEnum.Type;
    this.sortingProperty = CardPropertiesEnum.Title;
  }

  getCardPropertyValue(property: string) {
    return CardPropertiesEnum[property];
  }

  parameterChanged(newValue: CardPropertiesEnum, oldValue: CardPropertiesEnum) {
    this.rebuild();
  }

  rebuild() {
    this.clear();

    if (!this.currentDeckService.isValid() || !this.currentDeckService.hasCards()) {
      return;
    }
   
    // Sort cards by grouping field
    this.groupCards();
    
    // Sort cards in each group by sorting field
    this.sortInGroups();

    // Fit titles to match container width. Titles will only scale down to ensure
    // all text title fits.
    fitty('.fit');

    // Redraw QR-code
    this.updateQRCode();

    // Retrieve the 3 houses of the deck
    this.updateHouses();
  }

  private updateHouses() {
    const houses = new Array<string>();
    // Retrieve all the houes of the deck in a list
    this.currentDeckService.deck.cards.forEach(cardNumber => {
      const card = this.cardDataService.get(cardNumber);
      if (isNullOrUndefined(card)) {
        return;
      }

      const house = card.house;
      if (!houses.includes(house)) {
        houses.push(house);
      }
    });

    // Sort the houses based on their translated name
    houses.sort((houseA, houseB) => {
      const translatedA = this.i18nService.get(`houses.${houseA}`);
      const translatedB = this.i18nService.get(`houses.${houseB}`);
      if (translatedA > translatedB) {
        return 1;
      } else  if (translatedA < translatedB) {
        return -1;
      } else {
        return 0;
      }
    });

    this.house1 = houses[0];
    this.house2 = houses[1];
    this.house3 = houses[2];
  }

  private updateQRCode() {
    // If a QR code value is specified, then render it
    if (this.currentDeckService.hasQRCode()) {
      // Use the toDataURL() method and not toCanvas() to be able to manipulate the final image size
      QRCode.toDataURL(this.currentDeckService.deck.qrcode).then(result => this.qrcode = result);
    } else {
      this.qrcode = "";
    }
  }
  
  private clear(): void {
    this.cardsByGroup = {};
    this.groups.splice(0);
  }

  private groupCards(): void {
    this.currentDeckService.deck.cards.forEach(cardNumber => {
      const card = this.cardDataService.get(cardNumber);

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
    return this.i18nService.get(`groupTitles.${this.groupingProperty}.${group}`);
  }

  download() {
    html2canvas(document.getElementById('summary-cards')).then(canvas => {
        this.fileDownloaderService.download(canvas.toDataURL(), `${this.currentDeckService.deck.name}.png`);
      }
    );
  }
}
