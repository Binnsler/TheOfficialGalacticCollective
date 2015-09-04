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
		}).
		then(function(response) {
		    		console.log(response.err)

		  		}, function(response) {				
				    console.log(response)
				    console.log('I am the response from the post request.')

		  	});
	}
	}

})