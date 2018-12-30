import { CurrentDeckService } from './services/current-deck-service';
import * as $ from 'jquery';

import { inject } from 'aurelia-framework';

@inject(CurrentDeckService)
export class App {
  constructor(private currentDeck: CurrentDeckService) {
  }

  attached() {
    // Create an even to rebuild the summary on tab activation. We must use 'shown.bs.tab'
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
}
