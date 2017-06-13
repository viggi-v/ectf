angular.module('mainApp', ['ui.router'])
		.config(function($stateProvider, $urlRouterProvider) {
				$urlRouterProvider.otherwise('/home');

				$stateProvider
					.state('home',{
						url : '/home/:id',
						templateUrl : 'partials/home.html',
						controller :'homeController',
					})
					.state('page',{
						url : '/page',
						templateUrl : 'partials/page.html',
						controller :'pageController'

					})
					.state('paper',{
						url : '/paper',
						templateUrl : 'partials/paper.html',
						controller :'paperController'
					})
					.state('login',{
						url: '/login',
						templateUrl : 'partials/login.html',
						controller : 'loginController',
						data : {
							requireLogin : false
						}
					});
		});