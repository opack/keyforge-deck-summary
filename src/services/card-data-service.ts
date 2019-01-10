import * as _ from 'lodash';

import { autoinject, CompositionTransaction } from 'aurelia-framework';

import { I18nService } from 'services/i18n-service';
import { JsonFetcherService } from 'services/json-fetcher-service';
import { CardModel } from 'models/card-model';
import { HousesEnum } from 'enums/houses-enum';
import { TypesEnum } from 'enums/types-enum';
import { SkillsEnum } from 'enums/skills-enum';
import { TriggersEnum } from './../enums/triggers-enum';

@autoinject
export class CardDataService {
  private cards: Map<number, CardModel>;
  private count: number;

  constructor(
    private jsonFetcherService: JsonFetcherService,
    private compositionTransaction: CompositionTransaction,
    private i18nService: I18nService) {
    this.cards = new Map<number, CardModel>();
    this.load('fr');
  }

  load(language: string) {
    const compositionTransactionNotifier = this.compositionTransaction.enlist();
    return this.jsonFetcherService.fetch(`cards/cards-${language}.json`).then(result => {
      this.cards.clear();

      result.forEach(data => {
        const card = new CardModel();
        card.type = TypesEnum[data.card_type] as TypesEnum;
        card.title = data.card_title;
        card.house = HousesEnum[data.house] as HousesEnum;
        card.aember = data.amber;
        card.image = data.front_image;
        card.power = data.power;
        card.armor = data.armor;
        card.triggers = this.extractTriggers(data.card_text);
        // TODO Also extract skills gained with upgrades and display them in the summary. To do this, the i18n adaptor skills must be a regexp capturing various strings
        card.skills = this.extractSkills(data.card_text);

        this.cards.set(data.card_number, card);
      });
      this.count = result.length;
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

  get(cardNumber: number): CardModel {
    return this.cards.get(cardNumber);
  }

  has(cardNumber: number): boolean {
    return this.cards.has(cardNumber);
  }

  getCardCount(): number {
    return this.count;
  }
}
