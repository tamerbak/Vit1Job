/**
 * Created by Tamer on 15/10/2015.
 */

'use strict';
starter

	.controller('offreTabsCtrl', function ($scope,$rootScope,DataProvider,Global,$state,$stateParams, $cordovaDatePicker){

    //$scope.formData={};
    if($stateParams.offre) {
      $scope.offre = JSON.parse($stateParams.offre);
      console.log($stateParams.offre);
    }
    console.log($scope.offre);

    $scope.updateAutoCompleteMetier= function(){
      $scope.formData.metier=JSON.parse($scope.formData.metier);
      var metiers=$scope.formData.metiers;
      // RECHERCHE LIBELLE

      for(var i=0; i<metiers.length; i++){
        if(metiers[i]['pk_user_metier'] === $scope.formData.metier.pk_user_metier){
          $scope.formData.metier.libelle=metiers[i]['libelle'];
          console.log("metiers[i]['libelle']: "+metiers[i]['libelle']);
          break;
        }
      }

      if(typeof $scope.formData.metier === 'undefined')
        $scope.formData.metier={};
      //$scope.formData.metier.originalObject={'pk_user_metier': $scope.formData.metier.pk_user_metier, 'libelle': $scope.formData.metier.libelle};
      console.log("formData.metier : "+$scope.formData.metier);
      document.getElementById('metiers_value').value=$scope.formData.metier['libelle'];
      //$rootScope.$broadcast('update-list-job', {params: {'fk':$scope.formData.metier.pk_user_metier, 'list':'metier'}});

      // VIDER LIST - JOBS
      $scope.formData.jobs=[];
      var jobs=DataProvider.getJobs();
      for(var i=0; i<jobs.length; i++){
        if(jobs[i]['fk_user_metier'] === $scope.formData.metier.pk_user_metier){
          $scope.formData.jobs.push(jobs[i]);
          console.log("teeest");
        }
      }

      // RE-INITIALISE INPUT JOB
      document.getElementById('jobs_value').value='';
      //$scope.formData.job={};
    };
    $scope.updateAutoCompleteJob= function(){
      $scope.formData.job=JSON.parse($scope.formData.job);

      console.log("job : "+$scope.formData.job.pk);
      var jobs=$scope.formData.jobs;
      // RECHERCHE LIBELLE
      for(var i=0; i<jobs.length; i++){
        if(jobs[i]['pk_user_competence'] === $scope.formData.job.pk){
          $scope.formData.job.libelle=jobs[i]['libelle'];
          break;
        }
      }

      if(typeof $scope.formData.job === 'undefined')
        $scope.formData.job={};
      $scope.formData.job.originalObject={'pk_user_competence': $scope.formData.job.pk, 'libelle': $scope.formData.job.libelle};
      console.log("formData.job : "+JSON.stringify($scope.formData.job));
      document.getElementById('jobs_value').value=$scope.formData.job['libelle'];
    };
    $scope.initAll = function(){
      console.log("initAll : "+$scope.offre);
      if($scope.offre){
        console.log('test1');
        $scope.formData={
          'maitrise': 'Débutant',
          'maitriseIcon': 'tree1_small.png',
          'maitriseStyle': "display: inline;max-width: 33px;max-height: 50px;",
          'maitriseLangueIcon': 'tree1_small.png',
          'maitriseLangue': 'Débutant',
          'maitriseLangueStyle': "display: inline;max-width: 33px;max-height: 50px;"
        };
        $scope.formData.metiers=DataProvider.getMetiers();
        $scope.formData.langues=DataProvider.getLangues();
        $scope.formData.jobs=DataProvider.getJobs();
        $scope.formData.transvers=DataProvider.getTransvers();
        $scope.formData.jours=DataProvider.getDays();
        $scope.formData.degre=$scope.offre.degre;
        $scope.rangeChange();
        if($scope.offre.jours){
          for(var i=0;i<$scope.offre.jours.length;i++) {
            for (var j = 0; j < $scope.formData.jours.length; j++) {
              if($scope.formData.jours[j].pk_user_jour_de_la_semaine==$scope.offre.jours[i].pk_user_jour_de_la_semaine)
                $scope.formData.jours[j].checked = true;
            }
          }
        }
        if($scope.offre.titre)
          $scope.formData.titre=$scope.offre.titre;
        if($scope.offre.metier)
          $scope.formData.metier=$scope.offre.metier;
        if($scope.offre.job)
          $scope.formData.job=$scope.offre.job;
        if($scope.offre.qiList)
          $scope.formData.qiList=$scope.offre.qiList;
        if($scope.offre.languesList)
          $scope.formData.languesList=$scope.offre.languesList;
        if($scope.offre.remuneration)
          $scope.formData.remuneration=$scope.offre.remuneration;
        if($scope.offre.heures)
          $scope.formData.heures=$scope.offre.heures;
        if($scope.offre.dateDebut)
          $scope.formData.dateDebut=$scope.offre.dateDebut;
        if($scope.offre.dateFin)
          $scope.formData.dateFin=$scope.offre.dateFin;
      }else
        $scope.formData={
        'maitrise': 'Débutant',
        'maitriseIcon': 'tree1_small.png',
        'maitriseStyle': "display: inline;max-width: 33px;max-height: 50px;",
        'maitriseLangueIcon': 'tree1_small.png',
        'maitriseLangue': 'Débutant',
        'maitriseLangueStyle': "display: inline;max-width: 33px;max-height: 50px;",
          'metiers': DataProvider.getMetiers(),
        'langues': DataProvider.getLangues(),
        'jobs': DataProvider.getJobs(),
        'transvers': DataProvider.getTransvers(),
        'dateFin': "Jamais",
        'heureDebut': 0,
        'heureFin': 0,
        'heureDebutFormat': '00h00',
        'heureFinFormat': '00h00',
        heures:[],
        jours:DataProvider.getDays(),
        qiList:[],
        languesList:[],
        qi:{},
          degre:10,
        selectedLangue:{}
      };
      $scope.formData.jours[0].checked = true;
    };

    $scope.rangeChange = function(){
      var rangeModel=$scope.formData.degre;
      console.log("rangeModel : "+rangeModel);
      if (rangeModel <= 25 ){
        $scope.formData.maitrise = "Débutant";
        $scope.formData.maitriseIcon = "tree1_small.png";
        $scope.formData.maitriseWidth = "33px";
        $scope.formData.maitriseHeight = "50px";
      }

      else if (rangeModel > 25 && rangeModel <= 50 ) {
        $scope.formData.maitrise = 'Habitué';
        $scope.formData.maitriseIcon = "tree2_small.png";
        //$scope.formData.maitriseStyle = "display: inline;max-width: 33px;max-height: 50px;";
      }

      else if (rangeModel > 50 && rangeModel <= 75 ){
        $scope.formData.maitrise = 'Confirmé';
        $scope.formData.maitriseIcon = "tree3_small.png";
        //$scope.formData.maitriseStyle = "display: inline;max-width: 59px;max-height: 77px;";
      }
      else if (rangeModel > 75 && rangeModel <= 100 ){
        $scope.formData.maitrise = 'Waouh!';
        $scope.formData.maitriseIcon = "tree4_small.png";
        //$scope.formData.maitriseStyle = "display: inline;max-width: 60px;max-height: 80px;";
      }
    };

    $scope.rangeLangueChange = function(){
      var rangeModel=$scope.formData.degreLangue;
      console.log("rangeLangueModel : "+rangeModel);
      if (rangeModel <= 25 ){
        $scope.formData.maitriseLangue = "Débutant";
        $scope.formData.maitriseLangueIcon = "tree1_small.png";
        $scope.formData.maitriseLangueWidth = "33px";
        $scope.formData.maitriseLangueHeight = "50px";
      }

      else if (rangeModel > 25 && rangeModel <= 50 ) {
        $scope.formData.maitriseLangue = 'Habitué';
        $scope.formData.maitriseLangueIcon = "tree2_small.png";
        //$scope.formData.maitriseLangueStyle = "display: inline;max-width: 33px;max-height: 50px;";
      }

      else if (rangeModel > 50 && rangeModel <= 75 ){
        $scope.formData.maitriseLangue = 'Confirmé';
        $scope.formData.maitriseLangueIcon = "tree3_small.png";
        //$scope.formData.maitriseLangueStyle = "display: inline;max-width: 59px;max-height: 77px;";
      }
      else if (rangeModel > 75 && rangeModel <= 100 ){
        $scope.formData.maitriseLangue = 'Waouh!';
        $scope.formData.maitriseLangueIcon = "tree4_small.png";
        //$scope.formData.maitriseLangueStyle = "display: inline;max-width: 60px;max-height: 80px;";
      }
    };

    $scope.ajouterQi= function(){
      var qi;
      console.log($scope.formData.indisp);
      if($scope.formData.indisp!="Qualités indispensables")
        qi=JSON.parse($scope.formData.indisp);
      if(qi!=undefined) {
        var qiList=$scope.formData.qiList;
        for(var i= 0; i<qiList.length; i++) {
          if (qiList[i].pk_user_competence_transverse== qi.pk_user_competence_transverse) {
            Global.showAlertValidation("Cette qualité existe déjà dans la liste.");
            return;
          }
        }
        $scope.formData.qiList.push(qi);

      }else{
        Global.showAlertValidation("Veuillez séléctionner une qualité.");
      }
    };

    $scope.supprimerQi= function(){
      var qiList=$scope.formData.qiList;
      if(qiList.length!=0) {
        var qi=$scope.formData.qi;
        if(qi.selected){
          var index=qiList.indexOf(qi);
          $scope.formData.qiList.splice(index, 1);
          $scope.formData.qi={selected:false};
        }else
          Global.showAlertValidation("Veuillez séléctionner une qualité.");
      }else{
        Global.showAlertValidation("La liste est vide.");
      }
    };

    $scope.onChange=function(item){
      console.log(item);
      if(item.selected)
        item.selected=false;
      else
        item.selected=true;
      console.log(item.selected);
    };

    $scope.ajouterLangue= function(){
      var langue;
      if($scope.formData.langue !="Langue")
        langue=JSON.parse($scope.formData.langue);
      if(langue!=undefined) {
        var languesList=$scope.formData.languesList;
        for(var i= 0; i<languesList.length; i++) {
          if (languesList[i].pk_user_langue== langue.pk_user_langue) {
            Global.showAlertValidation("Cette langue existe déjà dans la liste.");
            return;
          }
        }
        $scope.formData.languesList.push(langue);

      }else{
        Global.showAlertValidation("Veuillez séléctionner une langue.");
      }
    };


    $scope.supprimerLangue= function(){
      var languesList=$scope.formData.languesList;
      if(languesList.length!=0) {
        var langue=$scope.formData.selectedLangue;
        if(langue.selected){
          var index=languesList.indexOf(langue);
          $scope.formData.languesList.splice(index, 1);
          $scope.formData.selectedLangue={selected:false};
        }else
          Global.showAlertValidation("Veuillez séléctionner une langue.");
      }else{
        Global.showAlertValidation("La liste est vide.");
      }
    };

    $scope.validerOffre=function(){
      console.log($scope.formData);
      if(!$scope.offre)
        $scope.offre={};
      $scope.offre.degre=$scope.formData.degre;
      /*
      if($scope.offre.jours){
        for(var i=0;i<$scope.offre.jours.length;i++) {
          for (var j = 0; j < $scope.formData.jours.length; j++) {
            if($scope.formData.jours[j].pk_user_jour_de_la_semaine==$scope.offre.jours[i].pk_user_jour_de_la_semaine)
              $scope.formData.jours[j].checked = true;
          }
        }
      }*/
      $scope.offre.titre=$scope.formData.titre;
      $scope.offre.metier=$scope.formData.metier;
      $scope.offre.job=$scope.formData.job;
      $scope.offre.qiList=$scope.formData.qiList;
      $scope.offre.languesList=$scope.formData.languesList;
      $scope.offre.remuneration=$scope.formData.remuneration;
      $scope.offre.heures=$scope.formData.heures;
      $scope.offre.dateDebut=$scope.formData.dateDebut;
      $scope.offre.dateFin=$scope.formData.dateFin;
      var offre=$scope.offre;
      console.log(offre);
      var exist=false;
        for(var i=0; i<$rootScope.offres.length;i++){
          if($rootScope.offres[i].pk==offre.pk) {
            $rootScope.offres[i] = offre;
            exist=true;
            console.log($rootScope.offres[i]);
          }
        }
      if(!exist) {
        offre.etat="publie";
        $rootScope.offres.push(offre);
      }
      $state.go('offres');

    };
    $scope.$on('update-list-job', function(event, args){

      var params = args.params;
      console.log("params : "+JSON.stringify(params));

      // VIDER LIST - JOBS
      $scope.formData.jobs=[];
      var jobs=DataProvider.getJobs();
      for(var i=0; i<jobs.length; i++){
        if(jobs[i]['fk_user_metier'] === params.fk)
          $scope.formData.jobs.push(jobs[i]);
      }
    });

    $scope.ajouterHeures= function(){

      var hdebut=$scope.formData.heureDebut;
      var hfin=$scope.formData.heureFin;
      var mdebut=$scope.formData.minDebut;
      var mfin=$scope.formData.minFin;

      if(hdebut!=undefined && hfin!=undefined && mdebut!=undefined && mfin!=undefined) {
        if(hfin > hdebut)
          $scope.formData.heures.push({"heureDebut": hdebut+"h"+mdebut+"min", "heureFin": hfin+"h"+mfin+"min"});
        else
          Global.showAlertValidation("L'heure de fin doit être supérieur.");
      }else{
        Global.showAlertValidation("Veuillez saisir une heure de début et une heure de fin.");
      }
    };

    $scope.supprimerHeures= function(){

      if( $scope.formData.heures.length!=0){
        $scope.formData.heures.pop();
      }
    };


    var options = {
    date: new Date(),
    mode: 'date', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };

  $scope.dateDebut = function () {

    $cordovaDatePicker.show(options).then(function(date){
        $scope.formData.dateDebut = date;
    });

  };

  $scope.dateFin = function () {

    $cordovaDatePicker.show(options).then(function(date){
        $scope.formData.dateFin = date;
    });

  };

  $scope.heureChange = function (params) {
  if (params === 'debut'){
    $scope.formData.heureDebutFormat = ($scope.formData.heureDebut === "0" ? "00h00" : Math.floor($scope.formData.heureDebut / 60) + "h" + $scope.formData.heureDebut % 60);
  }
  else if(params === 'fin'){
    $scope.formData.heureFinFormat = ($scope.formData.heureFin === "0" ? "00h00" : Math.floor($scope.formData.heureFin / 60) + "h" + $scope.formData.heureFin % 60);
  }

  }


  });
