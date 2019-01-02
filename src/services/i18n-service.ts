import * as _ from 'lodash';

import { autoinject } from 'aurelia-framework';
import { JsonFetcherService } from 'services/json-fetcher-service';

@autoinject
export class I18nService {
  private strings: {};

  constructor(private jsonFetcherService: JsonFetcherService) {
    this.load('fr');
  }

  load(language: string): void {
    this.jsonFetcherService.fetch(`i18n-${language}.json`).then(data => {
      this.strings = data;
    });
  }

  get(key: string) {
    return _.get(this.strings, key);
  }
}
