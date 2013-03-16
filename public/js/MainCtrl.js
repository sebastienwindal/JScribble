function MainCtrl($scope, JScribbleService, $cookieStore) {

	$scope.cookieStore = $cookieStore;
	
	$scope.scribble = JScribbleService;

	var cookieData = $cookieStore.get('JScribble');
	var avatarImg = null;

	if (cookieData) {
		avatarImg = cookieData.avatar;
		$scope.userName = cookieData.userName
	}

	for (i in JScribbleService.possibleAvatars) {
		if (JScribbleService.possibleAvatars[i].image == avatarImg) {
			$scope.userAvatar = JScribbleService.possibleAvatars[i];
			$scope.userAvatar.isSelected = true;
		} else {
			JScribbleService.possibleAvatars[i].isSelected = false;
		}
	}

	if (!$scope.userAvatar) {
		var rand = Math.floor(Math.random() * 10000) % JScribbleService.possibleAvatars.length;
		$scope.userAvatar = JScribbleService.possibleAvatars[rand];
		 JScribbleService.possibleAvatars[rand].isSelected = true;
	}

	$scope.join = function() {
		$cookieStore.put('JScribble', { userName: $scope.userName,
										avatar: $scope.userAvatar.image });
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
		$cookieStore.remove('JScribble');
		$scope.shouldShowNameModal = true;
		
		JScribbleService.logout();
	};

	$scope.setAvatar = function(avatar) {
	
		$scope.userAvatar = avatar;

		for (idx in $scope.scribble.possibleAvatars) {
			var a = $scope.scribble.possibleAvatars[idx];

			if (a != avatar) {
				a.isSelected = false;
			}
		}
	}
}

function AvatarController($scope) {
	
	$scope.isSelected = false;

	$scope.setAvatar = function(avatar) {

		avatar.isSelected = true;

		$scope.$parent.setAvatar(avatar);
	}
}