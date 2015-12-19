
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

		/*var getEntreprises = function(){
			var entreprises = localStorageService.get('currentEmployerEntreprises');
			var result = [];
			if(entreprises && entreprises.length > 0){
				for(var i = 0; i < entreprises.length; i++){
					result.push({'id':entreprises[i].id,'entreprise':entreprises[i].entreprise})
				}
			}
			return result;
		};*/

		var init = function(){
			var jobyerListSetting = localStorageService.get('jobyerListSetting');
			if(!jobyerListSetting){
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

			$scope.jobyerListSetting = jobyerListSetting;

			var currentEntreprise = localStorageService.get('currentEntreprise');
			var selectedEntrepriseId = currentEntreprise ? currentEntreprise.id : 0;
			$scope.selectedEntrepriseId = selectedEntrepriseId;
			$scope.entreprises = localStorageService.get('currentEmployerEntreprises');

			var currentOffer = localStorageService.get('currentOffer')
			$scope.selectedOfferId = (currentOffer) ? currentOffer.id : 0;
			$scope.offers = (selectedEntrepriseId && selectedEntrepriseId != 0) ? getOffersByEntrepriseId(selectedEntrepriseId) : [];
		};

		$scope.loadOffers = function(){
			$scope.offers = ($scope.selectedEntrepriseId) ? getOffersByEntrepriseId($scope.selectedEntrepriseId) : [];
		};

		$scope.$on('$ionicView.beforeEnter', function(){
			init();
		});

		var setJobyerListSetting = function(property, newValue){
			if(!newValue) return;
			var jobyerListSetting = localStorageService.get('jobyerListSetting');
			jobyerListSetting[property] = newValue;
			localStorageService.set('jobyerListSetting', jobyerListSetting);
		};

		$scope.$watch('jobyerListSetting.job', function (newValue, oldValue) {
			setJobyerListSetting('job', newValue);
		});

		$scope.$watch('jobyerListSetting.qi', function (newValue, oldValue) {
			setJobyerListSetting('qi', newValue);
		});

		$scope.$watch('jobyerListSetting.language', function (newValue, oldValue) {
			setJobyerListSetting('language', newValue);
		});

		$scope.$watch('jobyerListSetting.transportationmode', function (newValue, oldValue) {
			setJobyerListSetting('transportationmode', newValue);
		});

	}]);