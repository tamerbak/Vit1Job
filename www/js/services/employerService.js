
services.factory('employerService', ['$http', function($http) {

	var isEntrepriseOfferByJobExistsRequest = function(employerId, job){
		return {
			method : 'POST',
			url : '',
			headers : {
				'Content-Type' : 'text/plain'
			},
			data : ''
		};
	};

	var factory = {

		isEntrepriseOfferByJobExists : function(employerId, job){
			return $http(isEntrepriseOfferByJobExistsRequest(employerId, job));
		}

	};

	return factory;

}]);