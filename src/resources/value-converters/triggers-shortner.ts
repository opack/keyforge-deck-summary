import { autoinject } from "aurelia-framework";

import { I18nService } from 'services/i18n-service';

@autoinject
export class TriggersShortnerValueConverter {
  signals = ['trigger-changed'];

  constructor(private i18nService: I18nService) {
  }

  toView(value) {
    if (value === null || value === undefined) {
      return '';
    }
    
    return this.i18nService.get(`triggers.${value}`);;
  }
}
