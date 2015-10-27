var masterApp = angular.module('masterApp', ['ngResource', 'ngRoute', 'textAngular']);

masterApp.config(function($routeProvider){
	// Home Page
	$routeProvider
	.when('/', {
		templateUrl : '/views/home', 
		controller : 'homeController'
	});
	// Home-Search Page
	$routeProvider
	.when('/search', {
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
	// Community Page
	$routeProvider
	.when('/community', {
		templateUrl : '/views/community',
		controller : 'communityController'
	});
	// Dynamic route for Posts
	$routeProvider
	.when('/profile/:username/:_id', {
		templateUrl : '/views/post',
		controller : 'postController'
	});
	// Dynamic route Admin Page
	$routeProvider
	.when('/admin/:username', {
		templateUrl : '/views/admin',
		controller : 'adminController'
	});

});

// Factory to query who is currently logged in
masterApp.factory('authenticateUser', function($http){

	var userContainer = { user: null }

	$http.get('/api/me').then(function(response) {
		userContainer.user = response.data;
	})

	return userContainer;

});

// Service for Login/Authenticate
masterApp.service('loginService', function($http, $resource, $location){

		// Login a user
		this.login = function(controllerScope){
			$http.post('/login', controllerScope.loginFormData).

		  		then(function(response) {

		  			$scope.loginError = false;

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
				    $scope.loginError = true;
				    
				})
			};
		

	// Signup a user and log them in
	this.signup = function(controllerScope){

		$http.post('/signup', controllerScope.signUpFormData).

	  		then(function(response) {

	  			if(response.data.err){
	  				$scope.signUpError = true;

	  			}

	  			else{

		  			$scope.signUpError = false;	

		    		$scope.userContainer.user = response.data;

		    		$location.url('/profile/' + response.data.username, {user: response.data.data})
	    		}
	  		}, function(response) {

			    $scope.signUpError = true;

	  	});
		
	};

	// Logout 
	this.logout = function(controllerScope){
		$http.post('/logout', {msg:'hello word!'}).

	  		then(function(response) {
	  			$location.path('/login')
	  			authenticateUser.user = null;

	  		}, function(response) {
			    console.log('Error logging out: ', response)
	  	});
		
	};
});

// Service for Multiform Upload
masterApp.service('multipartForm', function($http){

	this.postForm = function(uploadUrl, data){
		var formData = new FormData();
		// Convert data into formData (an object with key: value pairs)
		for(var key in data){
			formData.append(key, data[key]);
		};

		// Post formData - the third argument is a configuration
		$http.post(uploadUrl, formData, {
			// Don't serialize it (angular does automatically)
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
	}

});

// Service to query for new URL everytime profile pic loads
masterApp.directive('noCacheSrc', function($window) {
  return {
    priority: 99,
    link: function(scope, element, attrs) {
      attrs.$observe('noCacheSrc', function(noCacheSrc) {
        noCacheSrc += '?' + (new Date()).getTime();
        attrs.$set('src', noCacheSrc);
      });
    }
  }
});


// Factory to search for Users
masterApp.factory('userFactory', function($resource){

	var model = $resource('/api/profiles/:username', {username : '@username'})

	return {
		model : model
	}

});

// Factory to search for Users
masterApp.factory('postFactory', function($resource){

	var model = $resource('/api/posts/:_id', {_id : '@_id'})

	return {
		model : model
	}

});

// Home Controller
masterApp.controller('homeController', function($scope, $http, $resource, $location, $routeParams, authenticateUser, loginService){
	
	$scope.userContainer = authenticateUser;


	// Show/Hide functionality for home-page tabs
	// $scope.aboutTab = true;
	$scope.eventsTab = true;
	$scope.jobsTab = false;
	// $scope.resourcesTab = false;

	// $scope.showAboutTab = function() {
	// 	$scope.aboutTab = true;
	// 	$scope.eventsTab = false;
	// 	$scope.jobsTab = false;
	// 	$scope.resourcesTab = false;
	// };

	$scope.showEventsTab = function() {
		// $scope.aboutTab = false;
		$scope.eventsTab = true;
		$scope.jobsTab = false;
		// $scope.resourcesTab = false;
	};

	$scope.showJobsTab = function() {
		// $scope.aboutTab = false;
		$scope.eventsTab = false;
		$scope.jobsTab = true;
		// $scope.resourcesTab = false;
	};

	// $scope.showResourcesTab = function() {
	// 	$scope.aboutTab = false;
	// 	$scope.eventsTab = false;
	// 	$scope.jobsTab = false;
	// 	$scope.resourcesTab = true;
	// }


});

// Community Controller
masterApp.controller('communityController', function($scope, $http, $resource, $location, $routeParams, authenticateUser, loginService, $sce){
	
	$scope.userContainer = authenticateUser;

	$http.get('/api/allPosts').
		then(function(returnData){
			$scope.posts = returnData.data.reverse();
		});

	// Dropdown options for post
	$scope.postSelectOptions = ['Job', 'Content', 'Event'];


	// Delete a Post
	$scope.deletePost = function(post, index){
		console.log('This is the post: ', post, index)

		$http.delete('/api/posts/' + post._id).
		then(function(response){

				$scope.posts.splice(index, 1)
				
		}, function(response){
				$scope.posts.splice(index, 1)

				
		});
	};
	// Like a Post and Update Respective User
	$scope.iLikeThisPostCommunity = function(post){

		$http.get('http://ipinfo.io/json').
			success(function(data){
				
				post.userIP = data.ip;


				$http.post('/api/ilikethispostcommunity', post).
					then(function(response) {
					    		if(response.success){
									console.log("Went through successfully");
					    			
					    		}
								post.likes += 1;

					  		}, function(response) {

					    		console.log('Error: ' + response.error);
					    		console.log('Message: ' + response.message);

					});


				
			})

	};

	// Show Post form on button click
	 $scope.showPostForm = function(){

	 	if($scope.postForm === false){
	 		$scope.postForm === true;
	 	}

	 	else{
	 		$scope.postForm === false;
	 	}

	 };


	// Submit Posts to database
	$scope.submitPost = function(postFormData) {

		$http.post('/api/posts', postFormData).

		  		then(function(response) {
		    		$scope.posts.unshift(response.data)
		    		$scope.posts.forEach(function(post){
		    			post.dateCreated = (new Date(post.dateCreated)).toDateString();
		    		})

		  		}, function(response) {

				    console.log('2nd Response Submit Job')

		  	});
	};


// Login Capabilities (Abstract into a service)
	$scope.showLogin = function(){
		$scope.loginLightbox = true;		
	};
	$scope.closeLogin = function(){
		$scope.loginLightbox = false;
	};
	
    // Login a user
	$scope.login = function(){
		$http.post('/login', $scope.loginFormData).

	  		then(function(response) {

	  			$scope.loginError = false;

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
			    $scope.loginError = true;
			    
			})
		};
		

	// Signup a user and log them in
	$scope.signup = function(){

		$http.post('/signup', $scope.signUpFormData).

	  		then(function(response) {

	  			if(response.data.err){
	  				$scope.signUpError = true;

	  			}

	  			else{

		  			$scope.signUpError = false;	

		    		$scope.userContainer.user = response.data;

		    		$location.url('/profile/' + response.data.username, {user: response.data.data})
	    		}
	  		}, function(response) {

			    $scope.signUpError = true;

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

// Search Controller
masterApp.controller('searchController', function($scope, $http, $resource, $location, $routeParams, authenticateUser){
	
	$scope.userContainer = authenticateUser;


	$http.get('/api/allUsers').
	 	then(function(returnData){
	 		$scope.profiles = returnData.data;
	 	})


});

// Profile controller
masterApp.controller('profileController', function($window, $scope, $http, $resource, $location, $routeParams, authenticateUser, userFactory, multipartForm, $timeout){

	$scope.rand = Math.random();

	$scope.userContainer = authenticateUser;

	$scope.profileUser = userFactory.model.get({username : $routeParams.username})

	$scope.editing = false;

	// Get all Posts
	$http.get('/api/allPosts').
		then(function(returnData){
			$scope.posts = returnData.data.reverse();
		});


	// Delete a Post
	$scope.deletePost = function(post, index){
		console.log('This is the post: ', post, index)

		$http.delete('/api/posts/' + post._id).
		then(function(response){

				$scope.posts.splice(index, 1)
				
		}, function(response){
				$scope.posts.splice(index, 1)

				
		})
	};


	// Turn on/off top profile editing
	$scope.onEditting = function(){	
		$scope.editing = true;
	};

	// Submit Profile Updates to Server
	$scope.submitToServer = function(){
		
		$scope.profileUser.$save();
		multipartForm.postForm('/uploadForm', $scope.profileUser);
	
		$scope.editing = false;

		$timeout(function(){ $window.location.reload(true); }, 1500);
	};

	// Like a Post and Update Respective User
	$scope.iLikeThisPostCommunity = function(post){

		$http.get('http://ipinfo.io/json').
			success(function(data){
				
				post.userIP = data.ip;


				$http.post('/api/ilikethispostcommunity', post).
					then(function(response) {
					    		if(response.success){
									console.log("Went through successfully");
					    			
					    		}
								post.likes += 1;

					  		}, function(response) {

					    		console.log('Error: ' + response.error);
					    		console.log('Message: ' + response.message);

					});


				
			})

	};

	// View first portfolio item
	$scope.viewPortfolioOne =function(){

		$scope.viewingPortfolioOne = true;
		$scope.portfolioOneEditing = false;


	};

	// Turn on portfolio one editting
	$scope.editPortfolioOne = function(){

		$scope.portfolioOneEditing = true;

	};

	// Update first portfolio item
	$scope.updatePortfolioOne =function(){

		$scope.profileUser.$save();
		multipartForm.postForm('/uploadPortfolioOneForm', $scope.profileUser);
		$scope.portfolioOneEditing = false;

		$timeout(function(){ $window.location.reload(true); }, 2000);

	};

	// Close first portfolio item
	$scope.closePortfolioOne =function(){

		$scope.viewingPortfolioOne = false;

	};

	// View second portfolio item
	$scope.viewPortfolioTwo =function(){

		$scope.viewingPortfolioTwo = true;
		$scope.portfolioTwoEditing = false;

	};

	// Turn on portfolio two editting
	$scope.editPortfolioTwo = function(){

		$scope.portfolioTwoEditing = true;

	};

	

	// Update second portfolio item
	$scope.updatePortfolioTwo =function(){

		$scope.profileUser.$save();
		multipartForm.postForm('/uploadPortfolioTwoForm', $scope.profileUser);
		$scope.portfolioTwoEditing = false;

		$timeout(function(){ $window.location.reload(true); }, 2000);

	};

	// Close second portfolio item
	$scope.closePortfolioTwo =function(){

		$scope.viewingPortfolioTwo = false;

	};

	// View third portfolio item
	$scope.viewPortfolioThree =function(){

		$scope.viewingPortfolioThree = true;
		$scope.portfolioThreeEditing = false;


	};

	// Turn on portfolio three editting
	$scope.editPortfolioThree = function(){

		$scope.portfolioThreeEditing = true;

	};

	// Update third portfolio item
	$scope.updatePortfolioThree =function(){

		$scope.profileUser.$save();
		multipartForm.postForm('/uploadPortfolioThreeForm', $scope.profileUser);
		$scope.portfolioThreeEditing = false;

		$timeout(function(){ $window.location.reload(true); }, 2000);

	};

	// Close third portfolio item
	$scope.closePortfolioThree =function(){

		$scope.viewingPortfolioThree = false;

	};

});

// Controls all login/signup/logout functionality (see server.js and authenticate.js for backend routes and functionality)
masterApp.controller('loginController', function($scope, $http, $resource, $location, authenticateUser){

	$scope.userContainer = authenticateUser;

	// Show login lightbox
	$scope.showLogin = function(){
		$scope.loginLightbox = true;		
	};

	// Close login lightbox
	$scope.closeLogin = function(){
		$scope.loginLightbox = false;
	};

	// Login a user
	$scope.login = function(){
		$http.post('/login', $scope.loginFormData).

	  		then(function(response) {

	  			$scope.loginError = false;

	  			// If the HTTP request is successful, but passport has errors:
		    	if(response.err){
		    		console.log('Login request complete, but errors:', response.err)
		    	}
		    	// Everything successful, so we receive user data
		    	else{
		    		authenticateUser.user = response.data;
	    			$location.url('/profile/' + response.data.username)
	    			$scope.loginLightbox = false;
		    	}
		    	// HTTP error
	  		}, function(response) {
			    console.log('Angular login error: ', response.data)
			    $scope.loginError = true;

	  	});
		
	};

	// Signup a user and log them in
	$scope.signup = function(){

		$http.post('/signup', $scope.signUpFormData).

	  		then(function(response) {

	  			if(response.data.err){
	  				$scope.signUpError = true;

	  			}

	  			else{

		  			$scope.signUpError = false;	

		    		$scope.userContainer.user = response.data;

		    		$location.url('/profile/' + response.data.username, {user: response.data.data})
	    		}
	  		}, function(response) {

			    $scope.signUpError = true;

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

masterApp.controller('postController', function($window, $scope, $http, $resource, $location, $routeParams, authenticateUser, postFactory){

	$scope.postData = postFactory.model.get({_id : $routeParams._id});


	$scope.iLikeThisPostCommunity = function(postData){

		$http.get('http://ipinfo.io/json').
			success(function(data){
				
				$scope.postData.userIP = data.ip;

				$scope.postData.likes += 1;

				$http.post('/api/ilikethispostcommunity', postData).
					then(function(response) {
					    		console.log('1st request body: ' + response);

					  		}, function(response) {

					    		console.log('2nd request body: ' + response.body);

					});


				
			})

	};
});

masterApp.controller('adminController', function($scope, $http, $resource, $location, $routeParams, authenticateUser, userFactory){

	$scope.userContainer = authenticateUser;

	$scope.profileUser = userFactory.model.get({username : $routeParams.username})

	// Login a user
	$scope.changePassword = function(){

		if($scope.passwordData.passwordOne === $scope.passwordData.passwordTwo){

			$http.post('/changePassword/' + userContainer.user.username, $scope.passwordData).

	  		then(function(response) {

	  			// If the HTTP request is successful, but errors
		    	if(response.err){
		    		console.log('Change password request complete, but errors:', response.err)
		    	}
		    	// Everything successful, so we receive user data
		    	else{
		    		$scope.passwordSuccessful = true;
		    	}
		    	// HTTP error
	  		}, function(response) {
			    console.log('Angular error: ', response.data)

	  	});

		}

		else {
			$scope.passwordError = true;
		}
		
		
	};

});
