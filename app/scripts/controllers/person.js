/**
 * @ngdoc function
 * @name pouchTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pouchTestApp
 * IIFE-Syntax,es verbleiben keine globalen Variablen
 */

//(function () {
'use strict';

angular.module('pouchTestApp')
        .controller('PersonCtrl', function ($scope, $rootScope, $filter, pouchdb, pdb, $location) {

            $scope.docs = [];
            $scope.logs = [];
            var ctrlName = 'person';
            $scope.deleteDoc = function (doc) {
                if (confirm("Wollen Sie den Datensatz löschen?") === true) {
                    pdb.removeDoc(doc)
                            .then(function (responseGet) {
                                var idx = $scope.docs.indexOf(doc);
                                $scope.docs.splice(idx, 1);
                                $rootScope.$apply();
                            });
                }
                ;
            };
            // callback for ng-click 'editUser':
            $scope.editDoc = function (id) {
                $location.path('/'+ctrlName+'-doc/' + id);
            };
            $scope.find = function () {
                pdb.findDocs(ctrlName)
                        .then(function (responseGet) {
                            $scope.docs = responseGet;
                            $rootScope.$apply();
                        });
            };
            $scope.find();
        })
        .controller('PersonDocCtrl', function ($scope, $rootScope, $routeParams, pdb, $location) {
            $scope.view = {
                h1: 'Person',
                form: 'edit:',
                ctrl: 'person'
            };
            $scope.deleteDoc = function (doc) {
                if (confirm("Wollen Sie den Datensatz löschen?") === true) {
                    pdb.removeDoc(doc);
                    $location.path('/'+$scope.view.ctrl+'-doc/-1');
                }
            };
            // callback for ng-click 'editDoc', new doc:
            $scope.editDoc = function (id) {
                $location.path('/'+$scope.view.ctrl+'-doc/' + id);
            };
            // callback for ng-click 'cancel':
            $scope.cancel = function () {
                $location.path('/'+$scope.view.ctrl);
            };
            $scope.updateDoc = function (form) {
                pdb.putDoc($scope.view.ctrl, form);
            };
            $scope.getDoc = function (id) {
                return pdb.getDoc(id)
                        .then(function (response1) {
                            if (id !== "-1") {
                                $scope.doc = response1;
                            $rootScope.$apply();
                            }
                        });
            };
            $scope.getDoc($routeParams.id);
        });
//})();