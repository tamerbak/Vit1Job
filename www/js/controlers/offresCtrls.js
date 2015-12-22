/**
 * Created by Tamer on 15/10/2015.
 */

'use strict';
starter

	.controller('offresCtrl', function ($scope,$rootScope,Global,$state,$filter){
		// FORMULAIRE

    //
		$scope.initAll = function(){

			// GET LIST
      $scope.formData={'offresPublies':[],'offresNonPublies':[]};
      $scope.formData.offre={};
      console.log("roooot");
      if($rootScope.offres==undefined)
        $rootScope.offres=[{pk:1,"titre":"Serveur",selected:false,remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}], etat:"publie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]},
          {pk:2,titre:"java",selected:false,remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}],etat:"publie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]},
          {pk:3,titre:"Chef cuisinier",remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}],etat:"noPublie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]},
          {pk:4,titre:"Serveur debutant",remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}],etat:"noPublie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]},
          {pk:5,titre:"Caissier",remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}],etat:"noPublie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"},{"pk_user_competence_transverse":"44","libelle":"Souriant"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]}];
      var offres=$rootScope.offres;
      for(var i=0; i<offres.length;i++){
        if(offres[i].etat=="publie")
        $scope.formData.offresPublies.push(offres[i]);
        else
          $scope.formData.offresNonPublies.push(offres[i]);
      }

    };

    $scope.offreChange=function(item){
      console.log(item);
      if(item.selected)
        item.selected=false;
      else
        item.selected=true;
      console.log(item.selected);
    };

    $scope.modifierOffre=function(){
      var offre=$scope.formData.offre;
      console.log($scope.formData.offre);
      if(offre.pk){
        $state.go('offreTabs.job',{"offre":JSON.stringify(offre)});
      }else{
        Global.showAlertValidation("Veuillez séléctionner une offre.");
      }
    };

    $scope.dupliquerOffre=function(){
      var offre=$scope.formData.offre;
      if(offre.pk){
        var offre1={};
        offre1.degre=offre.degre;
        if(offre.jours)
          offre1.jours=offre.jours;
        offre1.etat=offre.etat;
        if(offre.titre)
          offre1.titre=offre.titre;
        if(offre.metier)
          offre1.metier=offre.metier;
        if(offre.job)
          offre1.job=offre.job;
        if(offre.qiList)
          offre1.qiList=offre.qiList;
        if(offre.languesList)
          offre1.languesList=offre.languesList;
        if(offre.remuneration)
          offre1.remuneration=offre.remuneration;
        if(offre.heures)
          offre1.heures=offre.heures;
        if(offre.dateDebut)
          offre1.dateDebut=offre.dateDebut;
        if(offre.dateFin)
          offre1.dateFin=offre.dateFin;
        offre1.titre=offre.titre+" (copie)";
        offre1.pk=$rootScope.offres.length+2;
        $rootScope.offres.push(offre1);
      }else{
        Global.showAlertValidation("Veuillez séléctionner une offre.");
      }
    };
    $scope.compteCree= function(){
      Global.showAlertValidation("Bienvenue dans VitOnJob.<br>Vous venez de créer votre compte.<br>Vous pouvez lancer la recherche de jobyers selon vos critères.");
      $state.go('app');
    };
    $scope.supprimerOffre= function(){
      var offre=$scope.formData.offre;
      if(offre.pk){
        var offres=$rootScope.offres;
        var indexOffres=offres.indexOf(offre);
        $rootScope.offres.splice(indexOffres, 1);
        if(offre.etat=="publie")
          $scope.formData.offresPublies.splice($scope.formData.offresPublies.indexOf(offre), 1);
        else
          $scope.formData.offresNonPublies.splice($scope.formData.offresNonPublies.indexOf(offre), 1);
        $scope.formData.offre={selected:false};
      }else{
        Global.showAlertValidation("Veuillez séléctionner une offre.");
      }
    };
		$scope.$on("$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "competence" ){
				console.log("Initialisation : beforeEnter(competence)");
				$scope.formData['currentFeuille']=1;
				$scope.formData['allFeuilles']=1;
			}
		});
  });
