function ChatCtrl($scope, JScribbleService) {
	
	$scope.currentMessage = '';
	$scope.scribble = JScribbleService;
	$scope.userName = $scope.scribble.userName;

	$scope.sendChatMessage = function() {
		if ($scope.currentMessage && $scope.currentMessage.length > 0) {
			JScribbleService.sendChatMessage($scope.currentMessage);
			$scope.currentMessage = '';
		}
	}

	$scope.$watch(JScribbleService.userName, function() {
		$scope.userName = JScribbleService.userName;
	})
}


app.directive('sendMessageOnEnter', function() {

	var myDirective = {
		restrict: 'A',
		replace: false,

		link: function(scope, element, attrs) {
			
			var submitElement = angular.element(element);

			submitElement.bind('keyup', function(e) {
				
				if(e.which == 13 /* enter */) {
					scope.sendChatMessage();
					scope.$apply();
				}
			});
		}
	};
	return myDirective;
});


app.directive('autoScrollDown', function() {
	var mydirective = {
		restrict: 'A',
		replace: false,

		link: function(scope, element, attrs) {
			var el = angular.element(element);
			scope.scrollDown = function(ele) {
	        	el.scrollTop(el.prop('scrollHeight'));
	        };
			
			var elementToScroll = angular.element(element);

			scope.scrollDown(element);

			element.bind('DOMSubtreeModified', scope.scrollDown);
		}
	}
	return mydirective;
});

