import {DialogController} from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';

@autoinject
export class ConfirmDialog {
  strings: {};

  constructor(private controller: DialogController){
  }

  activate(strings){
    this.strings = strings;
  }
}

