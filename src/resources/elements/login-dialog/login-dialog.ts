import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui';

@autoinject
export class LoginDialog {
  strings: {};

  constructor(private controller: DialogController){
  }

  activate(strings){
    this.strings = strings;
  }

  attached() {
    const controller = this.controller;
    // Initialize Auth module
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          controller.ok();
          return false;
        },
        uiShown: function() {
          // The widget is rendered.
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      // signInSuccessUrl: '<url-to-redirect-to-on-success>',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      // tosUrl: '<your-tos-url>',
      // Privacy policy url.
      // privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    // Initialize the FirebaseUI Widget using Firebase.
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }
}

