'use strict';

/**
 * Angular App
 *
 * Main module
 */

angular
	.module('app', [
		'ui.router',
		'facade'
	])

	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider){

		// Pretty URL
	  $locationProvider.html5Mode(true);

		// Redirect all invalid routes to 
		$urlRouterProvider.otherwise('/');

		// Define states
		$stateProvider
			.state('index', {
				url: '/api/:category/:section',
				templateUrl: '../components/main/index.html',
				resolve: {
					contents: function (dbService){
						return dbService.get('table-of-contents');
					},
					data: function ($stateParams, dbService){
						var category = $stateParams.category;
						if ($stateParams.section == '') category = 'intro';
						return dbService.get(category);
					},
					coordinates: function ($stateParams, contents){
						var ret = {
							categoryId: undefined,
							sectionId: undefined
						};
						ret.category = $stateParams.category.toLowerCase() || '';
						ret.section = $stateParams.section.toLowerCase() || '';

						// TODO: OMG CLEAN THIS UP
						if (ret.category) {
							for (var i = 0; i < contents.list.length; i++){
								var block = contents.list[i];
								if (block.category.toLowerCase() == ret.category) {
									ret.categoryId = i.toString();
									if (ret.section) {
										for (var j = 0; j < block.sections.length; j++){
											var sectionName = clean(block.sections[j].name);
											if (sectionName.toLowerCase() == ret.section) {
												ret.sectionId = j.toString();
												break;
											}
										}
									}
									break;
								}
							}
						}
						return ret;
					}
				},
				controller: 'facadeController', 
				controllerAs: 'facade'
			});
	}])

	.run([function(){
		
		// init app

	}]);

/**
 * Clean section name
 *
 * '.proxy()' will return 'proxy'
 * '.properties(aliases)' will return 'properties(aliases)'
*/

function clean (string){
	if (string.slice(-2)[0] != '(') return string.slice(1);
	return string.slice(1, -2);
}
