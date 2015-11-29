'use strict';

/**
 * @ngdoc function
 * @name pouchTestApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pouchTestApp
 */
angular.module('pouchTestApp')
  .controller('TranslateCtrl', function ($scope, $translate) {
  $scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
  };

  });
