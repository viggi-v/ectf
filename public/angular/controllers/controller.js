function loginController($scope, $http, $state, $cookies){
    $scope.login = function() {
        var userData = {};
        userData.username = $scope.username;
        userData.password= $scope.password;
        $http({
            url: "/api/users/"+userData.username,
            data: userData,
            method: "POST"
        }).then(function(response) {
            if(response.data.loggedIn === true) {
                // todo set the cookie
                $cookies.put('loggedIn','true');
                if(response.data.admin === true){
                    $cookies.put('admin','true');
                }
                $state.go('home');
            }
            else{
                // todo show the error message
            }
        }, function(response) {
            // todo show the error message
            console.log(response);
        });
    }
}
function logoutController($http, $state, $scope, $cookies){
    $scope.logout = function(){
        $http({
            url : "/api/logout",
            method : "POST"
        }).then(function(){
            // clear the cookies
            $cookies.remove('loggedIn');
            $cookies.remove('admin');
            $state.go('home');
        });
    };
    $scope.logout();
}
function signupController($scope, $http,$state) {
    $scope.signup = function(){
        var userData = {};
        userData.username = $scope.username;
        userData.password = $scope.password;
        userData.email = $scope.email;
        if($scope.adminPassword) {
            userData.adminPassword = $scope.adminPassword;
            userData.admin = true;
        }
        $http({
            url: "/api/users",
            data: userData,
            method: "POST"
        }).then(function(response) {
            if(response.data === "User inserted")
                $state.go("login");
            else
                $state.signupError = response.data;
        }, function(response) {
            console.log(response);
        });
    }
}
function homeController(){
    console.log("foo");
}
function leaderBoardController($http,$scope) {
  $scope.loadLeaderBoard = function(){
      //todo load the leaderboard
      $http({
          url : "/api/leaderboard",
          method : "GET"
      }).then(function(response){
          $scope.challenges = response.data.challenges;
          $scope.users = response.data.users;
      });
  };
  $scope.loadLeaderBoard();
}
function challengeController($scope,$http, $stateParams){
    $scope.getChallenge = function(){
        console.log("Getting challenge "+$stateParams.title);
        $http({
            url : "/api/challenges/challenge/"+$stateParams.title,
            method : "GET"
        }).then(function(response){
            $scope.challenge = response.data[0];
            console.log($scope.challenge);
        });
    };
    $scope.getChallenge();
    $scope.submitFlag = function(){
        $http({
            url : "/api/challenges/challenge/"+$stateParams.title,
            method : "POST",
            data : $scope.flagData
        }).then(function(response){
            console.log(response);
            //todo refresh the challenge list and the score.
        })
    };
    $scope.editing = false;
    $scope.editMessage = "Edit";
    $scope.editChallenge = function(){
        $http({
            url : "/api/admin/"+$scope.challenge._id,
            data : $scope.challengeData,
            method : "POST"
        }).then(function(response){
            console.log(response);
        });
    };
    $scope.deleteChallenge = function(){
        $http({
            url : "/api/challenges/admin/"+$scope.challenge._id,
            method : "DELETE"
        }).then(function(response){
            console.log(response);
        });
    };
    $scope.toggleEdit = function(){
        if($scope.editing === true){
            $scope.editing = false;
            $http({
                url : "/api/challenges/admin/"+$scope.challenge._id,
                data : $scope.challenge,
                method : "POST"
            }).then(function(response){
                console.log(response);
            });
            $scope.editMessage = "Edit";
        }
        else{
            $scope.editing = true;
            $http({
                url : "/api/challenges/admin/"+$scope.challenge._id,
                method : "GET"
            }).then(function(response){
                $scope.challenge = response.data;
            });
            $scope.editMessage = "Save";
        }
    };

}
function challengesController($scope, $http){
    $scope.getChallenges = function(){
        $http({
            url : "/api/challenges",
            method : "GET"
        }).then(function(response){
            $scope.challenges = response.data;

        });
    };
    $scope.getChallenges();
    $scope.saveNewChallenge = function(){
        $http({
            url : "/api/challenges/admin/",
            data : $scope.challengeData,
            method : "POST"
        }).then(function(response){
            console.log(response);
        });
    };
}
function mainController($rootScope,$scope,$cookies){
    $rootScope.$on('$stateChangeStart',function(){
        $scope.loggedin = $cookies.get('loggedIn');
        $scope.admin = $cookies.get('admin')
    })
}

angular.module('mainApp')
    .controller('mainController',mainController)
    .controller('homeController',homeController)
    .controller('signupController',signupController)
    .controller('loginController', loginController)
    .controller('logoutController', logoutController)
    .controller('challengeController',challengeController)
    .controller('leaderBoardController',leaderBoardController)
    .controller('challengesController',challengesController);