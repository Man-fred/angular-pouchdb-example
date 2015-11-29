'use strict';

/**
 * @ngdoc service
 * @name pouchTestApp.todoService
 * @description
 * # todoService
 * Factory in the pouchTestApp.
 */
angular.module('pouchTestApp')
        .factory('todoService', function ($q, $rootScope, pouchdb) {
            return {
                add: function (todo) {
                    var doc = {
                        type: 'todo',
                        title: todo.title,
                        date: todo.date,
                        done: false,
                        createdAt: new Date().getTime(),
                        _id: new Date().toISOString()
                    };
                    console.log(doc);
                    return pouchdb.put(doc)
                            .then(function (response) {
                                return response;
                            })
                            .catch(function (error) {
                                return error;
                            });
                },
                getAllTodos: function () {
                    /*jshint camelcase: false*/
                    var deferred = $q.defer();
                    pouchdb.allDocs({include_docs: true, descending: true}, function (err, res) {
                        $rootScope.$apply(function () {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(res);
                            }
                        });
                    });
                    return deferred.promise;
                }
            };
        });

angular.module('pouchTestApp').factory('routeNavigation', function ($location) {
    var routes = [
        {
            name: 'Main',
            sub: [
                {
                    templateUrl: 'item',
                    controller: 'Items'
                },
                {
                    templateUrl: 'theme',
                    controller: 'Themes'
                },
                {
                    templateUrl: 'person',
                    controller: 'Persons'
                },
                {
                    templateUrl: 'cost',
                    controller: 'Costs'
                },
                {
                    templateUrl: 'todo',
                    controller: 'Todos'
                },
            ]
        },
        {
            name: 'about',
            sub: [
                {
                    templateUrl: 'about',
                    controller: 'About'
                },
                {
                    templateUrl: 'attachment',
                    controller: 'Attachment'
                },
            ]
        }
    ];
    return {
        routes: routes,
        activeRoute: function (route) {
            return route.path === $location.path();
        }
    };
});

angular.module('pouchTestApp').directive('navigation', function (routeNavigation) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "views/_mainmenu.html",
    controller: function ($scope) {
      $scope.routes = routeNavigation.routes;
      $scope.activeRoute = routeNavigation.activeRoute;
    }
  };
});
