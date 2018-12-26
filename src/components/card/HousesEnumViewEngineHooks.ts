import { ViewEngineHooks, View } from 'aurelia-framework';
import { HousesEnum } from 'components/card/HousesEnum';

// (Adapted from http://www.foursails.co/blog/template-constants/)
// By convention, Aurelia will look for any classes of the form 
// {name}ViewEngineHooks and load them as a ViewEngineHooks resource. We can
// use the @viewEngineHooks decorator instead if we want to give the class a
// different name.
export class HousesEnumViewEngineHooks implements ViewEngineHooks {
  
  // The `beforeBind` method is called before the ViewModel is bound to
  // the view. We want to expose the enum to the binding context so that
  // when Aurelia binds the data it will find our MediaType enum.
  beforeBind(view: View) {

    // We add the enum to the override context. This will expose the enum
    // to the view without interfering with any properties on the
    // bindingContext itself.
    view.overrideContext['HousesEnum'] = HousesEnum;

    // Since TypeScript enums are not iterable, we need to do a bit of extra
    // legwork if we plan on iterating over the enum keys.
    view.overrideContext['HousesEnum'] = 
      Object.keys(HousesEnum)
        .filter((key) => typeof HousesEnum[key] === 'number');
  }
}
