import { BindingEngine, Disposable } from "aurelia-framework";

export interface PropertyChangedListener {
  /**
   * Triggered when the value of an observed property has changed
   * @param property 
   * @param newValue 
   * @param oldValue 
   */
  propertyChanged(property: string, newValue: any, oldValue: any);
}

export class PropertyObserverService {
  private bindingEngine: BindingEngine;
  private subscriptions: Array<Disposable>;
  private listener: PropertyChangedListener;

  constructor(bindingEngine: BindingEngine, listener: PropertyChangedListener) {
    this.bindingEngine = bindingEngine;
    this.subscriptions = new Array<Disposable>();
    this.listener = listener;
  }

  observeAll(models: Array<any>, properties: Array<string>) {
    models.forEach(model => this.observe(model, properties));
  }

  observe(model: any, properties: Array<string>) {
    properties.forEach(property => this.subscribeToChangeOnProperty(model, property));
  }

  private subscribeToChangeOnProperty(model: any, property: string) {
    let propertyObserver;
    if (Array.isArray(model[property])) {
      propertyObserver = this.bindingEngine.collectionObserver(model[property]);
    } else {
      propertyObserver = this.bindingEngine.propertyObserver(model, property);
    }
    const subscription = propertyObserver.subscribe((newValue, oldValue) => this.listener.propertyChanged(property, newValue, oldValue));
    this.subscriptions.push(subscription);
  }

  dispose() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }
}
