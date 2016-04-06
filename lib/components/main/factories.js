'use strict';

/* DB factory */

angular
	.module('facade')
	.factory('dbFactory', ['$http', function($http){
		function fetch (file){
			return $http.get('../db/' + file + '.json');;
		}

		return {
			fetch: fetch
		};
	}]);