angular.module('cbApp', [])
  .controller('CBController', ['$scope', '$http', function($scope, $http) {
    
    $scope.cbs = {
      '17043': {no: '17043'},
      '16112': {no: '16112'},
      '26105': {no: '26105'}
    }

    $scope.refreshCB = function() {
      for( var cb_no in $scope.cbs ) {
        var uri = '/cb/' + cb_no
        var config = {
          // data = Object;
          responseType:"json"
        };
        $http.get(uri, config)
          .success((function(cb_no) {
            return function(response) {
              // var result = JSON.parse(result);
              console.log('cb_no: ' + cb_no);
              $scope.cbs[cb_no]['company_no'] = response.company_no;
              $scope.cbs[cb_no]['bond_short_name'] = response.bond_short_name;
              $scope.cbs[cb_no]['price'] = response.price;
              $scope.cbs[cb_no]['qty'] = response.qty;
              $scope.cbs[cb_no]['convert_price'] = response.convert_price;
              $scope.cbs[cb_no]['convert_share'] = Math.round(100000 / parseInt(response.convert_price));
            }
          })(cb_no))
          .error(function (data, status, headers, config) {
              if ( status == 404 ) {
                delete $scope.cbs[cb_no];
              }
            }
          );
      }
    };

    $scope.addCB = function() {
      $scope.cbs[$scope.CBNo] = {no: $scope.CBNo};
      $scope.CBNo = '';
      $scope.refreshCB();
    };
  }]);