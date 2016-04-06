'use strict';

angular
	.module('facade')
	.factory('dbService', ['dbFactory', '$q', function(dbFactory, $q){
		var contents = {};

		function get (filename){
			var request = $q.defer();
			var ret = {};

			dbFactory.fetch(filename).then(function(res){
				var data = res.data.list;
				// Attach css flag to each section
				if (filename == 'table-of-contents') {
					for (var x = 0; x < data.length; x++) {
						var sections = data[x].sections.map(function(name){
							return { name: name, active: false };
						});
						data[x].sections = sections;
					}
				}
				contents = res.data;
				request.resolve(contents);
			}, function(err){
				console.log('Failed to fetch JSON file');
				request.reject(err);
			});
			console.log('promise', request.promise);

			return request.promise;
		}

		return {
			get: get,
			contents: contents
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