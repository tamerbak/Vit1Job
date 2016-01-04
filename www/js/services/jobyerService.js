
services.factory('jobyerService', ['$http', function($http) {

	var getByLibelleJobRequestPrefix = "http://ns389914.ovh.net:8080/VitOnJob/rest/common/jobyerOffer/";

	//http://localhost:8080/VitOnJob/rest/common/jobyerOffer/getByLibelleJobAndAvailability?libelleJob=job&idEntreprise=1&idModeTransport=1
	//http://localhost:8080/VitOnJob/rest/common/jobyerOffer/getByLibelleJobAndMatching?libelleJob=job&requiredLang={%22requiredId%22:1,%22requiredLevelId%22:1}&requiredLang={%22requiredId%22:2,%22requiredLevelId%22:2}&requiredJob={%22requiredId%22:3,%22requiredLevelId%22:3}&requiredQI=1&requiredQI=2&coefficients={%22coefficientLang%22:30,%22coefficientJob%22:50,%22coefficientQI%22:20}
	//http://localhost:8080/VitOnJob/rest/common/jobyerOffer/getByLibelleJobAndAvailabilityAndMatching?libelleJob=job&idEntreprise=1&idModeTransport=1&requiredLang={%22requiredId%22:1,%22requiredLevelId%22:1}&requiredLang={%22requiredId%22:2,%22requiredLevelId%22:2}&requiredJob={%22requiredId%22:3,%22requiredLevelId%22:3}&requiredQI=1&requiredQI=2&coefficients={%22coefficientLang%22:30,%22coefficientJob%22:50,%22coefficientQI%22:20}

	/*var jobyersOffersByJobRequest = function(job, entrepriseId, transportationMode, orderBy){
		return {
			method : 'POST',
			url : '',
			headers : {
				'Content-Type' : 'text/plain'
			},
			data : ''
		};
	};

	var jobyersOffersByJobRequest2 = function(job, currentPositionLongitude, currentPositionLatitude, transportationMode, orderBy){
		return {
			method : 'POST',
			url : '',
			headers : {
				'Content-Type' : 'text/plain'
			},
			data : ''
		};
	};*/

	var factory = {

		/*getJobyersOffersByJob : function(job, entrepriseId, transportationMode, orderBy){
			return $http(jobyersOffersByJobRequest(job, entrepriseId, transportationMode));
		},

		getJobyersOffersByJob2 : function(job, currentPositionLongitude, currentPositionLatitude, transportationMode, orderBy){
			return $http(jobyersOffersByJobRequest2(job, currentPositionLongitude, currentPositionLatitude, transportationMode));
		},*/

		getByLibelleJobAndAvailability : function(libelleJob, idEntreprise, idModeTransport){
			/*var request = getByLibelleJobRequestPrefix + "getByLibelleJobAndAvailability?libelleJob=" + libelleJob + 
			"&idEntreprise=" + idEntreprise + "&idModeTransport=" + idModeTransport;*/

			var url = 'http://ns389914.ovh.net:8080/VitOnJob/rest/common/jobyerOffer/getByLibelleJobAndAvailability?libelleJob=Acheteur dans l\'agroalimentaire&idEntreprise=1&idModeTransport=4';

			$http.get(url, {headers : {'Authorization' : 'QmFzaWMgcmFjaGlkQHRlc3QuY29tOjEyMzQ1Ng=='}});
		}/*,

		getByLibelleJobAndMatching : function(libelleJob){
			var request = getByLibelleJobRequestPrefix + "getByLibelleJobAndMatching?libelleJob=" + libelleJob + 
			"&requiredLang={%22requiredId%22:1,%22requiredLevelId%22:1}&requiredLang={%22requiredId%22:2,%22requiredLevelId%22:2}&requiredJob={%22requiredId%22:3,%22requiredLevelId%22:3}&requiredQI=1&requiredQI=2&coefficients={%22coefficientLang%22:30,%22coefficientJob%22:50,%22coefficientQI%22:20}"
		}*/

	};

	return factory;

}]);