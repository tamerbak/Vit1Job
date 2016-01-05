
services.factory('employerService', ['$http', 'localStorageService', function($http, localStorageService) {

	var prefixRequest = 'http://ns389914.ovh.net:8080/VitOnJob/rest/';
	var header = {
		headers : {
			'Authorization' : 'QmFzaWMgcmFjaGlkQHRlc3QuY29tOjEyMzQ1Ng=='
		}
	};

	var factory = {

		isEntrepriseOfferByJobExists : function(employerId, libelleJob){
			var requset = prefixRequest + "public/entrepriseOffer/getEntrepriseAOfferIdByJobAndEmployeur?idEmployeur="
			+ employerId + "&libelleJob=" + libelleJob;
			return $http.get(requset, header);
		},

		getFirstEntrepriseOfCurrentEmployer : function(){
			var currentEmployer = localStorageService.get('currentEmployer');
			if(currentEmployer){
				var entreprises = currentEmployer.entreprises;
				if(entreprises && entreprises.length > 0){
					return entreprises[0];
				}
			}
			return null;
		},

		loadCurrentEmployerEntreprises : function(){
			var currentEmployer = localStorageService.get('currentEmployer');
			if(!currentEmployer) return;
			var currentEmployerEntreprises = currentEmployer.entreprises;
			if(currentEmployerEntreprises && currentEmployerEntreprises.length > 0){
				var entreprises = [];
				var entreprise;
				var offers = [];
				var offer;
				for(var i = 0; i < currentEmployerEntreprises.length; i++){
					offers = [];
					if(currentEmployerEntreprises[i] && currentEmployerEntreprises[i].offers && currentEmployerEntreprises[i].offers.length > 0){
						for(var j = 0; j < currentEmployerEntreprises[i].offers.length; j++){
							offer = {
								'id' : currentEmployerEntreprises[i].offers[j].offerId.toString(),
								'label' : currentEmployerEntreprises[i].offers[j].title
							};
							offers.push(offer);
						}
					}
					entreprise = {
						'id' : currentEmployerEntreprises[i].entrepriseId.toString(),
						'label' : currentEmployerEntreprises[i].name,
						'offers' : offers
					}
					entreprises.push(entreprise);
				}
				localStorageService.set('currentEmployerEntreprises',entreprises);
			}
		},

		setCurrentOffer : function(offerId){

			var currentEmployer = localStorageService.get('currentEmployer');
			if(!currentEmployer) return;
			var entreprises = currentEmployer.entreprises;
			var found = false;
			if(entreprises && entreprises.length > 0){
				var i = 0;
				var offers = [];
				var j;
				while(!found && i < entreprises.length){
					offers = entreprises[i].offers;
					if(offers && offers.length > 0){
						j = 0;
						while(!found && j < offers.length){
							if(offers[j].offerId == offerId){
								found = true;
								var currentOffer = {
									'id' : offers[j].offerId.toString(),
									'label' : offers[j].title
								};
								localStorageService.set('currentOffer',currentOffer);
								var currentEntreprise = {
									'id' : entreprises[i].entrepriseId.toString(),
									'label' : entreprises[i].name
								};
								localStorageService.set('currentEntreprise',currentEntreprise);
								loadCurrentEmployerEntreprises();
							}
							else
							{
								j++;
							}
						}
					}
					if(!found) i++;
				}

			};
		}

	};

	return factory;

}]);