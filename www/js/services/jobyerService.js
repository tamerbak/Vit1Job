
services.factory('jobyerService', ['$http', function($http) {

	var enregistrerOffre = function(id, titre, job, langues, indispensables, disponibilites, remuneration){
		var data = {
			"class" : 'com.vitonjob.Offre',
			"entreprise" : id,
			"titre" : titre,
			"remuneration" : remuneration,
			"job" : job,
			"langues" : langues,
			"indispensables":indispensables,
			"disponibilites":disponibilites
		};

		var stringData = JSON.stringify(data);
		console.log(stringData);
		stringData = btoa(stringData);

		data = {
		'class' : 'fr.protogen.masterdata.model.CCallout',
        'id' : 42,//32,
        'args' : [{
            'class' : 'fr.protogen.masterdata.model.CCalloutArguments',
            label : 'creation offre',
            value : stringData
          }]
		};

		stringData = JSON.stringify(data);

		var request = {
	      method : 'POST',
	      url : 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
	      headers : {
	      'Content-Type' : 'application/json'
	      },
	      data : stringData
	    };

		return $http(request);
	};

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

	var recherche = function(job, idOffer){
		var query = 'user_jobyer;'+job;

		var data = {
			'class' : 'fr.protogen.masterdata.model.CCallout',
			id : 50, //6,44,45,46,
			args : [
				{
					class : 'fr.protogen.masterdata.model.CCalloutArguments',
					label : 'Requete de recherche',
					value : btoa(query)
				},
				{
					class : 'fr.protogen.masterdata.model.CCalloutArguments',
					label : 'ID Offre',
					value : btoa(idOffer)
				},
				{
					class : 'fr.protogen.masterdata.model.CCalloutArguments',
					label : 'Ordre de tri',
					value : 'TkQ='
				}
			]
		};

		var stringData = JSON.stringify(data);
		return {
			method : 'POST',
			url : 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
			headers : {
				'Content-Type' : 'application/json'
			},
			data : stringData
		};
	};

	var factory = {

		getJobyersOffersByJob : function(job, entrepriseId, transportationMode, orderBy){
			return $http(jobyersOffersByJobRequest(job, entrepriseId, transportationMode));
		},

		getJobyersOffersByJob2 : function(job, currentPositionLongitude, currentPositionLatitude, transportationMode, orderBy){
			return $http(jobyersOffersByJobRequest2(job, currentPositionLongitude, currentPositionLatitude, transportationMode));
		},
		recherche : function(job,idOffer){
			return $http(recherche(job, idOffer));
		},
		enregistrerOffre : function(id, titre, job, langues, indispensables, disponibilites, remuneration){
			return enregistrerOffre(id, titre, job, langues, indispensables, disponibilites, remuneration);
		}

	};

	return factory;

}]);
