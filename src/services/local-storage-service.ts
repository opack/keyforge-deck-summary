export class LocalStorageService {
  private storage: Storage;

  constructor() {
      this.storage = window.localStorage;
  }

  getKeys(): string[] {
    return Object.keys(this.storage);
  }

  store(key: string, value: any) {
    const item = JSON.stringify(value);
    this.storage.setItem(key, item);
      
  }

  retrieve(key: string){
      return JSON.parse(this.storage.getItem(key));
  }

  remove(key: string){
    this.storage.removeItem(key);
  }
}
