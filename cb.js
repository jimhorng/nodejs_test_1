angular.module('cbApp', [])
  .controller('CBController', ['$scope', '$http', function($scope, $http) {
    
    $scope.cbs = {
      '17043': {no: '17043'},
      '16112': {no: '16112'},
      '26105': {no: '26105'}
    }

    $scope.refresh_cb = function() {
      for( var cb_no in $scope.cbs ) {
        var uri = '/tse/' + cb_no
        var config = {
          // data = Object;
          responseType:"json"
        };
        $http.get(uri, config).success((function(cb_no) {
          return function(response) {
            // var result = JSON.parse(result);
            console.log('cb_no: ' + cb_no)
            $scope.cbs[cb_no]['price'] = response.msgArray[0].h;
            $scope.cbs[cb_no]['qty'] = response.msgArray[0].v;
            $scope.cbs[cb_no]['quote_name'] = response.msgArray[0].n
          }
        })(cb_no));
      }
    };

    $scope.addTodo = function() {
      $scope.todos.push({text:$scope.todoText, done:false});
      $scope.todoText = '';
    };
 
    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };
  }]);