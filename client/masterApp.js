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

masterApp.controller('loginController', function($scope, $http, $resource, $rootScope){


	$scope.login = function(){
		$http.post('/login', $scope.formData).
	  		then(function(response) {
		    	if(response.err){
		    		console.log('Successful login:', response.data)
		    	}
		    	else{
		    		console.log('Login request complete, but errors.', response.data)
		    	}
	  		}, function(response) {
			    console.log('Angular login error: ', response.data)
	  	});
		
	};

	$scope.signup = function(){

		$http.post('/signup', $scope.formData).
	  		then(function(response) {
	  			$rootScope.currentUser = response.data;
	    		console.log('Succesfully signed up as: ', $rootScope.currentUser.username)
	  		}, function(response) {
			    console.log('Error signing up: ', response.data)
	  	});

	  	console.log('Checking again that we are logged as :', $rootScope.currentUser.username)
		
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