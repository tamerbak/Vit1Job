
'use strict';

starter.controller('jobyersOffersOptionsCtrl', 
	['$scope', 'localStorageService', 
	function($scope, localStorageService) {

		var getOffersByEntrepriseId = function(entrepriseId){
			var offers = [];
			var entreprises = localStorageService.get('currentEmployerEntreprises');
			if(entreprises && entreprises.length > 0){
				var found = false;
				var i = 0;
				while(!found && i < entreprises.length){
					found = entreprises[i].id == entrepriseId;
					if(!found) i++;
				}
				if(found) offers = entreprises[i].offers;
			}
			return offers;
		};

		var init = function(){

			$scope.jobyerListSetting = localStorageService.get('jobyerListSetting');
			if(!$scope.jobyerListSetting){
				$scope.jobyerListSetting = {
					orderByAvialability : true,
					orderByCorrespondence : false,
					job : 50,
					qi : 25,
					language : 25,
					transportationmode : 'driving'
				};
				localStorageService.set('jobyerListSetting', $scope.jobyerListSetting);
			};

			$scope.entreprises = localStorageService.get('currentEmployerEntreprises');
			$scope.selectedEntreprise = localStorageService.get('currentEntreprise');

			$scope.loadOffers();
			$scope.selectedOffer = localStorageService.get('currentOffer');

		};

		$scope.loadOffers = function(){
			$scope.offers = ($scope.selectedEntreprise) ? getOffersByEntrepriseId($scope.selectedEntreprise.id) : [];
		};

		$scope.$on('$ionicView.beforeEnter', function(){
			init();
		});

		var setJobyerListSetting = function(property, newValue){
			var jobyerListSetting = localStorageService.get('jobyerListSetting');
			jobyerListSetting[property] = newValue;
			localStorageService.set('jobyerListSetting', jobyerListSetting);
			$scope.jobyerListSetting = localStorageService.get('jobyerListSetting');
		};

		$scope.$watch('jobyerListSetting.job', function (newValue, oldValue) {
			if(parseInt(newValue) == parseInt(oldValue)) return;
			setJobyerListSetting('job', parseInt(newValue));
		});

		$scope.$watch('jobyerListSetting.qi', function (newValue, oldValue) {
			if(parseInt(newValue) == parseInt(oldValue)) return;
			setJobyerListSetting('qi', parseInt(newValue));
		});

		$scope.$watch('jobyerListSetting.language', function (newValue, oldValue) {
			if(parseInt(newValue) == parseInt(oldValue)) return;
			setJobyerListSetting('language', parseInt(newValue));
		});

		$scope.$watch('jobyerListSetting.transportationmode', function (newValue, oldValue) {
			setJobyerListSetting('transportationmode', newValue);
		});

	}]);