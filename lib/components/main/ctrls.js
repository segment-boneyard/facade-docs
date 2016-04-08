'use strict';

angular
	.module('facade')
	.controller('facadeController', ['$http', '$state', '$timeout', 'data', 'contents', 'coordinates', function($http, $state, $timeout, data, contents, coordinates){
		var vm = this;
		var prevCategoryId;
		var prevSectionId;
		vm.data = data;
		vm.contents = contents.list;
		vm.goto = goto;
		initialize();

		function initialize (){
			toggleCollapse(coordinates.categoryId);
			accentuate(coordinates.categoryId, coordinates.sectionId);
		}

		function goto (categoryId, sectionId){
			if (categoryId != undefined) {
				categoryId = categoryId.toString(); // so 0 doesn't become falsy
			}
			if (sectionId != undefined) {
				sectionId = sectionId.toString();
			} else if (categoryId == 0) {
				navigateTo('intro');
			} else {
				toggleCollapse(categoryId);
			}
			accentuate(categoryId, sectionId);
			var block = vm.contents[categoryId];
			if (block.sections[sectionId]) navigateTo(block.category, clean(block.sections[sectionId].name));
		}

		// flags a link as active and unflags all other links
		function accentuate (categoryId, sectionId){
			// TODO: consolidate these if statements
			if (categoryId && sectionId) {
				removeFlag();
				addFlag();
			} else if (categoryId == prevCategoryId && sectionId != undefined && sectionId != prevSectionId) {
				removeFlag();
				addFlag(); 
			} else if (prevCategoryId == 0 && sectionId == undefined) {
				removeFlag();
			}

			update();

			function removeFlag (){
				if (prevCategoryId == 0) vm.contents[0].active = false;
				if (prevCategoryId && prevSectionId) {
					var oldLink = vm.contents[prevCategoryId].sections[prevSectionId];
					oldLink.active = !oldLink.active;
				}
			}

			function addFlag (){
				var link = vm.contents[categoryId].sections[sectionId];
				link.active = !link.active;
			}

			function update (){
				prevCategoryId = categoryId;
				prevSectionId = sectionId;
			}
		}

		// changes states
		function navigateTo (category, section){
			return $state.go('index', { category: category, section: section }, { reload: true });
		}

		// collapse function
		function toggleCollapse (categoryId){
			vm.contents[categoryId].active = !vm.contents[categoryId].active;
		}
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