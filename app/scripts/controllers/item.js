'use strict';
/**
 * @ngdoc function
 * @name pouchTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pouchTestApp
 */
angular.module('pouchTestApp')
        .controller('ItemCtrl', function ($scope, $rootScope, $filter, pouchdb, pdb, $location) {
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
            $scope.editDoc = function (id) {
                $location.path('/item-doc/' + id);
            };
            $scope.showDoc = function (id) {
                $location.path('/item-doc/' + id);
            };
            $scope.find = function () {
                pdb.findDocs('item')
                        .then(function (responseGet) {
                            $scope.docs = responseGet;
                            $rootScope.$apply();
                        });
            };
            $scope.find();
        })
        .controller('ItemDocCtrl', function ($scope, $rootScope, $routeParams, pdb, $location) {
            $scope.deleteDoc = function (doc) {
                if (confirm("Wollen Sie den Datensatz löschen?") === true) {
                    pdb.deleteDoc(doc);
                    $location.path('/item-doc/-1');
                }
            };
            // callback for ng-click 'editDoc', new doc:
            $scope.editDoc = function (id) {
                $location.path('/item-doc/' + id);
            };
            $scope.editCost = function (doc) {
                $rootScope.fromLocation = 'item-doc/' + doc.item_id;
                $location.path('/cost-doc/' + doc._id);
            };
            // callback for ng-click 'cancel':
            $scope.cancel = function () {
                $location.path('/item');
            };
            $scope.updateDoc = function (form) {
                pdb.putDoc('item', form);
                /*
                 return pdb.putDoc('item', form)
                 .then(function (responseGet) {
                 $rootScope.$apply();
                 });
                 */
            };
            $scope.getDoc = function (id) {
                pdb.getDoc(id)
                        .then(function (response1) {
                            $scope.doc = response1;
                            return pdb.findDocs('cost', [{item_id: id}]);
                        })
                        .then(function (response2) {
                            $scope.costs = response2;
                            return pdb.findDocs('todo', [{item_id: id}]);
                        })
                        .then(function (response3) {
                            $scope.todos = response3;
                            return pdb.findDocs('person');
                        })
                        .then(function (response4) {
                            $scope.availablePersons = response4;
                            $rootScope.$apply();
                        });
            };
            $scope.getDoc($routeParams.id);
        });
