import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

// TODO IMPORTANT Use a custom prefix before the deck name to avoid bug when trying to load pre-existing application data (occurs because localhost:8080 may have been used by another application, but should not occur with a real DNS)
/**
 * Message sent when some data is stored
 */
export class DataStored {
  constructor(public key: string, public value: any) {}
}

/**
 * Message sent when some data is removed
 */
export class DataRemoved {
  constructor(public key: string) {}
}

/**
 * Message sent when all data is cleared
 */
export class DataCleared {
  constructor() {}
}

@autoinject
export class LocalStorageService {
  private storage: Storage;

  constructor(private eventAggregator: EventAggregator) {
      this.storage = window.localStorage;
  }

  contains(key: string): boolean {
    return this.getKeys().includes(key);
  }

  getKeys(): string[] {
    return Object.keys(this.storage);
  }

  store(key: string, value: any) {
    // Store the data
    const item = JSON.stringify(value);
    this.storage.setItem(key, item);

    // Publish a new message to indicate this
    this.eventAggregator.publish(new DataStored(key, value));
  }

  retrieve(key: string){
      return JSON.parse(this.storage.getItem(key));
  }

  remove(key: string){
    // Remove the data
    this.storage.removeItem(key);

    // Publish a new message to indicate this
    this.eventAggregator.publish(new DataRemoved(key));
  }

  clear() {
    this.storage.clear();

    // Publish a new message to indicate this
    this.eventAggregator.publish(new DataCleared());
  }
}
