/**
 * Created by Tamer on 09/10/2015.
 */
 'use strict';

 starter

 .controller('homeCtrl', function ($scope, $rootScope, $http, $state, x2js, $ionicPopup, localStorageService, 
  $timeout, $cookies, jobyerService, employerService) {

  /************** Pour les tests********************
  var currentEmployer = {
    "email":"rachid@test.com",
    "employerId":1,
    "entreprises":[
    {"entrepriseId":1,
    "name":"entreprise1",
    "offers":[
    {"offerId":1,
    "title":"offer1",
    "pricticesJob":[
    {"pricticeJobId":1,
    "job":"serveur",
    "level":"Bien"}],
    "pricticesLanguage":[
    {"pricticeLanguageId":1,
    "language":"Français",
    "level":"Bien"}]},
    {"offerId":2,
    "title":"offer2",
    "pricticesJob":[
    {"pricticeJobId":3,
    "job":"java",
    "level":"Excellent"},
    {"pricticeJobId":2,
    "job":"serveur",
    "level":"Excellent"}],
    "pricticesLanguage":[
    {"pricticeLanguageId":2,
    "language":"Anglais",
    "level":"Bien"}]
  }]
}]
};

localStorageService.set('currentEmployer', currentEmployer);

  *************************************************/

  var checkIsLogged = function(){
    var currentEmployer = localStorageService.get('currentEmployer');
    var isLogged = (currentEmployer) ? true : false;
    return isLogged;
  };

  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.isLogged = checkIsLogged();
  });

  $scope.logOut = function(){
    localStorageService.remove('currentEmployer');
    $scope.isLogged = false;
  };

  var showAddOfferConfirmPopup = function(job) {
   var confirmPopup = $ionicPopup.confirm({
     cancelText: 'Continuer',
     title: 'VitOnJob',
     template: 'Pour que la recherche soit plus précise, voulez vous créer une offre pour ' + job + '?'
   });
   confirmPopup.then(function(res) {
     if(res) {
         // redirection vers la page d'ajout des offres employeur
         $state.go("offres");
       } else {
         getJobyersOffersByJob(job);
       }
     });
 };

 var onGetJobyersOffersByJobSuccess = function(data){
  var jobyersOffers = data;
  localStorageService.set('jobyersOffers',jobyersOffers);
  var jobyerListSetting = localStorageService.get('jobyerListSetting');
  jobyerListSetting.orderByAvialability = true;
  jobyerListSetting.orderByCorrespondence = false;
  localStorageService.set('jobyerListSetting', jobyerListSetting);
  $state.go("jobyersOffersTab.list");
};

var onError = function(data){
  console.log(data);
};

var getByLibelleJobAndAvailability = function(libelleJob, idEntreprise, idModeTransport){
  jobyerService.getByLibelleJobAndAvailability(libelleJob, idEntreprise, idModeTransport).success(onGetJobyersOffersByJobSuccess).error(onError);
};

var getJobyersOffersByJob = function(libelleJob){

  var idModeTransport = jobyerService.getIdModeTransport();

  var isLogged = checkIsLogged();
  if(isLogged){
    var currentEntreprise = localStorageService.get('currentEntreprise');
    var idEntreprise;
    if(currentEntreprise){
      idEntreprise = currentEntreprise.entrepriseId;
      getByLibelleJobAndAvailability(libelleJob, idEntreprise, idModeTransport);
    }
    else
    {
      var firstEntrepriseOfCurrentEmployer = employerService.getFirstEntrepriseOfCurrentEmployer();
      if(firstEntrepriseOfCurrentEmployer){
        idEntreprise = firstEntrepriseOfCurrentEmployer.entrepriseId;
        getByLibelleJobAndAvailability(libelleJob, idEntreprise, idModeTransport);
      }
      else
      {
          // L'employeur connecté n'a aucune entreprise
          // Autre traitement
        }
      }
    }
    else
    {
      // L'employeur n'est pas connecté
      // Autre traitement
    }

  };

  var onIsEntrepriseOfferByJobExistsSuccess = function(jobLabel){
    return function(data){
      if(data){
        var offerId = data;
        employerService.setCurrentOffer(offerId);
        getJobyersOffersByJob(jobLabel);
      }
      else
      {
        showAddOfferConfirmPopup(jobLabel);
      }
    };
  };

  $scope.launchSearchForJobyersOffers = function(jobLabel){
    localStorageService.set('lastSearchedJob',jobLabel);
    localStorageService.remove('currentOffer');
    localStorageService.remove('currentEntreprise');
    localStorageService.remove('currentEmployerEntreprises');
    var isLogged = checkIsLogged();
    if(isLogged){
      var currentEmployer = localStorageService.get('currentEmployer');
      var employerId = currentEmployer.employerId;
      employerService.isEntrepriseOfferByJobExists(employerId, jobLabel).success(onIsEntrepriseOfferByJobExistsSuccess(jobLabel)).error(onError);;
    }
    else{
      getJobyersOffersByJob(jobLabel);
    }
  };

});
