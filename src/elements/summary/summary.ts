import { isNullOrUndefined } from 'util';

import { bindable, BindingEngine, observable } from 'aurelia-framework';

import { CardModel } from 'models/card-model';
import { CardPropertiesEnum } from 'enums/card-properties-enum';

import { PropertyObserverService, PropertyChangedListener } from 'services/property-observer-service';
import { JsonFetcherService } from 'services/json-fetcher-service';

export class SummaryCustomElement implements PropertyChangedListener {
  static inject = [BindingEngine];
  private propertyObserver: PropertyObserverService;

  @observable({changeHandler: 'parameterChanged'}) private groupingProperty: CardPropertiesEnum;
  @observable({changeHandler: 'parameterChanged'}) private sortingProperty: CardPropertiesEnum;
  private groups: Array<string>;
  private cardsByGroup: { [group: string]: Array<CardModel> };

  @bindable
  cards: Array<CardModel>;

  // TODO Create a service that will be used in every TS and HTML file
  i18n: any;

  constructor(bindingEngine: BindingEngine) {
    this.propertyObserver = new PropertyObserverService(bindingEngine, this);

    this.groups = new Array<string>();
    this.cardsByGroup = {};

    // Do this last, as it will trigger an initial summary rebuild
    this.groupingProperty = CardPropertiesEnum.Type;
    this.sortingProperty = CardPropertiesEnum.Title;
  }

  bind() {
    new JsonFetcherService().fetch('i18n-en.json').then(data => {
      this.i18n = data;
    });
  }

  attached() {
    const properties = new Array<string>();
    for (let enumValue in CardPropertiesEnum) {
      properties.push(CardPropertiesEnum[enumValue]);
    }

    this.propertyObserver.observeAll(this.cards, properties);
  }

  detached() {
    this.propertyObserver.dispose();
  }

  getCardPropertyValue(property: string) {
    return CardPropertiesEnum[property];
  }

  parameterChanged(newValue: CardPropertiesEnum, oldValue: CardPropertiesEnum) {
    this.rebuild();
  }

  propertyChanged(property: string, newValue: any, oldValue: any) {
    this.rebuild();
  }

  rebuild() {
    this.clear();

    if (isNullOrUndefined(this.cards)) {
      return;
    }
   
    // Sort cards by grouping field
    this.groupCards();
    
    // Sort cards in each group by sorting field
    this.sortInGroups();
  }
  
  private clear(): void {
    this.cardsByGroup = {};
    this.groups.splice(0);
  }

  private groupCards(): void {
    this.cards.forEach(card => {
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
}
