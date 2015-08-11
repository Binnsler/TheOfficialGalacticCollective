var masterApp = angular.module('masterApp', ['ngResource', 'ngRoute']);

masterApp.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl : '/views/search', 
		controller : ''
	});
	$routeProvider
	.when('/login', {
		templateUrl : '/views/login',
		controller: 'loginController'
	});
});

masterApp.controller('loginController', function($scope, $http, $resource){


	$scope.login = function(){
		$http.post('/login', $scope.formData).
	  		then(function(response) {
		    	if(response.err){
		    		console.log('Check your password or username')
		    	}
		    	else{
		    		console.log(response.data.username)
		    	}
	  		}, function(response) {
			    console.log('Angular login error: ', response.data)
	  	});
		
	};

	$scope.signup = function(){

		$http.post('/signup', $scope.formData).
	  		then(function(response) {
	    		console.log(response)
	  		}, function(response) {
			    console.log(response.data)
	  	});
		
	};

	$scope.logout = function(){
		$http.post('/logout', {msg:'hello word!'}).
	  		then(function(response) {
	    // this callback will be called asynchronously
	    // when the response is available
	  		}, function(response) {
			    // alert("ERROR";)
	  	});
		
	};
});