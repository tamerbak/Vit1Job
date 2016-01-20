/**
 * Created by mourad sadiq on 12/6/2015.
 */
'use strict';

starter.controller('contractCtrl',function($scope,localStorageService,$stateParams,DataProvider,$ionicActionSheet,$ionicPopup,$state, $cordovaPrinter){
  var employeur = localStorageService.get('employeur');
  console.log(employeur);
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
  $scope.lieu = adrTrv.fullAddress;
  //var jobyer = $stateParams.jobyer;
  $scope.firstNameJ = jobyer.jobyerName;
  $scope.lastNameJ = jobyer.jobyerName;

  // An alert dialog
  $scope.showAlert = function() {
    //printing the pdf
    if(ionic.Platform.isAndroid() && ionic.Platform.version()<=4.2) {
      var alertPopup1 = $ionicPopup.show({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: "Pour imprimer votre contrat, ou le sauvegarder comme PDF, veuillez configurer les paramètres d'impression de votre telephone",
        buttons : [
          {
            text: '<b>OK</b>',
            type: 'button-dark',
            onTap: function(e) {
            }
          }
        ]
      });
    alertPopup1.then(function() {
      var alertPopup = $ionicPopup.show({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Succés: Vous avez bien établi un contrat avec '+jobyer.jobyerName,
        buttons : [
          {
            text: '<b>OK</b>',
            type: 'button-dark',
            onTap: function(e) {
            }
          }
        ]
      });
    alertPopup.then(function() {
      $state.go("app");
    });
    });
    } else {

      console.log(ionic.Platform.version());
    if($cordovaPrinter.isAvailable()) {
      var contract = document.getElementById('printableContent');
      $cordovaPrinter.print(contract);
      var alertPopup = $ionicPopup.show({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Succés: Vous avez bien établi un contrat avec '+jobyer.jobyerName,
        buttons : [
          {
            text: '<b>OK</b>',
            type: 'button-dark',
            onTap: function(e) {
            }
          }
        ]
      });
    alertPopup.then(function() {
      $state.go("app");
    });
    } else {
      /*var alertPopup = $ionicPopup.alert({
      title: 'Succès',
      template: 'Vous avez bien établi un contrat avec '+jobyer.jobyerName
    });*/
    var alertPopup1 = $ionicPopup.show({
      title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
      template: "Pour imprimer votre contrat, ou le sauvegarder comme PDF, veuillez configurer les paramètres d'impression de votre telephone",
      buttons : [
        {
          text: '<b>OK</b>',
          type: 'button-dark',
          onTap: function(e) {
          }
        }
      ]
    });
    alertPopup1.then(function() {
      var alertPopup = $ionicPopup.show({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Succés: Vous avez bien établi un contrat avec '+jobyer.jobyerName,
        buttons : [
          {
            text: '<b>OK</b>',
            type: 'button-dark',
            onTap: function(e) {
            }
          }
        ]
      });
    alertPopup.then(function() {
      $state.go("app");
    });
    });
    }
  }


  };
  $scope.showMenuForEditContract = function(){
     var steps = localStorageService.get('steps');
    console.log(steps);
     
    var hideSheet = $ionicActionSheet.show({
      buttons: [
      { text: 'Civilité'}, //Index = 0
      { text: 'Siège social'}, //Index = 1
      { text: 'Adresse de travail' }, //Index = 2
      ],
      titleText: 'Editer le contrat',
      cancelText: 'Annuler',
      cssClass:(ionic.Platform.isAndroid()?'android-sheet-vitonjob':'ios-sheet-vitonjob'),
      buttonClicked: function(index) {
        
var employeur = localStorageService.get('employeur');
    if(index==0){
              $state.go("saisieCiviliteEmployeur", {employeur: employeur});
            }
    if(index==1){
        $state.go("adressePersonel", {employeur: employeur});
    }
    if(index==2){

      $state.go("adresseTravail", {employeur: employeur});
    }
        //branchement de la page de contrat ou infos clients
          
            return true;
          }
        });
      };
$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
});
});
