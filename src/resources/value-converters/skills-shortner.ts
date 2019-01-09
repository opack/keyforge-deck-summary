import { autoinject } from "aurelia-framework";

import { I18nService } from 'services/i18n-service';

@autoinject
export class SkillsShortnerValueConverter {
  signals = ['skills-changed'];

  constructor(private i18nService: I18nService) {
  }

  toView(value) {
    if (value === null || value === undefined) {
      return '';
    }

    let skillsLetters = '';
    value.forEach(skill => {
      skillsLetters += this.i18nService.get(`badges.skills.${skill}`);
    });
    return skillsLetters;
  }
}
