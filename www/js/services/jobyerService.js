
services.factory('jobyerService', ['$http', 'localStorageService', function($http, localStorageService) {

	var getByLibelleJobRequestPrefix = "http://ns389914.ovh.net:8080/VitOnJob/rest/";
	var header = {
		headers : {
			'Authorization' : 'QmFzaWMgcmFjaGlkQHRlc3QuY29tOjEyMzQ1Ng=='
		}
	};

	var factory = {

		getByLibelleJobAndAvailability : function(libelleJob, idEntreprise, idModeTransport){
			var request = getByLibelleJobRequestPrefix + "common/jobyerOffer/getByLibelleJobAndAvailability?libelleJob=" 
			+ libelleJob + "&idEntreprise=" + idEntreprise + "&idModeTransport=" + idModeTransport;
			return $http.get(request, header);
		},

		getIdModeTransport : function(){
			var jobyerListSetting = localStorageService.get('jobyerListSetting');
			var idModeTransport = 1;
			if(jobyerListSetting){
				var transportationmode = jobyerListSetting.transportationmode;
				switch(transportationmode) {
					case 'driving': idModeTransport = 1; break;
					case 'walking': idModeTransport = 2; break;
					case 'bicycling': idModeTransport = 3; break;
					case 'transit': idModeTransport = 4; break;
					default: idModeTransport = 1;
				}
			}
			return idModeTransport;
		}

	};

	return factory;

}]);