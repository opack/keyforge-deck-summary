export class SkillsShortnerValueConverter {
  signals = ['skills-changed'];

  toView(value) {
    if (value === null || value === undefined) {
      return '';
    }

    let skillsLetters = '';
    value.forEach(skill => {
      // TODO Récupérer plutôt cette valeur depuis le service d'i18n
      skillsLetters += skill.charAt(0).toUpperCase();
    });
    return skillsLetters;
  }
}
