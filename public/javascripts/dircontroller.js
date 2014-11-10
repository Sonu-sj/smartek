angular.module('dirtest', ['myService', 'ngTable','ui.bootstrap'])
    .controller('dirtest', function($scope, testFactory, ngTableParams, $filter) {
        testFactory.getdata().success(function(data1) {
            $scope.testdata = data1;
            var data = data1;

            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 2, // count per page
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: data.length, // length of data

                getData: function($defer, params) {
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                }
            });
        })


    })
    .controller('modal', function($scope,$modal,$log) {

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function(size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
    )

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items,sendFactory) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
   
    sendFactory.postdata($scope.trackname).success(function(data){console.log(data)});
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});