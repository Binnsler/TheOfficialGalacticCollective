var masterApp = angular.module('masterApp', ['ngResource', 'ngRoute']);

masterApp.config(function($routeProvider){
	// Home slash Search Page
	$routeProvider
	.when('/', {
		templateUrl : '/views/search', 
		controller : 'searchController'
	});
	// Login slash Signup Page
	$routeProvider
	.when('/login', {
		templateUrl : '/views/login',
		controller : 'loginController'
	});
	// Dynamic route for Profiles
	$routeProvider
	.when('/profile/:username', {
		templateUrl : '/views/profile-template',
		controller : 'profileController'
	});
	// Community Page
	// $routeProvider
	// .when('/profile/:username', {
	// 	templateUrl : '/views/community',
	// 	controller : 'communityController'
	// })
});

// Factory to query who is currently logged in
masterApp.factory('authenticateUser', function($http){

	var userContainer = { user: null }

	$http.get('/api/me').then(function(response) {
		userContainer.user = response.data;
	})

	return userContainer;

});

// Factory to search for Users
masterApp.factory('userFactory', function($resource){

	var model = $resource('/api/profiles/:username', {username : '@username'})
	// this._id
	// @_id

	return {
		model : model,
		users : model.query()
	}

});

// Factory to search for Posts
masterApp.factory('postFactory', function($resource){

	var model = $resource('/api/posts')
	// this._id
	// @_id

	return {
		model : model,
		posts : model.query()
	}

});

// Community Controller
masterApp.controller('communityController', function($scope, $http, $resource, $location, $routeParams, authenticateUser, postFactory){
	
	$scope.userContainer = authenticateUser;

	$scope.aPost = new postFactory.model.post({$scope.postData})


	
	postFactory.model.post({createdById : $scope.postData})

	// From profileContainer DELETE IMMEDIATELY
	$scope.userContainer = authenticateUser;

	$scope.profileUser = userFactory.model.get({username : $routeParams.username})


	$scope.editing = false;

	// Turn on/off editing
	$scope.onEditting = function(){	
		$scope.editing = true;
	};

	$scope.submitToServer = function(){
		userFactory.model.save($scope.profileUser);
		$scope.editing = false;
	};

	// DO NOT DELETE, part of Community Controller
	$http.get('/api/allUsers').
	 	then(function(returnData){
	 		$scope.profiles = returnData.data;
	 	})

	 $scope.showJobForm = function(){
	 	$scope.contentForm = false;
	 	$scope.eventForm = false;
	 	$scope.jobForm = true;
	 };

	  $scope.showContentForm = function(){
	 	$scope.eventForm = false;
	 	$scope.jobForm = false;
	 	$scope.contentForm = true;
	 };

	 $scope.showEventForm = function(){
	 	$scope.jobForm = false;
	 	$scope.contentForm = false;
	 	$scope.eventForm = true;
	 };

});

// Search Controller
masterApp.controller('searchController', function($scope, $http, $resource, $location, $routeParams, authenticateUser){
	
	$scope.userContainer = authenticateUser;

	
	$http.get('/api/allUsers').
	 	then(function(returnData){
	 		$scope.profiles = returnData.data;
	 	})


});

// Profile controller
masterApp.controller('profileController', function($scope, $http, $resource, $location, $routeParams, authenticateUser, userFactory){

	$scope.userContainer = authenticateUser;

	$scope.profileUser = userFactory.model.get({username : $routeParams.username})


	$scope.editing = false;

	// Turn on/off editing
	$scope.onEditting = function(){	
		$scope.editing = true;
	};

	$scope.submitToServer = function(){
		userFactory.model.save($scope.profileUser);
		$scope.editing = false;
	};

});

// Controls all login/signup/logout functionality (see server.js and authenticate.js for backend routes and functionality)
masterApp.controller('loginController', function($scope, $http, $resource, $location, authenticateUser){

	$scope.userContainer = authenticateUser;

	// Login a user
	$scope.login = function(){
		$http.post('/login', $scope.loginFormData).

	  		then(function(response) {

	  			// If the HTTP request is successful, but passport has errors:
		    	if(response.err){
		    		console.log('Login request complete, but errors:', response.err)
		    	}
		    	// Everything successful, so we receive user data
		    	else{
		    		authenticateUser.user = response.data;
	    			$location.url('/profile/' + response.data.username)
		    	}
		    	// HTTP error
	  		}, function(response) {
			    console.log('Angular login error: ', response.data)

	  	});
		
	};

	// Signup a user and log them in
	$scope.signup = function(){

		$http.post('/signup', $scope.signUpFormData).

	  		then(function(response) {
	    		$scope.userContainer = response.data.data;
	    		$location.url('/profile/' + response.data.username, {user: response.data.data})

	  		}, function(response) {
			    console.log('Error signing up: ', response.data)

	  	});
		
	};

	// Logout 
	$scope.logout = function(){
		$http.post('/logout', {msg:'hello word!'}).

	  		then(function(response) {
	  			$location.path('/login')
	  			authenticateUser.user = null;

	  		}, function(response) {
			    console.log('Error logging out: ', response)
	  	});
		
	};
});