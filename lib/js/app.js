'use strict';

/**
 * Angular App
 *
 * Main module
 */

angular
	.module('app', [
		'ui.router',
		'ngStorage',
		'ngCookies'
	])

	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider){

		// Redirect all invalid routes to 
		$urlRouterProvider.otherwise('/');

		// Define states
		$stateProvider

			.state('sample', {
				url: '/',
				templateUrl: '../components/sample/index.html'
			});
	}])

	.run([function(){
		
		// init app
	}]);
