angular.module('pouchTestFilters', []).filter('formatDate', function() {
  return function($input) {
    $input.date = new Date('2015-06-15');
    return '<<fertig>>';
  };
});