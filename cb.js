angular.module('cbApp', ['ui.bootstrap']);
 

var CBController = function($scope, $http, $modal) {

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
                        console.log('cb_no: ' + cb_no);
                        $scope.cbs[cb_no] = response;
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

    $scope.open = function (cb) {

        var modalInstance = $modal.open({
            templateUrl: 'CBDetail.html',
            controller: ModalInstanceCtrl,
            resolve: {
                cb: function () {
                    return cb;
                }
            }
        });
    };
};

var ModalInstanceCtrl = function ($scope, $modalInstance, cb) {

    $scope.cb = cb;

    $scope.close = function () {
        $modalInstance.close();
    };
};