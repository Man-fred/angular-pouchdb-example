/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//     <script src="bower_components/angular/angular-translate.js"></script>

 var $dummy = function($translateProvider) {
    // Our translations will go in here
    $translateProvider
    .translations('en', {
      HEADLINE: 'Hello there, This is my awesome app!',
      INTRO_TEXT: 'And it has i18n support!',
      BUTTON_TEXT_EN: 'english',
      BUTTON_TEXT_DE: 'german'
    })
    .translations('de', {
      HEADLINE: 'Hey, das ist meine großartige App!',
      INTRO_TEXT: 'Und sie untersützt mehrere Sprachen!',
      BUTTON_TEXT_EN: 'englisch',
      BUTTON_TEXT_DE: 'deutsch'
    });
    $translateProvider.preferredLanguage('en');
  };

