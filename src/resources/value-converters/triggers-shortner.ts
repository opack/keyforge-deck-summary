import { TriggersEnum } from './../../enums/triggers-enum';
import { autoinject } from "aurelia-framework";

import { I18nService } from 'services/i18n-service';

@autoinject
export class TriggersShortnerValueConverter {
  signals = ['triggers-changed'];

  constructor(private i18nService: I18nService) {
  }

  toView(value, hideArtifactOnlyActionTrigger) {
    if (value === null || value === undefined) {
      return '';
    }

    if (hideArtifactOnlyActionTrigger
    && value.length == 1
    && value[0] === TriggersEnum.Action) {
      return '';
    }

    let triggersLetters = '';
    value.forEach(trigger => {
      triggersLetters += this.i18nService.get(`badges.triggers.${trigger}`);
    });
    return triggersLetters;
  }
}
