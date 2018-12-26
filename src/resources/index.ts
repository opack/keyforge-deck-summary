import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    // TODO: Make this work to be able to avoid matching <require> in .html files.
    // Uncommenting the following line (and removing the matching <require> in card.html) causes a "Error: Unable to find module with ID: resources/elements/houses/houses-list"
    //'./elements/houses/houses-list',
    // './elements/types/types-list',
  ]);
}
