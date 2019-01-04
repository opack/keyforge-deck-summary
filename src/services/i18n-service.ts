import * as _ from 'lodash';

import { autoinject, CompositionTransaction } from 'aurelia-framework';
import { JsonFetcherService } from 'services/json-fetcher-service';

@autoinject
export class I18nService {
  private strings: {};

  constructor(private jsonFetcherService: JsonFetcherService, private compositionTransaction: CompositionTransaction) {
    this.load('fr');
  }

  load(language: string) {
    const compositionTransactionNotifier = this.compositionTransaction.enlist();
    return this.jsonFetcherService.fetch(`i18n-${language}.json`).then(result => {
      this.strings = result;
      compositionTransactionNotifier.done();
    });
  }

  get(key: string) {
    return _.get(this.strings, key);
  }
}
