'use strict';

/**
 * @ngdoc function
 * @name pouchTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pouchTestApp
 */
angular.module('pouchTestApp')
        .controller('ThemeCtrl', function ($scope, $rootScope, $filter, pouchdb) {
            $scope.docs = [];
            $scope.logs = [];
            $scope.add = function (form) {
                var doc = {
                    type: 'theme',
                    title: form.title,
                    createdAt: new Date().getTime(),
                    _id: new Date().toISOString()
                };
                pouchdb.put(doc)
                        .then(function (responsePut) {
                            pouchdb.get(responsePut.id, {include_docs: true})
                                    .then(function (responseGet) {
                                        //form._id = responseGet.id;
                                        //form._rev = responseGet.rev;
                                        $scope.docs.unshift(responseGet);
                                        $rootScope.$apply();
                                    });
                        });
                form.title = '';
            };

            $scope.delete = function (doc, index) {
                pouchdb.find({
                    selector: {type: 'todo', theme: doc._id},
                    limit: 1
                            //, fields: ['_id', 'name'],
                }).then(function (resultFind) {
                    alert('wird benutzt, löschen nicht möglich');
                    pouchdb.remove(doc)
                            .catch(function (error) {
                                return error;
                            })
                            .then(function () {
                                $scope.docs.splice(index, 1);
                                $rootScope.$apply();
                            });
                }).catch(function (err) {
                    // ouch, an error
                    pouchdb.remove(doc)
                            .catch(function (error) {
                                return error;
                            })
                            .then(function () {
                                $scope.docs.splice(index, 1);
                                $rootScope.$apply();
                            });
                });
            };

            $scope.edit = function (form) {
                form.editedAt = new Date().getTime();
                form.editMode = false;

                pouchdb.put(form, form._id, form._rev)
                        .then(function (response) {
                            form._rev = response.rev;
                            $rootScope.$apply();
                        });
            };

            $scope.find = function () {
                pouchdb.createIndex({
                    index: {
                        fields: ['type', 'title', '_id']
                    }
                }).then(function (result) {
                    pouchdb.find({
                        selector: {type: 'theme', title: {'$exists': true}},
                        //, fields: ['_id', 'name'],
                        sort: [{type: 'asc'}, {title: 'asc'}]
                    }).then(function (resultFind) {
                        //for (var row in resultFind.docs) {
                        //resultFind.docs[row].date = new Date(resultFind.docs[row].dateISO)
                        //}
                        $scope.docs = resultFind.docs;
                        $rootScope.$apply();
                    }).catch(function (err) {
                        // ouch, an error
                        console.log(err);
                    });
                    // yo, a result
                }).catch(function (err) {
                    console.log(err);
                    // ouch, an error
                });
            };
            $scope.logsListener = (function () {
                pouchdb.changes({
                    live: true
                }).on('change', function (change) {
                    $scope.logs.push(change);
                    $rootScope.$apply();
                });
            })();
            $scope.find();
        });
