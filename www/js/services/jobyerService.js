
services.factory('jobyerService', ['$http', function($http) {

	var jobyersOffersByJobRequest = function(job){
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

		getJobyersOffersByJob : function(job){
			return $http(jobyersOffersByJobRequest(job));
		}

	};

	return factory;

}]);