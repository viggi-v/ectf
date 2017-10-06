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
                $scope.loginError = response.data.statusText;
            }
        }, function(response) {
            $scope.loginError = "Connectivity issue, try again!";
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
            if(response.status.signup === true)
                $state.go("login");
            else
                $scope.signupError = response.data;
        }, function(response) {
            $scope.signupError = "Connectivity issue, try again!";
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
          for(var index = 0; index < $scope.users.length; index++){
              $scope.users[index].points= 0;
              $scope.users[index].challenges = [];
              $scope.challenges.forEach(function(challenge){
                  let obj = $scope.users[index].solves.find(o => o.title === challenge.title);
                  if(obj){
                      $scope.users[index].challenges.push(true);
                      $scope.users[index].points += obj.points;
                  }
                  else{
                      $scope.users[index].challenges.push(false);
                  }
              });
          }
          $scope.users.sort((a,b) => a.points < b.points);

          console.log($scope.users);
      });
  };
  $scope.loadLeaderBoard();
}
function challengeController($scope,$http, $stateParams,$state){
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
    $scope.submitFlag = function(flag){
        $http({
            url : "/api/challenges/challenge/"+$stateParams.title,
            method : "POST",
            data : {'flag' : flag}
        }).then(function(response){
            if(response.data.solved){
                $state.go('challenges');
            }
            else
                $scope.flagError = "Better Luck Next time!";
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
            $scope.getPoints();
        });
    };
    $scope.getPoints = function(){
        $scope.points = 0;
        $scope.challenges.forEach(function(obj){
            if(obj.solved)
                $scope.points +=obj.data.points;
        });
    }
    $scope.getChallenges();
    $scope.saveNewChallenge = function(){
        console.log($scope.challengeData);
        console.log("foo");
        $http({
            url : "/api/challenges/admin/",
            data : $scope.challengeData,
            method : "POST"
        }).then(function(response){
            console.log(response);
        });
    };
}
function adminController($scope,$http){
    $scope.saveNewChallenge = function(){
        console.log($scope.challengeData);
        console.log("foo");
        $http({
            url : "/api/challenges/admin/",
            data : $scope.challengeData,
            method : "POST"
        }).then(function(response){
            console.log(response);
        });
    };
}
function mainController($rootScope,$scope,$cookies,$http){
    $rootScope.$on('$stateChangeStart',function(){
        $scope.loggedin = $cookies.get('loggedIn');
        $scope.admin = $cookies.get('admin');
    });
    $scope.getUserData = function(){
        $http({
            url : "/api/users/user/info",
            // sorry for doing this the routing was kinda fucked up in the backend.
            method : "GET"
        }).then(function(response){
            $scope.user = response.data;
        })
    };
    $scope.getUserData()

}

angular.module('mainApp')
    .controller('mainController',mainController)
    .controller('homeController',homeController)
    .controller('signupController',signupController)
    .controller('loginController', loginController)
    .controller('logoutController', logoutController)
    .controller('challengeController',challengeController)
    .controller('leaderBoardController',leaderBoardController)
    .controller('adminController',adminController)
    .controller('challengesController',challengesController);