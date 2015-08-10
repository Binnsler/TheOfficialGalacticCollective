var loginApp = angular.module('loginApp', ['ngResource', 'ngRoute']);

// loginApp.config();

loginApp.controller('SignInController', function($scope){

	$scope.signIn = function(){
		console.log('HEY')
	};

	console.log('Hi, I am the SignInController')

});

loginApp.controller('SignUpController', function($scope){
	console.log('Hey, I am the SignUpController')
});