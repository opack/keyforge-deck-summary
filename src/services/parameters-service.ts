import * as _ from 'lodash';

import { autoinject, CompositionTransaction } from 'aurelia-framework';

import { LocalStorageService } from './local-storage-service';
import { StorageKeysEnum } from "enums/storage-keys-enum";
import { CardPropertiesEnum } from 'enums/card-properties-enum';

@autoinject
export class ParametersService {
  parameters: {};

  constructor(
    private localStorageService: LocalStorageService,
    compositionTransaction: CompositionTransaction
    ) {
    const compositionTransactionNotifier = compositionTransaction.enlist();
    const defaults = {
      app: {
        language: 'fr'
      },
      summary: {
        showDeckGroupCounts: true,
        showDeckHouses: true,
        showDeckQRCode: true,
        showCardHouse: false,
        showCardAember: true,
        showCreaturePower: true,
        showCreatureArmor: false,
        showCreatureSkills: true,
        showArtifactTriggers: true,
        hideArtifactOnlyActionTrigger: true,
  
        groupingProperty: CardPropertiesEnum.Type,
        sortingProperty: CardPropertiesEnum.House,
      }
    };

    // Load the stored section parameters or default to {}
    this.parameters = this.localStorageService.retrieve(StorageKeysEnum.Parameters, {});
    const needInitialSaving = _.isEmpty(this.parameters);

    // Merge loaded parameters with default parameters
    _.merge(this.parameters, defaults);

    // Save to ensure some parameters exist next time we load the app
    if (needInitialSaving) {
      this.save();
    }
    
    compositionTransactionNotifier.done();
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
    this.localStorageService.store(StorageKeysEnum.Parameters, this.parameters);
  }
}
