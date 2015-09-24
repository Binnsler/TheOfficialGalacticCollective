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

// Service for Login/Authenticate
masterApp.service('loginService', function($scope, $http, $resource, $location, authenticateUser){

$scope.userContainer = authenticateUser;

	// Login a user
	this.login = function(){
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

	  	});
		
	};

	// Signup a user and log them in
	this.signup = function(){

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
	this.logout = function(){
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

// Factory to search for Users
masterApp.factory('postFactory', function($resource){

	var model = $resource('/api/posts/:_id', {_id : '@_id'})

	return {
		model : model
	}

});

// Community Controller
masterApp.controller('communityController', function($scope, $http, $resource, $location, $routeParams, authenticateUser){
	
	$scope.userContainer = authenticateUser;

	$http.get('/api/allPosts').
		then(function(returnData){
			$scope.posts = returnData.data.reverse();
		});

	// $scope.theDate = post.dateCreated.toISOString();

	// Login Capabilities
	$scope.login = function(){
		loginService.login()
	};
	$scope.signup = function(){
		loginService.signup()
	};
	$scope.logout = function(){
		loginService.logout()
	};

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
	$scope.submitJob = function(jobFormData) {
		console.log(jobFormData)
		jobFormData.type = 'job';
		$http.post('/api/posts', jobFormData).

		  		then(function(response) {
		    		$scope.posts.unshift(response.data)
		    		$scope.posts.forEach(function(post){
		    			post.dateCreated = (new Date(post.dateCreated)).toDateString();
		    		})

		  		}, function(response) {

				    console.log('2nd Response Submit Job')

		  	});
	};

	$scope.submitContent = function(contentFormData) {
		contentFormData.type = 'content';
		$http.post('/api/posts', contentFormData).

		  		then(function(response) {
		    		$scope.posts.unshift(response.data)
		    		$scope.posts.forEach(function(post){
		    			post.dateCreated = (new Date(post.dateCreated)).toDateString();
		    		})

		  		}, function(response) {
				    console.log('2nd Response Submit Content')

		  	});
	};

	$scope.submitEvent = function(eventFormData) {
		eventFormData.type = 'event';
		$http.post('/api/posts', eventFormData).

		  		then(function(response) {
		    		if(response.err){
		    			console.log('There was an error creating the post.')
		    		}

		    		else{
		    			$scope.posts.unshift(response.data)
		    			$scope.posts.forEach(function(post){
		    			post.dateCreated = (new Date(post.dateCreated)).toDateString();
		    			post.time = (new Date(post.time)).toDateString();
		    			})
		    			
		    		}

		    		

		  		}, function(response) {
				    console.log('2nd Response Submit Event')

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

	 // Login Capabilities
	$scope.login = function(){
		loginService.login()
	};
	$scope.signup = function(){
		loginService.signup()
	};
	$scope.logout = function(){
		loginService.logout()
	};


});

// Profile controller
masterApp.controller('profileController', function($window, $scope, $http, $resource, $location, $routeParams, authenticateUser, userFactory, multipartForm, $timeout){

	$scope.rand = Math.random();

	$scope.userContainer = authenticateUser;

	$scope.profileUser = userFactory.model.get({username : $routeParams.username})

	$scope.editing = false;

	// Login Capabilities
	$scope.showLogin = function(){
		$scope.loginLightbox = true;		
	};
	$scope.closeLogin = function(){
		$scope.loginLightbox = false;
	}
	$scope.login = function(){
		loginService.login()
	};
	$scope.signup = function(){
		loginService.signup()
	};
	$scope.logout = function(){
		loginService.logout()
	};

	// Get request to get all the user's posts
	$http.get('/api/allUserPosts?username=' + $routeParams.username).
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
		
		console.log($scope.profileUser)
		console.log('I just ran.')
		$scope.profileUser.$save();
		multipartForm.postForm('/uploadForm', $scope.profileUser);
	
		// $http.post('/uploadPic', $scope.uploadPic).
		// then(function(response) {
		//     		console.log(response.err)

		//   		}, function(response) {
		// 		    console.log(response.body)

		//   	});
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
	console.log($scope.postData)


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
