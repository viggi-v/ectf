angular.module('mainApp', ['ui.router','ngCookies','ngSanitize'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'partials/home.html',
                controller: 'homeController',
                data : {
                    requireLogin : false
                }
            })
            .state('home.admin',{
                url : 'admin',
                templateUrl : 'partials/addchallenge.html',
                controller : 'adminController'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'loginController',
                data : {
                    requireLogin : false
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'partials/signup.html',
                controller: 'signupController',
                data : {
                    requireLogin : false
                }
            })
            .state('challenges',{
                url : '/challenges',
                templateUrl : 'partials/challenges.html',
                controller : 'challengesController',
                data : {
                    requireLogin : true
                }
            })
            .state('challenges.challenge',{
                url : '/:title',
                templateUrl : 'partials/challenge.html',
                controller : 'challengeController',
                data : {
                    requireLogin : true
                }
            })
            .state('leaderboard',{
                url : '/leaderboard',
                templateUrl : 'partials/leaderboard.html',
                controller : 'leaderBoardController',
                data : {
                    requireLogin : false
                }
            })
            .state('logout',{
                url : "/logout",
                template : "<h2>Logging you out...</h2>",
                controller : 'logoutController',
                data : {
                    requireLogin : true
                }
            });
    })
    .run(["$rootScope","$state","$cookies",function($rootScope, $state,$cookies){
        // the angular based redirector
        $rootScope.$on("$stateChangeStart",function(event,toState){
            $rootScope.authStatus = $cookies.get('loggedIn');
            if(!toState.data.debounce && toState.data.requireLogin && !$rootScope.authStatus){
                // redirect
                toState.data.debounce = true;
                event.preventDefault();
                $state.go('login');
            }
            else if(!toState.data.debounce && !toState.data.requireLogin && $rootScope.authStatus){
                event.preventDefault();
                toState.data.debounce = true;
                $state.go('home');
            }
        });
        $rootScope.$on("$stateChangeSuccess",function(ev,state){
            $state.current.data.debounce = false;
        });
    }]);
