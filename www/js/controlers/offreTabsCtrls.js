/**
 * Created by Tamer on 15/10/2015.
 */

'use strict';
starter

	.controller('offreTabsCtrl', function ($scope,$rootScope,DataProvider,Global,$state){

    $scope.formData={};

    $scope.formData.maitriseIcon = "img/tree1_small.png";
    $scope.formData.maitrise = "Débutant";
    $scope.formData.maitriseStyle = "display: inline;max-width: 33px;max-height: 50px;";

    $scope.formData.maitriseLangueIcon = "img/tree1_small.png";
    $scope.formData.maitriseLangue = "Débutant";
    $scope.formData.maitriseLangueStyle = "display: inline;max-width: 33px;max-height: 50px;";

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

      $scope.formData={
        'maitrise': 'Débutant',
        'maitriseIcon': 'tree1_small.png',
        'maitriseLangue': 'Débutant',
        'maitriseLangueIcon': 'tree1_small.png',
        'metiers': DataProvider.getMetiers(),
        'langues': DataProvider.getLangues(),
        'jobs': DataProvider.getJobs(),
        'transvers': DataProvider.getTransvers(),
        heures:[],
        jours:DataProvider.getDays(),
        qiList:[],
        languesList:[]
      };
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
        $scope.formData.qiList.pop();

      }else{
        Global.showAlertValidation("La liste est vide.");
      }
    };

    $scope.ajouterLangue= function(){
      var langue;
      if($scope.formData.langue!="Langue")
        langue=JSON.parse($scope.formData.langue);
      if(langue!=undefined) {
        var langueList=$scope.formData.languesList;
        for(var i= 0; i<langueList.length; i++) {
          if (langueList[i].pk_user_langue== langue.pk_user_langue) {
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
      var langueList=$scope.formData.languesList;
      if(langueList.length!=0) {
        $scope.formData.languesList.pop();

      }else{
        Global.showAlertValidation("La liste est vide.");
      }
    };

    $scope.validerOffre=function(){
      var offre={};
      offre.titre=$scope.formData.titre;
      $rootScope.offres.push(offre);
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


    /* for disponibility  */
    $scope.formData.jours=DataProvider.getDays();
    console.log($scope.formData.jours.length);
    $scope.saveDisponibilite= function(){

      var jobeyerCourant=$rootScope.jobyers[Number($rootScope.jobyerCurrent.indice)-1];

      var dateDebut=new Date($scope.formData.dateDebut);
      var dayDebut = dateDebut.getDate();
      var monthIndexDebut = dateDebut.getMonth()+1;
      var yearDebut = dateDebut.getFullYear();
      var dateDebutFormatted=yearDebut+"-"+monthIndexDebut+"-"+dayDebut+" 00:00:00.0";

      var dateFin=new Date($scope.formData.dateFin);
      var dayFin = dateFin.getDate();
      var monthIndexFin = dateFin.getMonth()+1;
      var yearFin = dateFin.getFullYear();
      var dateFinFormatted=yearFin+"-"+monthIndexFin+"-"+dayFin+" 00:00:00.0";

      var jours=$scope.formData.jours;
      var joursCheked=[];
      for(var j=0;j<7;j++){
        console.log(jours[j]);
        if(jours[j]['checked']==true)
          joursCheked.push(jours[j]);
      }

      jobeyerCourant['dateDebut']=dateDebutFormatted;
      jobeyerCourant['dateFin']=dateFinFormatted;
      jobeyerCourant['jamais']=$scope.formData.jamais;
      jobeyerCourant['jours']=joursCheked;
      jobeyerCourant['remuneration']=$scope.formData.remuneration;
      jobeyerCourant['heures']=$scope.formData.heures;

      console.log(JSON.stringify($scope.formData));
      $scope.modal.hide();
    };

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

    $scope.addDispo = function(){
      $ionicModal.fromTemplateUrl('templates/disponibiliteCompetenceModal.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.initDateFin= function(){
      if ($scope.formData.jamais)
        $scope.formData.dateFin=null;
    };
  });
