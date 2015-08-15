var masterApp = angular.module('masterApp', ['ngResource', 'ngRoute']);

masterApp.config(function($routeProvider){
	// Home-Search Page
	$routeProvider
	.when('/', {
		templateUrl : '/views/search', 
		controller : 'searchController'
	});
	// Login-Signup Page
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
	//Community Page
	$routeProvider
	.when('/community', {
		templateUrl : '/views/community',
		controller : 'communityController'
	})
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

	return {
		model : model
	}

});

// Community Controller
masterApp.controller('communityController', function($scope, $http, $resource, $location, $routeParams, authenticateUser){
	
	$scope.userContainer = authenticateUser;

	$http.get('/api/allPosts').
		then(function(returnData){
			$scope.posts = returnData.data;
		})

	// Show Post forms on respective button click
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

	// Submit Posts to database
	$scope.submitJob = function() {
		$scope.jobFormData.type = 'job';
		$http.post('/api/posts', $scope.jobFormData).

		  		then(function(response) {
		    		console.log(response)

		  		}, function(response) {
				    console.log('Successfully submitted a job')

		  	});
	};

	$scope.submitContent = function() {
		$scope.contentFormData.type = 'content';
		$http.post('/api/posts', $scope.contentFormData).

		  		then(function(response) {
		    		console.log(response.err)

		  		}, function(response) {
				    console.log('Successfully submitted content')

		  	});
	};

	$scope.submitEvent = function() {
		$scope.eventFormData.type = 'event';
		$http.post('/api/posts', $scope.eventFormData).

		  		then(function(response) {
		    		if(response.err){
		    			console.log('There was an error creating the post.')
		    		}

		    		else{
		    			console.log('Successfully submitted an event')
		    		}

		    		

		  		}, function(response) {
				    console.log('HTTP error for creating post.')

		  	});
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

	// WHY DOES $scope.profileUser give me an object, but $scope.profileUser._id give me 'undefined'????
	console.log($scope.profileUser)

	// Get request to get all the user's posts
	// $http.get('/api/allUserPosts', $scope.profileUser._id).
	// 	then(function(returnData){
	// 		$scope.posts = returnData.data;
	// 	})

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

	    		$scope.userContainer.user = response.data;

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