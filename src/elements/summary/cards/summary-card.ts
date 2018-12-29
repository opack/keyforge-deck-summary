import { computedFrom } from "aurelia-framework";

import { CardModel } from "models/card-model";
import { isNullOrUndefined } from "util";
import { SkillsEnum } from "enums/skills-enum";

export class SummaryCardCustomElement {
  model: CardModel;

  activate(model: CardModel) {
    this.model = model;
  }
}
