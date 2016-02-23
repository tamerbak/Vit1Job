/**
 * Created by Omar on 23/10/2015.
 */

angular.module('providerServices', [])

  .service('DataProvider', function ($rootScope,$http){

	    this.getDays=function(){
	      return [{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"},{"pk_user_jour_de_la_semaine":"41","nom":"Mardi"},{"pk_user_jour_de_la_semaine":"42","nom":"Mercredi"},{"pk_user_jour_de_la_semaine":"43","nom":"Jeudi"},{"pk_user_jour_de_la_semaine":"44","nom":"Vendredi"},{"pk_user_jour_de_la_semaine":"45","nom":"Samedi"},{"pk_user_jour_de_la_semaine":"46","nom":"Diamanche"}];
	    }
		this.getVilles=function(){
			var sql = "select pk_user_ville, nom from user_ville";
			var results = [];

			  $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql}).success(function (data) {
                for(var i = 0 ; i < data.data.length ; i++)
                	results.push({"pk_user_ville":data.data[i]["pk_user_ville"],"libelle":data.data[i]["nom"]});
            });

		    return results;

		}

		this.getZipCodes=function(){
			var sql = "select pk_user_code_postal, code from user_code_postal";
			var results = [];

			  $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql}).success(function (data) {
                for(var i = 0 ; i < data.data.length ; i++)
                	results.push({"pk_user_code_postal":data.data[i]["pk_user_code_postal"],"libelle":data.data[i]["code"]});
            });

		    return results;
		}

		/*************************************** *************************************** ***************************************/

		this.getCivilites=function(){
			return [{"pk_user_civilite":"44","libelle":"Madame"},{"pk_user_civilite":"42","libelle":"Mademoiselle"},{"pk_user_civilite":"40","libelle":"Monsieur"}];
		}

		this.getLangues=function(){
			var sql = "select pk_user_langue, libelle from user_langue";
			var results = [];

			  $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql}).success(function (data) {
                for(var i = 0 ; i < data.data.length ; i++)
                	results.push({"pk_user_langue":data.data[i]["pk_user_langue"],"libelle":data.data[i]["libelle"]});
            });

		    return results;

		}

		this.getTransvers=function(){
			var sql = "select pk_user_indispensable, libelle from user_indispensable";
			var results = [];

			  $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql}).success(function (data) {
                for(var i = 0 ; i < data.data.length ; i++)
                	results.push({"pk_user_competence_transverse":data.data[i]["pk_user_indispensable"],"libelle":data.data[i]["libelle"]});
            });

		    return results;
		}

		this.getNationalites=function(){
			var sql = "select pk_user_pays, nom, code from user_pays";
			var results = [];

			  $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql}).success(function (data) {
                for(var i = 0 ; i < data.data.length ; i++)
                	results.push({"pk_user_nationalite":data.data[i]["pk_user_pays"],"libelle":data.data[i]["nom"], "code":data.data[i]["code"]});
            });

		    return results;
		}

		this.getNiveauxMaitrise=function(){

			var sql = "select pk_user_niveau, libelle from user_niveau";
			var results = [];

			  $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql}).success(function (data) {
                for(var i = 0 ; i < data.data.length ; i++)
                	results.push({"pk_user_niveau_de_maitrise":data.data[i]["pk_user_niveau"],"libelle":data.data[i]["libelle"]});
            });

		    return results;
		}

		/*************************************** *************************************** ***************************************/

		this.getMetiers=function(){
			var sql = "select pk_user_metier, libelle from user_metier";
			var results = [];

			  $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql}).success(function (data) {
                for(var i = 0 ; i < data.data.length ; i++)
                	results.push({"pk_user_metier":data.data[i]["pk_user_metier"],"libelle":data.data[i]["libelle"]});
            });

		    return results;
		};

    this.getMetierByIdJob=function(id){
      var sql = "select pk_user_metier, user_metier.libelle from user_metier, user_job , user_pratique_job " +
        "where fk_user_metier = pk_user_metier and pk_user_job = fk_user_job and pk_user_pratique_job = " + id;
      var results = [];

      return $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql})
        /*.success(function (data) {
        for(var i = 0 ; i < data.data.length ; i++)
          results.push({"pk_user_metier":data.data[i]["pk_user_metier"],"libelle":data.data[i]["libelle"]});
      });

      return results;*/
    };


		this.getJobs=function(){
			var sql = "select pk_user_job, fk_user_metier, libelle from user_job";
			var results = [];

			  $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql}).success(function (data) {
                for(var i = 0 ; i < data.data.length ; i++)
                	results.push({"pk_user_competence":data.data[i]["pk_user_job"],"libelle":data.data[i]["libelle"],"fk_user_metier":data.data[i]["fk_user_metier"]});
            });

		    return results;
		};

		/*************************************** *************************************** ***************************************/

		this.getPays=function(){
			var sql = "select pk_user_pays, nom, code from user_pays";
			var results = [];

			  $http({ method: 'POST', url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql', headers: {   "Content-Type": "text/plain" }, data: sql}).success(function (data) {
                console.log(data.data);
                results = data.data;
            });

		    return results;
		}

		this.image="ABCDEFGHIJKLMNOP";
  })

  .service('UpdateDataProvider', function ($http){
	  // MISE A JOUR DATA FROM BD
  })
