'use strict';

/**
 * @ngdoc overview
 * @name pouchTestApp
 * @description
 * # pouchTestApp
 *
 * Main module of the application.
 */
var pouchTestApp = angular
  .module('pouchTestApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pouchTestFilters',
    'pascalprecht.translate'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/attachment', {
        templateUrl: 'views/attachment.html',
        controller: 'AttachmentCtrl'
      })
      .when('/theme', {
        templateUrl: 'views/theme.html',
        controller: 'ThemeCtrl'
      })
      .when('/theme-doc/:id', {
        templateUrl: 'views/theme-doc.html',
        controller: 'ThemeDocCtrl'
      })
      .when('/item', {
        templateUrl: 'views/item.html',
        controller: 'ItemCtrl'
      })
      .when('/item-doc/:id', {
        templateUrl: 'views/item-doc.html',
        controller: 'ItemDocCtrl'
      })
      .when('/cost', {
        templateUrl: 'views/cost.html',
        controller: 'CostCtrl'
      })
      .when('/cost-doc/:id', {
        templateUrl: 'views/cost-doc.html',
        controller: 'CostDocCtrl'
      })
      .when('/person', {
        templateUrl: 'views/person.html',
        controller: 'PersonCtrl'
      })
      .when('/person-doc/:id', {
        templateUrl: 'views/person-doc.html',
        controller: 'PersonDocCtrl'
      })
      .when('/todo', {
        templateUrl: 'views/todo.html',
        controller: 'TodoCtrl'
      })
      .when('/todo-doc/:id', {
        templateUrl: 'views/todo-doc.html',
        controller: 'TodoDocCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/main'
      });
  })
  .config(function($translateProvider) {
    // Our translations will go in here
    $translateProvider
    .translations('en', {
      HEADLINE: 'Hello there, This is my awesome app!',
      INTRO_TEXT: 'And it has i18n support!',
      BUTTON_TEXT_EN: 'english',
      BUTTON_TEXT_DE: 'deutsch',
      COST_H1 : "Costs",
    })
    .translations('de', {
      HEADLINE: 'Hey, das ist meine großartige App!',
      INTRO_TEXT: 'Und sie untersützt mehrere Sprachen!',
      BUTTON_TEXT_EN: 'english',
      BUTTON_TEXT_DE: 'deutsch',
      Costs : 'Kosten',
      Item : 'Vertrag',
      COST_H1 : "Kosten",
      Theme : 'Thema',
      Title : 'Titel',
      Date : 'Datum',
      Checked : 'Erledigt',
      
    })  
    .registerAvailableLanguageKeys(['en', 'de'], {
        'en_*': 'en',
        'de_*': 'de'
    })
    .determinePreferredLanguage();
    //$translateProvider.preferredLanguage('de');
  });


         pouchTestApp.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);
      //         <button ng-click = "uploadFile()">upload me</button>

         pouchTestApp.service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('file', file);
            
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
               .success(function(){
               })
            
               .error(function(){
               });
            }
         }]);
      
         pouchTestApp.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
            $scope.uploadFile = function(){
               var file = $scope.myFile;
               
               console.log('file is ' );
               console.dir(file);
               
               var uploadUrl = "/fileUpload";
               fileUpload.uploadFileToUrl(file, uploadUrl);
            };
         }]);
