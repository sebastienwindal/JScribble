function MainCtrl($scope, JScribbleService, $cookies) {

	$scope.cookies = $cookies;
	$scope.userName = $cookies.userName;
	$scope.scribble = JScribbleService;
	$scope.userAvatar = $cookies.avatar;

	$scope.join = function() {
		$scope.cookies.userName = $scope.userName;
		$scope.cookies.avatar = $scope.userAvatar;
		JScribbleService.init(window.location.host, $scope.userName, $scope.userAvatar);
		
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
		$scope.userAvatar = JScribbleService.possibleAvatars[0];
		JScribbleService.logout();
	};

	$scope.setAvatar = function(avatar) {

		$scope.userAvatar = avatar;
	}
}