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
            var date_fmt = moment($scope.dt).format('YYYYMMDD');
            var uri = '/cb/' + cb_no + '/' + date_fmt;
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
        count: 10,           // count per page
        sorting: {
            cb_no: 'asc'     // initial sorting
        }
    }, {
        total: $scope.cbs_data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var filteredData = params.filter() ?
                    $filter('filter')($scope.cbs_data, params.filter()) :
                    $scope.cbs_data;
            var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.cbs_data;

            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.resetSortFilter = function() {
        $scope.tableParams.sorting({});
        $scope.tableParams.filter({});
    }

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


    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.openDP = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.DPOpened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.format = 'yyyy-MM-dd';

    $scope.$watch('dt', function(newValue, oldValue) {
            $scope.refreshCB();
        }, true);

};

var ModalInstanceCtrl = function ($scope, $modalInstance, cb) {

    $scope.cb = cb;

    $scope.close = function () {
        $modalInstance.close();
    };
};