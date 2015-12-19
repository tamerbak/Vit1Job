
services.factory('jobyerService', ['$http', function($http) {

	var jobyersOffersByJobRequest = function(job, entrepriseId, transportationMode, orderBy){
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
	};

	var factory = {

		getJobyersOffersByJob : function(job, entrepriseId, transportationMode, orderBy){
			return $http(jobyersOffersByJobRequest(job, entrepriseId, transportationMode));
		},

		getJobyersOffersByJob2 : function(job, currentPositionLongitude, currentPositionLatitude, transportationMode, orderBy){
			return $http(jobyersOffersByJobRequest2(job, currentPositionLongitude, currentPositionLatitude, transportationMode));
		}

	};

	return factory;

}]);