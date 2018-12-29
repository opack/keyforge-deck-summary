export class TriggersShortnerValueConverter {
  signals = ['trigger-changed'];

  toView(value) {
    if (value === null || value === undefined) {
      return '';
    }
    
    // TODO Récupérer plutôt cette valeur depuis le service d'i18n
    return value.charAt(0).toUpperCase();
  }
}
