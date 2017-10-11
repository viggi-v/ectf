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
                $state.go('home',null,{reload : true});
            }
            else{
                $scope.loginError = response.data.statusText;
            }
        }, function(response) {
            $scope.loginError = "Connectivity issue, try again!";
            //console.log(response);
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
            //console.log(response.status);
            if(response.data.signup === true)
                $state.go("login");
            else
                $scope.signupError = response.data.errorCode;
        }, function(response) {
            $scope.signupError = "Connectivity issue, try again!";
        });
    }
}
function homeController(){
    //console.log("foo");
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
                  var obj = $scope.users[index].solves.find(function(o){
                      return o.title === challenge.title;
                  });
                  //let obj = $scope.users[index].solves.find(o => o.title === challenge.title);
                  if(obj){
                      $scope.users[index].challenges.push(true);
                      $scope.users[index].points += obj.points;
                  }
                  else{
                      $scope.users[index].challenges.push(false);
                  }
              });
          }
          $scope.users.sort(function(a,b){return a.points < b.points});

          //console.log($scope.users);
      });
  };
  $scope.loadLeaderBoard();
}
function challengeController($scope,$http, $stateParams,$state, $window){
    $scope.getChallenge = function(){
        $http({
            url : "/api/challenges/challenge/"+$stateParams.link,
            method : "GET"
        }).then(function(response){
            $scope.challenge = response.data[0];
        });
    };
    $scope.getChallenge();
    $scope.submitFlag = function(flag){
        $http({
            url : "/api/challenges/challenge/"+$stateParams.link,
            method : "POST",
            data : {'flag' : flag}
        }).then(function(response){
            if(response.data.solved){
                $state.go('challenges',null,{reload : true});
            }
            else
                $scope.flagError = "Better Luck Next time!";
        })
    };
    $scope.editing = false;
    $scope.editMessage = "Edit";
    $scope.deleteChallenge = function(){
        $http({
            url : "/api/challenges/admin/"+$scope.challenge._id,
            method : "DELETE"
        }).then(function(response){
            $state.go('challenges');
        });
    };
    $scope.toggleEdit = function(){
        if($scope.editing === true){
            $scope.editing = false;
            $scope.challenge.link = $scope.challenge.title.trim().replace(/[^a-zA-Z0-9_]/gi,'');
            $http({
                url : "/api/challenges/admin/"+$scope.challenge._id,
                data : $scope.challenge,
                method : "POST"
            }).then(function(response){
                //console.log(response);
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
    $scope.openLink = function(link){
        $window.open(link,'_blank');
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
    };
    $scope.getChallenges();
}
function adminController($scope,$http){
    $scope.saveNewChallenge = function(){
        //console.log($scope.challengeData);
        //console.log("foo");
        $scope.challengeData.link = $scope.challengeData.title.trim().replace(/[^a-zA-Z0-9_]/gi,'');
        $http({
            url : "/api/challenges/admin/",
            data : $scope.challengeData,
            method : "POST"
        }).then(function(response){
            //console.log(response);
        });
    };
}
function mainController($rootScope,$scope,$cookies,$http){
    $rootScope.$on('$stateChangeStart',function(event, toState){
        $scope.loggedin = $cookies.get('loggedIn') || false;
        $scope.admin = $cookies.get('admin') || false;
        console.log($scope.loggedin);
        if(toState.name === 'home') $scope.getUserData();
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
    $scope.getUserData();
}
function databaseController($scope,$http){
    $scope.saveDatabase = function(){
        var files = document.getElementById('selectFiles').files;
        console.log(files);
        if (files.length <= 0) {
            return false;
        }

        var fr = new FileReader();

        fr.onload = function(e) {
            console.log(e);
            var result = JSON.parse(e.target.result);
            for(var i = 0; i < result.challenges.length; i++){
                if(!result.challenges[i].link)
                    result.challenges[i].link = result.challenges[i].title.trim().replace(/[^a-zA-Z0-9_]/gi,'');
            }
            $http({
                url : "/api/database",
                method : "POST",
                data : result
            }).then(function(response){
                $scope.insertStatus = response.data;
            });
            console.log(result);
        };

        fr.readAsText(files.item(0));
    };
    $scope.getDatabase = function(){
        $http({
            url : "/api/database",
            method : "GET"
        }).then(function(response){
            var text = JSON.stringify(response.data);
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', 'ectf_backup.json');
            element.setAttribute('target','_blank');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

        });
    };
    $scope.clearDatabase = function(){
        $http({
            url : "api/reset",
            method : "DELETE"
        }).then(function(response){
            $scope.deleteStatus = response.data;
        })
    }
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
    .controller('challengesController',challengesController)
    .controller('databaseController',databaseController);