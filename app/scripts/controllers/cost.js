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
        .controller('CostCtrl', function ($scope, $rootScope, $filter, pouchdb, pdb, $location) {
            $scope.docs = [];
            $scope.logs = [];
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
                $location.path('/cost-doc/' + id);
            };
            $scope.find = function () {
                pdb.findDocs('cost')
                        .then(function (responseGet) {
                            $scope.docs = responseGet;
                        });
            };
            $scope.find();
        })
        .controller('CostDocCtrl', function ($scope, $rootScope, $routeParams, pdb, $location) {
            $scope.view = {
                h1: 'Costs',
                form: 'Cost with ...'
            };
            $scope.deleteDoc = function (doc) {
                if (confirm("Wollen Sie den Datensatz löschen?") === true) {
                    pdb.deleteDoc(doc);
                    $location.path('/cost-doc/-1');
                }
            };
            // callback for ng-click 'editDoc', new doc:
            $scope.editDoc = function (id) {
                $location.path('/cost-doc/' + id);
            };
            $scope.editCost = function (id) {
                $location.path('/cost-doc/' + id);
            };
            // callback for ng-click 'cancel':
            $scope.cancel = function () {
                $location.path('/cost');
            };
            $scope.updateDoc = function (form) {
                pdb.putDoc('cost', form);
                /*
                 return pdb.putDoc('item', form)
                 .then(function (responseGet) {
                 $rootScope.$apply();
                 });
                 */
            };
            $scope.getDoc = function (id) {
                    return pdb.getDoc(id)
                            .then(function (response1) {
                                if (id !== "-1") {
                                    $scope.doc = response1;
                                }
                                return pdb.findDocs('item');
                            })
                            .then(function (response2) {
                                $scope.availableItems = response2;
                                return pdb.findDocs('theme');
                            })
                            .then(function (response3) {
                                $scope.availableThemes = response3;
                                //$rootScope.$apply();
                            });
            };
            $scope.getDoc($routeParams.id);
        });
//})();