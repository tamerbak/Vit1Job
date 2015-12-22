
services.factory('employerService', ['$http', function($http) {

	var prefixRequest = 'http://localhost:8080/VitOnJob/rest/';

	var isEntrepriseOfferByJobExistsRequest = function(employerId, job){
		var request = prefixRequest & 'entrepriseOffer/checkIfEntrepriseAOffrePourJob?idEmployeur=' + 
		employerId + '&libelleJob=' + job;
		return request;
	};

	var factory = {

		isEntrepriseOfferByJobExists : function(employerId, job){
			return $http.get(isEntrepriseOfferByJobExistsRequest(employerId, job));
		}

	};

	return factory;

}]);