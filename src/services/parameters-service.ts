import * as _ from 'lodash';

import { LocalStorageService } from './local-storage-service';
import { StorageKeysEnum } from "enums/storage-keys-enum";

/**
 * Handles the parameters for one "section" (i.e app, summary, collection...) and wraps it all in a "parameters" key in the local storage.
 * Attention! An instance must not be shared otherwise it will write in the same section !
 */
export class ParametersService {
  /**
   * The name of the section parameters
   */
  sectionName: string;

  /**
   * The actual parameters for this section, which also defines all the available options and their type, as these 2 things
   * (existence and type) are asserted upon parameter set
   */
  parameters: {};

  constructor(private localStorageService: LocalStorageService, sectionName: string, defaults: {}) {
    this.sectionName = sectionName;
    this.parameters = defaults;

    // Load the stored section parameters or default to {}
    const allParameters = this.localStorageService.retrieve(StorageKeysEnum.Parameters);
    let sectionParameters = _.get(allParameters, sectionName, {});
    const needInitialSaving = _.isEmpty(sectionParameters);

    // Merge loaded parameters with default parameters
    _.merge(this.parameters, sectionParameters);

    // Save to ensure some parameters exist next time we load the app
    if (needInitialSaving) {
      this.save();
    }
  }

  get(parameter: string) {
    return _.get(this.parameters, parameter);
  }

  /**
   * 
   * @param parameter 
   * @param value 
   * @return true if the parameter was set and stored, false if not
   */
  set(parameter: string, value: any): boolean {
    // Ensure that if the parameter already exists, the new value is of the same type as the old one, for consistency.
    const currentParameter = this.get(parameter);
    if (currentParameter !== undefined && (typeof value !== typeof currentParameter)) {
      return false;
    }

    // Everything seems fine, store the parameter
    _.set(this.parameters, parameter, value);

    // And save all the section parameters
    this.save();

    return true;
  }

  save() {
    const allParameters = this.localStorageService.retrieve(StorageKeysEnum.Parameters, {});
    allParameters[this.sectionName] = this.parameters;
    this.localStorageService.store(StorageKeysEnum.Parameters, allParameters);
  }
}
