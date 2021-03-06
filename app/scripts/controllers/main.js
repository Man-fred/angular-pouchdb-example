'use strict';

/**
 * @ngdoc function
 * @name pouchTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pouchTestApp
 */
angular.module('pouchTestApp')
        .controller('MainCtrl', function ($scope, $rootScope, $filter, pouchdb) {
            $scope.docs = [];
            $scope.logs = [];

            $scope.add = function (todo) {
                var doc = {
                    type: 'todo',
                    title: todo.title,
                    date: todo.date,
                    dateISO: todo.date.toISOString(),
                    done: false,
                    createdAt: new Date().getTime(),
                    _id: new Date().toISOString()
                };
                pouchdb.put(doc)
                        .then(function (responsePut) {
                            pouchdb.get(responsePut.id, {include_docs: true})
                                    .then(function (responseGet) {
                                        todo.date = new Date(responseGet.dateISO);
                                        //todo._id = responseGet.id;
                                        //todo._rev = responseGet.rev;
                                        responseGet.date = new Date(responseGet.dateISO);
                                        $scope.docs.unshift(responseGet);
                                        //console.log(responseGet, $scope.docs);
                                        $rootScope.$apply();
                                    });
                        });
                todo.title = '';
            };

            $scope.delete = function (doc, index) {
                pouchdb.remove(doc)
                        .catch(function (error) {
                            return error;
                        })
                        .then(function () {
                            $scope.docs.splice(index, 1);
                            $rootScope.$apply();
                        });
            };

            $scope.edit = function (todo) {
                todo.editedAt = new Date().getTime();
                todo.editMode = false;
                todo.dateISO = todo.date.toISOString();
                delete todo.editMode;
                //console.log(todo);

                pouchdb.put(todo, todo._id, todo._rev)
                        .then(function (response) {
                            todo.editMode = false;
                            todo._rev = response._rev;
                            console.log(todo);
                            $rootScope.$apply();
                        });
            };

            $scope.find = function () {
                pouchdb.createIndex({
                    index: {
                        fields: ['type', 'title', '_id']
                    }
                }).then(function (result) {
                    console.log(result);
                    pouchdb.find({
                        selector: {type: 'todo', title: {'$exists': true}},
                        //, fields: ['_id', 'name'],
                        sort: [{type: 'asc'}, {title: 'asc'}]
                    }).then(function (resultFind) {
                        console.log(resultFind);
                        for (var row in resultFind.docs) {
                            resultFind.docs[row].date = new Date(resultFind.docs[row].dateISO)
                        }
                        $scope.docs = resultFind.docs;
                        $rootScope.$apply();
                    }).catch(function (err) {
                        // ouch, an error
                        console.log(err);
                    });
                    // yo, a result
                }).catch(function (err) {
                    // ouch, an error
                });
            };

            $scope.fileNameChanged = function (ele) {
                var $todo_files = ele.files;
                var $namesArr = [];
                //for i in [0...files.length]
                $namesArr.push(ele.files[0].name);
                $namesArr.push(ele.files[1].name);
                $scope.namesString = $namesArr.join(' ,');
                $scope.$apply();
            };
            $scope.logsListener = (function () {
                pouchdb.changes({
                    live: true
                }).on('change', function (change) {
                    $scope.logs.push(change);
                    $rootScope.$apply();
                });
            })();

            //$scope.getAll();
            $scope.find();
        });
