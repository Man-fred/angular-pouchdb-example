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
            pdb.connect = function() { return pdb.doc; };
            //console.log(pdb.doc);

            pdb.createIndex = function () {
                return pdb.db.createIndex({
                    index: {
                        fields: ['type', 'title', '_id']
                    }
                })
                        .then(function () {
                            return pdb.db.createIndex({
                                index: {
                                    fields: ['type', 'title', 'item_id', '_id']
                                }
                            });
                        })
                        .then(function () {
                            return pdb.db.createIndex({
                                index: {
                                    fields: ['type', 'title', 'theme_id', '_id']
                                }
                            });
                        })
                        .then(function () {
                            return pdb.db.createIndex({
                                index: {
                                    //fields: ['title', 'item_id', '_id']
                                    fields: ['dateISO', 'checked', 'type']
                                }
                            });
                        });
            };

            pdb.findDocs = function (contr, filter) {
                //console.log(pdb.doc);
                //var findDocs = pdb.doc.promise;
                return pdb.createIndex()
                        .then(function () {
                            if (contr) {
                                var selector = [
                                    {type: contr},
                                    {title: {'$exists': true}}
                                ];
                            } else {
                                var selector = [
                                    {type: {'$exists': true}},
                                    {title: {'$exists': true}}
                                ];
                            }
                            if (filter) {
                                selector = selector.concat(filter);
                            }
                            return pdb.db.find({
                                selector: {$and: selector},
                                //, fields: ['_id', 'name'],
                                sort: [{type: 'asc'}, {title: 'asc'}]
                            });
                            // yo, a result
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

            pdb.findDocsDate = function (contr, filter) {
                //console.log(pdb.doc);
                //var findDocs = pdb.doc.promise;
                return pdb.createIndex()
                        .then(function () {
                            if (contr) {
                                var selector = [
                                    {dateISO: {'$exists': true}},
                                    //{checked: false},
                                    {type: contr}
                                ];
                            } else {
                                var selector = [
                                    {dateISO: {'$exists': true}},
                                    {checked: false}
                                ];
                            }
                            if (filter) {
                                selector = selector.concat(filter);
                            }
                            return pdb.db.find({
                                selector: {$and: selector},
                                //, fields: ['_id', 'name'],
                                sort: [{dateISO: 'asc'}]
                            });
                            // yo, a result
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
                //return pdb.connect().then(
                //        function (result) {
                //            if (id !== "-1")
                //            {
                                return pdb.db.get(id, {include_docs: true})
                                        .then(function (responseGet) {
                                            return responseGet;
                                        })
                                        .catch(function (err) {
                                            // ouch, an error
                                            console.log(err);
                                        });
                //            } else {
                                //var response = {};
                //                return result;
                //            }
                //        }
            
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
                // Sortieren und Filtern ueber ISO-String
                if (form.date) {
                    form.dateISO = new Date(form.date.replace( /(\d+)\.(\d+)\.(\d+)/, "$2/$1/$3") );
                    form.dateISO = form.dateISO.toISOString();
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
