angular.module('cbApp', ['ui.bootstrap', 'ngTable']);
 

var CBController = function($scope, $http, $modal, $filter, ngTableParams) {

    $scope.cbs = {
        '17043': {no: '17043'},
        '29151': {no: '29151'},
        '26105': {no: '26105'}
    }

    $scope.cbs_data = [
        {cb_no: 2, price: 222},
        {cb_no: 1, price: 111},
        {cb_no: 3, price: 333}
    ];

    $scope.refreshCB = function() {
        $scope.cbs_data = [];
        for( var cb_no in $scope.cbs ) {
            var uri = '/cb/' + cb_no
            var config = {
                responseType:"json"
            };
            $http.get(uri, config)
                .success((function(cb_no) {
                    return function(response) {
                        console.log('cb_no: ' + cb_no);
                        $scope.cbs[cb_no] = response;
                        $scope.cbs_data.push(response);

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