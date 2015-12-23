/**
 * Created by mourad sadiq on 12/6/2015.
 */
'use strict';

starter.controller('contractCtrl',function($scope,localStorageService,$stateParams,DataProvider,$ionicPopup,$state){
  var employeur = localStorageService.get('employeur');
  var jobyer = localStorageService.get('selectedJobyer');
  var civilites = DataProvider.getCivilites();
  var civilite = "";
  for (var i in civilites)
  {
    if(civilites[i].pk_user_civilite == employeur.civilite)
      civilite = civilites[i].libelle;
  }
  $scope.societe = employeur.entreprise;
  $scope.contact = civilite + " " + employeur.nom + " " + employeur.prenom;
  var adrTrv = employeur.adresseTravail;
  $scope.lieu = adrTrv.adresse1 + " " + adrTrv.adresse2 + " " + adrTrv.codePostal + " " + adrTrv.ville;
  var jobyer = $stateParams.jobyer;
  $scope.firstNameJ = jobyer.name;
  $scope.lastNameJ = jobyer.name;

  // An alert dialog
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Succès',
      template: 'Vous avez bien établi un contrat avec '+jobyer.name
    });
    alertPopup.then(function() {
      $state.go("app");
    });
  };

});
