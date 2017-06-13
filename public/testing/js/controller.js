function homeController($stateParams, $scope){
	$scope.set = function(){
		$scope.note = "The id is "+$stateParams.id;
		console.log($stateParams.id);
	}
	$scope.set();
}
function pageController(){
}
function paperController($scope, $http){
	$scope.sendData = function(){
		var dataObj = {};
		
		if($scope.data !== '')
			dataObj = JSON.parse($scope.data);

		$http({
			url : $scope.url,
			data : dataObj,
			method : $scope.method
			//withCredentials : true
		}).then(function(response){
			$scope.serverResponse = response.data;
			console.log("I'm done");
		},function(response){
			// do nothing, cry!
			$scope.serverResponse = "Error!"+ response.status;

		});
	};
}
function loginController(){}

angular.module('mainApp')
		.controller('homeController',homeController)
		.controller('pageController',pageController)
		.controller('paperController',paperController)
		.controller('loginController',loginController);
