angular.module('cbApp', ['ui.bootstrap', 'ngTable']);
 

var CBController = function($scope, $http, $modal, $filter, $q, ngTableParams) {

    $scope.cbs = {
        '17043': {},
        '29151': {},
        '26105': {}
    }

    $scope.cbs_data = [];

    $scope.refreshCB = function() {
        $scope.cbs_data = [];
        var api_promises = [];
        for( var cb_no in $scope.cbs ) {
            var uri = '/cb/' + cb_no
            var config = {
                responseType:"json"
            };

            var api_promise = $http.get(uri, config)
                .success((function(cb_no) {
                    return function(response) {
                        console.log('cb_no: ' + cb_no);
                        $scope.cbs_data.push(response);
                    }
                })(cb_no))
                .error(function (data, status, headers, config) {
                        if ( status == 404 ) {
                            delete $scope.cbs[cb_no];
                        }
                    }
                );

            api_promises.push(api_promise);
        }

        $q.all(api_promises)
        .then(function () {
                if ($scope.cbs_data.length > 0) {
                    $scope.tableParams.reload();
               }
            }
        );

    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: $scope.cbs_data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.cbs_data, params.orderBy()) :
                    $scope.cbs_data;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

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