
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
        'id' : 103,//99,//72,//42,//32,
        'args' : [{
            'class' : 'fr.protogen.masterdata.model.CCalloutArguments',
            label : 'creation offre',
            value : stringData
          },
          {
            'class' : 'fr.protogen.masterdata.model.CCalloutArguments',
            label : 'type utilisateur',
            value : btoa("employeur")
          }]
		};

		stringData = JSON.stringify(data);

		var request = {
	      method : 'POST',
	      url : 'http://vps259989.ovh.net:8080/vitonjobv1/api/callout',
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
			id : 102,//98,//88,//78,//77,//76,//68,//50, //6,44,45,46,
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
			url : 'http://vps259989.ovh.net:8080/vitonjobv1/api/callout',
			headers : {
				'Content-Type' : 'application/json'
			},
			data : stringData
		};
	};


  var criteriaSearchService = function(data) {
    var query = {
      "class": "com.vitonjob.callouts.recherche.SearchQuery",
      "job": data.job,
      "metier": data.metier,
      "entreprise": "",
      "lieu": data.location,
      "nom": data.nom,
      "date": data.date, //"DD/MM/YYYY",
      "table": "user_offre_jobyer" //user_offre_entreprise
    };

    var queryText = JSON.stringify(query);
    var queryCoded = btoa(queryText);

    var datas = {
      'class': 'fr.protogen.masterdata.model.CCallout',
      id: 120,
      args: [{
        class: 'fr.protogen.masterdata.model.CCalloutArguments',
        label: 'Requete de recherche par criteres',
        value: queryCoded
      }]
    };

    var stringData = JSON.stringify(datas);

    return $http({
      method : 'POST',
      url : 'http://vps259989.ovh.net:8080/vitonjobv1/api/callout',
      headers : {
        'Content-Type' : 'application/json'
      },
      data : stringData
    });

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
		},
    criteriaSearchService : function(data){
      return criteriaSearchService(data);
    }

	};

	return factory;

}]);
