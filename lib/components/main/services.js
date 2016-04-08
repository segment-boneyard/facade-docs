'use strict';

angular
	.module('facade')
	.factory('dbService', ['dbFactory', '$q', function(dbFactory, $q){
		function get (filename, section){
			var request = $q.defer();
			// TODO: cache res
			dbFactory.fetch(filename.toLowerCase()).then(function(res){
				var ret = {};

				if (filename == 'table-of-contents') {
					ret.list = res.data.list;
					for (var x = 0; x < res.data.list.length; x++) {
						var sections = res.data.list[x].sections.map(function(name){
							return { name: name, active: false };
						});
						ret.list[x].sections = sections;
					}
				} else if (filename == 'intro') {
					ret = res.data;
				}

				if (section) {
					ret = res.data[section];
					ret.sample = res.data.sample;
					request.resolve(ret);
				} else {
					request.resolve(ret);
				}
			}, function(err){
				console.log('Failed to fetch JSON file');
				request.reject(err);
			});

			return request.promise;
		}

		return {
			get: get,
		};
	}]);

/**
 * Check if object is empty
 *
 * @param {[type]} obj
 *
 * @return {Boolean}
 */

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
	}
  return true && JSON.stringify(obj) === JSON.stringify({});
}