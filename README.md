ROADMAP
- Put the app online
- Create a mobile version
- When the app is online (or if a mobile version is available):
  - Create a profile to add one's decks
  - Allow printing a QR code to access the deck directly. This QR Code will be pasted on the deck box.
  - Allow scanning a QR code to access the deck from within the application or the website.

SETUP FIREBASE
If not already done:
npm install -g firebase-tools
firebase login

BUILD & DEPLOY
au build --prod
firebase deploy
Go to https://keyforge-deck-summary.firebaseapp.com
