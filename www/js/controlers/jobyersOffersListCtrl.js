
'use strict';

starter.controller('jobyersOffersListCtrl', 
	['$scope', 'localStorageService', 
	function($scope, localStorageService) {

		$scope.jobyerListSetting = localStorageService.get('jobyerListSetting');
		if(!$scope.jobyerListSetting){
			$scope.jobyerListSetting = {
				orderByAvialability : false,
				orderByCorrespondence : false,
				job : 50,
				qi : 25,
				language : 25,
				transportationmode : 'driving'
			};
			localStorageService.set('jobyerListSetting', $scope.jobyerListSetting);
		};

		var capitalize = function(st) {
			return st.charAt(0).toUpperCase() + st.slice(1);
		};

		$scope.OfferLabel = capitalize(localStorageService.get('lastSearchedJob'));

		//*/

		$scope.jobyersOffers = [{
			jobyerName : 'Jérôme',
			availability : {
				value : 10,
				text : '3h 30min'
			},
			matching : 60
		},
		{
			jobyerName : 'Alain',
			availability : {
				value : 20,
				text : '8h 30min'
			},
			matching : 20
		},
		{
			jobyerName : 'Philippe',
			availability : {
				value : 15,
				text : '7h 30min'
			},
			matching : 10
		}];
		//*/
		/*
		$scope.jobyersOffers = localStorageService.get('jobyersOffers');
		//*/

		if($scope.jobyerListSetting.orderByCorrespondence) $scope.SortOrder = '+matching';
		if($scope.jobyerListSetting.orderByAvialability) $scope.SortOrder = '+availability.value';

		var setDefaultJobyerListSetting = function(property, newValue){
			var jobyerListSetting = localStorageService.get('jobyerListSetting');
			jobyerListSetting[property] = newValue;
			localStorageService.set('jobyerListSetting', jobyerListSetting);
		};

		$scope.$watch('jobyerListSetting.orderByAvialability', function (newValue, oldValue) {
			setDefaultJobyerListSetting('orderByAvialability', newValue);
		});

		$scope.$watch('jobyerListSetting.orderByCorrespondence', function (newValue, oldValue) {
			setDefaultJobyerListSetting('orderByCorrespondence', newValue);
		});

}]);