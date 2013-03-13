function MainCtrl($scope, JScribbleService, $cookies) {

	$scope.cookies = $cookies;
	$scope.userName = $cookies.userName;
	$scope.avatar = JScribbleService.possibleAvatars[Math.floor((Math.random()*JScribbleService.possibleAvatars.length)+1)];
	$scope.scribble = JScribbleService;

	$scope.join = function() {
		$scope.cookies.userName = $scope.userName;
		JScribbleService.init(window.location.host, $scope.userName, $scope.avatar);
		
		// wait for CB from join...
		$scope.shouldShowNameModal = false;
	};

	if (!$scope.userName || $scope.userName.length == 0) {
		$scope.shouldShowNameModal = true;
	} else {
		$scope.shouldShowNameModal = false;
		$scope.join();
	}

	$scope.closeNameModal = function() {
		$scope.join();
	};

	$scope.logout = function() {
		$scope.cookies.userName = '';
		$scope.shouldShowNameModal = true;
		JScribbleService.logout();
	}
}