
'use strict';

starter.controller('jobyersOffersOptionsCtrl', 
	['$scope', 'localStorageService', 
	function($scope, localStorageService) {

		var setDefaultJobyerListSetting = function(){
			var defaultJobyerListSetting = {
				orderByAvialability : false,
				orderByCorrespondence : false,
				job : 50,
				qi : 25,
				language : 25,
				transportationmode : 'driving'
			};
			localStorageService.set('jobyerListSetting', defaultJobyerListSetting);
		};

		var jobyerListSetting = localStorageService.get('jobyerListSetting');
		if(!jobyerListSetting){
			setDefaultJobyerListSetting();
		};

		$scope.jobyerListSetting = jobyerListSetting;

		var setDefaultJobyerListSetting = function(property, newValue){
			if(!newValue) return;
			var jobyerListSetting = localStorageService.get('jobyerListSetting');
			jobyerListSetting[property] = newValue;
			localStorageService.set('jobyerListSetting', jobyerListSetting);
		};

		$scope.$watch('jobyerListSetting.job', function (newValue, oldValue) {
			setDefaultJobyerListSetting('job', newValue);
		});

		$scope.$watch('jobyerListSetting.qi', function (newValue, oldValue) {
			setDefaultJobyerListSetting('qi', newValue);
		});

		$scope.$watch('jobyerListSetting.language', function (newValue, oldValue) {
			setDefaultJobyerListSetting('language', newValue);
		});

		$scope.$watch('jobyerListSetting.transportationmode', function (newValue, oldValue) {
			setDefaultJobyerListSetting('transportationmode', newValue);
		});

	}]);