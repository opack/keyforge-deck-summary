import * as $ from 'jquery';

import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { CurrentDeckService } from './services/current-deck-service';
import { I18nService } from 'services/i18n-service';
import { CollectionNewDeck, CollectionLoadDeck } from 'elements/collection/collection';

@autoinject
export class App {
  constructor(
    private currentDeckService: CurrentDeckService,
    private i18nService: I18nService,// Do not delete: used in HTML template to interpolate strings
    eventAggregator: EventAggregator
  ) {
    eventAggregator.subscribe(CollectionNewDeck, msg => this.switchTab('nav-editor-tab'));
    eventAggregator.subscribe(CollectionLoadDeck, msg => this.switchTab('nav-summary-tab'));
  }
  
  attached() {
    // Ensure there is at least an empty deck
    this.currentDeckService.newDeck();

    // Create an event to rebuild the summary on tab activation. We must use 'shown.bs.tab'
    // and not 'show.bs.tab' because we must rebuild after the tab is displayed; if we
    // rebuild the summary before (with 'show.bs.tab') then fitty will not be able to do
    // its work.
    $('a[data-toggle="tab"]').on('shown.bs.tab', e => {
      // If the displayed tab is the summary, then rebuild it
      if (e.target.id === 'nav-summary-tab') {
        // Access the 'summary' variable created thanks to the view-model.ref in the html.
        // As the @child can only target immediate child, this method allows targetting
        // the view-model of the nested <summary> tag, and calling its rebuild() method.
        // As this variable is created dynamically, then we use the array way of accessing
        // the property to avoid compilation errors.
        this['summary'].rebuild();
      }
    });
  }

  private switchTab(tabId: string) {
    $(`#${tabId}`).click();
  }
}
