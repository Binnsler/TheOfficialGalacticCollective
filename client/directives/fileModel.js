// Directive to upload profile pic on profile page
angular.module('masterApp').directive('fileModel', function($parse){

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

});