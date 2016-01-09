/**
 * Created by mourad sadiq on 12/6/2015.
 */
'use strict';

starter.controller('contractCtrl',function($scope,localStorageService,$stateParams,DataProvider,$ionicPopup,$state, $cordovaPrinter){
  var employeur = localStorageService.get('employeur');
  var jobyer = localStorageService.get('Selectedjobyer');
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
  //var jobyer = $stateParams.jobyer;
  $scope.firstNameJ = jobyer.jobyerName;
  $scope.lastNameJ = jobyer.jobyerName;

  // An alert dialog
  $scope.showAlert = function() {
    //printing the pdf
    
      console.log('deviceready ', $cordovaPrinter.isAvailable());
    if($cordovaPrinter.isAvailable()) {
      var contract = document.getElementById('printableContent');
      console.log(contract);
      $cordovaPrinter.print(contract);
    } else {
      /*var alertPopup = $ionicPopup.alert({
      title: 'Succès',
      template: 'Vous avez bien établi un contrat avec '+jobyer.jobyerName
    });*/
      console.log("Pour imprimer votre contrat, ou le sauvegarder comme PDF, veuillez configurer les paramètres d'impression de votre telephone");
    }

    
    var alertPopup = $ionicPopup.alert({
      title: 'Succès',
      template: 'Vous avez bien établi un contrat avec '+jobyer.jobyerName
    });
    alertPopup.then(function() {

      
      $state.go("app");
    });
  };

});
