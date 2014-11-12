angular.module('dirtest', ['myService', 'ngTable', 'ui.bootstrap', 'ngSanitize'])
    .controller('dirtest', function($scope, testFactory, ngTableParams, $filter, $rootScope, $timeout, $sce) {
        $scope.song = {}
            // $scope.song.source = sourceurl;


        $scope.loaddata = function(param) {
            testFactory.getdata().success(function(data1) {
                
                $scope.testdata = data1;
                var data = data1;
              
                $scope.song.source = $sce.trustAsResourceUrl(data[0].trackurl);
                  $timeout(function() {
                document.getElementById("myAudio").load();
               
            }, 0)
                 //document.getElementById("myAudio").load();
                $scope.findstyle = {
                    'background-image': 'url(' + data[0].imgurl + ')',
                    'bacground-size': 'contain',
                    'background-repeat': 'no-repeat',
                    'background-position': '20%'
                }
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 3, // count per page

                }, {
                    counts: [],
                    total: data.length, // length of data

                    getData: function($defer, params) {
                        var orderedData = params.sorting() ?
                            $filter('orderBy')(data, params.orderBy()) :
                            data;
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                    }
                });
            })
        }
        $scope.loaddata();



        $scope.toTestInput = function() {
            console.log($scope.testInput);

        }

        $scope.play = function(sourceurl, imgurl) {


            $scope.song.source = $sce.trustAsResourceUrl(sourceurl);
            console.log($scope.findstyle)
            $scope.findstyle['background-image'] = 'url(' + imgurl + ')';
            console.log($scope.findstyle);
            $timeout(function() {
                document.getElementById("myAudio").load();
                document.getElementById("myAudio").play();
            }, 0)

        }
        $rootScope.$on("myEvent", function(event, args) {


            $scope['tableParams'] = null;
            $scope.loaddata('songadded');
        });

    })
    .controller('modal', function($scope, $modal, $log) {

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
    })

.controller('ModalInstanceCtrl', function($scope, $modalInstance, items, sendFactory, $rootScope) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function() {
        $modalInstance.close($scope.selected.item);

        sendFactory.postdata($scope.trackname).success(function(data) {
            $rootScope.$broadcast("myEvent")
        });

    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
