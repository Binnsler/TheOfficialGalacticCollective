// Directive to upload profile pic on profile page

masterApp.directive('fileModel', ['$parse', function($parse){

	return {

		restrict: 'AE',
		link: function(scope, element, attrs){
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.on('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0])
				})
			})
		}

	}

}]);