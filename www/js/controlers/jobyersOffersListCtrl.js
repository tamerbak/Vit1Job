
'use strict';

starter.controller('jobyersOffersListCtrl', ['$scope', 'localStorageService', function($scope, localStorageService) {
	
	//*/
	$scope.jobyersOffers = [{
		jobyerName : 'Jérôme Fradon',
		availability : {
			value : 10,
			text : '3h 30min'
		},
		matching : 60
	},
	{
		jobyerName : 'Jérôme Fradon',
		availability : {
			value : 10,
			text : '3h 30min'
		},
		matching : 60
	},
	{
		jobyerName : 'Jérôme Fradon',
		availability : {
			value : 10,
			text : '3h 30min'
		},
		matching : 60
	}];
	//*/
	/*
	$scope.jobyersOffers = localStorageService.get('jobyersOffers');
	//*/

	$scope.SortOrder = '+availability.value';

}]);