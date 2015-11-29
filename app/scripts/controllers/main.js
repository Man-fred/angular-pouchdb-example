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
        .controller('MainCtrl', function ($scope, $rootScope, $filter, pouchdb, pdb, $location) {

            $scope.docs = [];
            $scope.logs = [];
            var ctrlName = 'main';
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
            $scope.editDoc = function (doc) {
                $rootScope.fromLocation = 'main';
                $location.path('/' + doc.type + '-doc/' + doc._id);
            };
            $scope.find = function () {
                pdb.findDocsDate()
                        .then(function (responseGet) {
                            $scope.docs = responseGet;
                            $rootScope.$apply();
                        });
            };
            $scope.find();
        })
        .controller('MainDocCtrl', function ($scope, $rootScope, $routeParams, pdb, $location) {
            $scope.view = {
                h1: 'Main View',
                form: '...',
                ctrl: 'main'
            };
            $scope.deleteDoc = function (doc) {
                if (confirm("Wollen Sie den Datensatz löschen?") === true) {
                    pdb.deleteDoc(doc);
                    $location.path('/' + $scope.view.ctrl + '-doc/-1');
                }
            };
            // callback for ng-click 'editDoc', new doc:
            $scope.editDoc = function (id) {
                $location.path('/' + $scope.view.ctrl + '-doc/' + id);
            };
            // callback for ng-click 'cancel':
            $scope.cancel = function () {
                $location.path('/' + $scope.view.ctrl);
            };
            $scope.updateDoc = function (form) {
                pdb.putDoc($scope.view.ctrl, form)
                        .then(function (responseForm) {
                            if (responseForm.checked === true)
                                return pdb.getDoc(responseForm.theme_id);
                            else
                                return "";
                        })
                        .then(function (responseTheme) {
                            //Theme mit Wiederholung prueft/erzeugt neuen gleichwertigen Eintrag in Cost mit neuem Datum
                            if (responseTheme && responseTheme.recurrence) {
                                var formNew = form;
                                formNew._id = "";
                                formNew.checked = false;
                                formNew.info = "";
                                var dateTemp = new Date(form.date.replace( /(\d+)\.(\d+)\.(\d+)/, "$2/$1/$3") );
                                if (responseTheme.recurrenceYears) {
                                    dateTemp.setYear(dateTemp.getFullYear() + parseInt(responseTheme.recurrenceYears) );
                                }
                                if (responseTheme.recurrenceMonths) {
                                    dateTemp.setMonth(dateTemp.getMonth() + parseInt(responseTheme.recurrenceMonth) );
                                }
                                if (responseTheme.recurrenceDays) {
                                    dateTemp.setDate(dateTemp.getDate() + parseInt(responseTheme.recurrenceDays) );
                                }
                                formNew.date = dateTemp.toLocaleDateString("de-DE");//"2015-12-25";
                                pdb.putDoc($scope.view.ctrl, formNew);
                            }
                            //$rootScope.$apply();
                        });
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
                            $rootScope.$apply();
                        });
            };
            $scope.getDoc($routeParams.id);
        });
//})();