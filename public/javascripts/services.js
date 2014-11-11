angular.module('myService', [])

// Factory
.factory('testFactory', function($http) {
    return {
        getdata: function() {
            //$http.get('/retrieve').success(console.log('success'));
            
            return $http.get('/getdata')

        }
    }
})

.factory('sendFactory', function($http) {
    return {
        postdata: function(track) {

            return $http.post('/send',{trackname:track})
        }
    }
});
