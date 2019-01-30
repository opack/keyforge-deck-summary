import * as _ from 'lodash';

import { autoinject, CompositionTransaction } from 'aurelia-framework';

import { I18nService } from 'services/i18n-service';
import { JsonFetcherService } from 'services/json-fetcher-service';
import { CardModel } from 'models/card-model';
import { HousesEnum } from 'enums/houses-enum';
import { TypesEnum } from 'enums/types-enum';
import { SkillsEnum } from 'enums/skills-enum';
import { TriggersEnum } from './../enums/triggers-enum';

/**
 * The cards data for one language
 */
class CardsData{
  cardsByNumber: Map<number, CardModel>;
  cardsById: Map<string, CardModel>;
  count: number;

  constructor() {
    this.cardsByNumber = new Map<number, CardModel>();
    this.cardsById = new Map<string, CardModel>();
  }
}

@autoinject
export class CardDataService {
  private cardsByLanguage: {};

  constructor(
    private jsonFetcherService: JsonFetcherService,
    private compositionTransaction: CompositionTransaction,
    private i18nService: I18nService) {
    
    this.cardsByLanguage = {};
    this.load('fr');
    this.load('en');
  }

  load(language: string) {
    const compositionTransactionNotifier = this.compositionTransaction.enlist();
    return this.jsonFetcherService.fetch(`data/cards/cards-${language}.json`).then(result => {
      const cardsData = new CardsData();

      result.forEach(data => {
        const card = new CardModel();
        card.guid = data.id;
        card.number = data.card_number;
        card.type = TypesEnum[data.card_type] as TypesEnum;
        card.title = data.card_title;
        card.house = HousesEnum[data.house] as HousesEnum;
        card.aember = data.amber;
        card.image = data.front_image;
        card.power = data.power;
        card.armor = data.armor;
        card.triggers = this.extractTriggers(data.card_text);
        card.skills = this.extractSkills(data.card_text);

        cardsData.cardsByNumber.set(data.card_number, card);
        cardsData.cardsById.set(data.id, card);
      });
      cardsData.count = result.length;
      this.cardsByLanguage[language] = cardsData;
      compositionTransactionNotifier.done();
    });
  }

  private extractSkills(text: string): Array<SkillsEnum> {
    const skills = new Array<SkillsEnum>();
    for (let skill in SkillsEnum) {
      // Retrieve the translated regexp
      const regexp = this.i18nService.get(`cardDataAdaptor.skills.${skill.toString()}`);

      // Test if the text matches it and add the skill
      if (text.match(regexp)) {
        skills.push(SkillsEnum[skill] as SkillsEnum);
      }
    };
    return skills;
  }

  private extractTriggers(text: string): Array<TriggersEnum> {
    const triggers = new Array<TriggersEnum>();
    for (let trigger in TriggersEnum) {
      // Retrieve the translated regexp
      const regexp = this.i18nService.get(`cardDataAdaptor.triggers.${trigger.toString()}`);

      // Test if the text matches it and add the skill
      if (text.match(regexp)) {
        triggers.push(TriggersEnum[trigger] as TriggersEnum);
      }
    }
    return triggers;
  }

  getByNumber(cardNumber: number, language: string): CardModel {
    return this.cardsByLanguage[language].cardsByNumber.get(cardNumber);
  }

  getById(cardId: string, language: string): CardModel {
    return this.cardsByLanguage[language].cardsById.get(cardId);
  }

  has(cardNumber: number, language: string): boolean {
    return this.cardsByLanguage[language].cardsByNumber.has(cardNumber);
  }

  getCardCount(language?: string): number {
    // If no specific language was passed, we return the count of the first defined language. After all, all languages
    // should have the same number of cards ;-)
    if (language === undefined) {
      const firstLanguage = Object.keys(this.cardsByLanguage)[0];
      return this.cardsByLanguage[firstLanguage].count;
    }
    return this.cardsByLanguage[language].count;
  }
}
