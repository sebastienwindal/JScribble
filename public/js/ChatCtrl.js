function ChatCtrl($scope, JScribbleService) {
	
	$scope.currentMessage = '';
	$scope.scribble = JScribbleService;

	$scope.sendChatMessage = function() {
		JScribbleService.sendChatMessage($scope.currentMessage);
		$scope.currentMessage = '';
	}
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

			element.bind('DOMNodeInserted', scope.scrollDown);
		}
	}
	return mydirective;
});