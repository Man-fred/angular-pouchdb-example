'use strict';

/**
 * @ngdoc service
 * @name pouchTestApp.pouchdb
 * @description
 * # pouchdb
 * Factory in the pouchTestApp.
 */
angular.module('pouchTestApp')
        .factory('pouchdb', function () {
            /*globals PouchDB*/
            //PouchDB.sync('todo', 'http://192.168.1.4:5984/todo');
            return new PouchDB('todo');
        })
        .factory('pdb', function ($q) {
            var pdb = {};
            pdb.db = new PouchDB('todo');
            pdb.doc = $q.defer();
            pdb.doc.resolve(pdb.db);
            pdb.doc.reject(pdb.db);
            pdb.connect = pdb.doc.promise;
            //console.log(pdb.doc);

            pdb.createIndex = function (result) {
                return result.createIndex({
                    index: {
                        fields: ['type', 'title', '_id']
                    }
                })
                        .then(function (result2) {
                            return result.createIndex({
                                index: {
                                    fields: ['type', 'item', '_id']
                                }
                            });
                        });
            };

            pdb.findDocs = function (contr, filter) {
                //console.log(pdb.doc);
                //var findDocs = pdb.doc.promise;
                return pdb.connect.then(
                        function (result) {
                            return pdb.createIndex(result);
                        },
                        function (error) {
                            console.log(error);
                        }).then(
                        function () {
                            var selector = [
                                        {type: contr}, 
                                        {title: {'$exists': true}}
                                    ];
                            if (filter) {
                                selector = selector.concat(filter);
                            }
                            return pdb.db.find({
                                selector: {$and: selector},
                                //, fields: ['_id', 'name'],
                                sort: [{type: 'asc'}, {title: 'asc'}]
                            });
                            // yo, a result
                        },
                        function (error) {
                            console.log(error);
                        }).then(
                        function (resultFind) {
                            return resultFind.docs;
                            //for (var row in resultFind.docs) {
                            //resultFind.docs[row].date = new Date(resultFind.docs[row].dateISO)
                            //}
                        },
                        function (error) {
                            // ouch, an error
                            console.log(error);
                        });
            };

            pdb.removeDoc = function (doc) {
                /*
                 pdb.db.find({
                 selector: {
                 type: 'todo',
                 item: doc._id
                 },
                 limit: 1
                 }).then(function (resultFind) {
                 alert('wird benutzt, löschen nicht möglich');
                 }).catch(function (err) {
                 // keine verbundenen Daten
                 pdb.db.remove(doc)
                 .catch(function (error) {
                 return error;
                 });
                 });
                 */

                return pdb.db.remove(doc)
                        .then(function (result) {
                            return result;
                        })
                        .catch(function (error) {
                            return error;
                        });
            };

            pdb.getDoc = function (id) {
                return pdb.connect.then(
                        function (result) {
                            if (id !== "-1")
                            {
                                return pdb.db.get(id, {include_docs: true})
                                        .then(function (responseGet) {
                                            return responseGet;
                                        })
                                        .catch(function (err) {
                                            // ouch, an error
                                            console.log(err);
                                        });
                            } else {
                                //var response = {};
                                return result;
                            }
                        }
                );
            };
            pdb.putDoc = function (type, form) {
                if (!form._id)
                {
                    form.type = type;
                    form.createdAt = new Date().getTime();
                    form.editedAt = form.createdAt;
                    form._id = new Date().toISOString();
                } else {
                    form.editedAt = new Date().getTime();
                }
                delete form.editMode;
                return pdb.db.put(form, form._id, form._rev)
                        .then(function (response) {
                            form._rev = response.rev;
                            return form;
                        })
                        .catch(function (err) {
                            // ouch, an error
                            console.log(err);
                        });
            };
            return pdb;
        });
