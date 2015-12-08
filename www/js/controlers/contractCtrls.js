/**
 * Created by mourad sadiq on 12/6/2015.
 */
'use strict';

starter.controller('contractCtrl',function($scope,$cookieStore,$stateParams,DataProvider){
  var employeur = $cookieStore.get('employeur');
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
  //$scope.cityJ = jobyer.city;
  $scope.firstNameJ = jobyer.name;
  $scope.lastNameJ = jobyer.name;
});
