/**
 * Created by Tamer on 14/10/2015.
 */
'use strict';
starter
  .controller('listCtrl', function ($scope,$ionicActionSheet, $rootScope) {
    $scope.jobyersForMe = $rootScope.jobyersForMe;

    $scope.showMenuForContract = function(jobber){
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<i class="ion-ios-paper-outline"> Créer un contrat</i>' }
        ],
        titleText: 'Contractualisation',
        cancelText: 'Annuler',
        buttonClicked: function(index) {
          //branchement de la page de contrat ou infos clients
          if(index==0){
            /*
              recuperation des données de l'emplyeur et calcule dans une variable boolean
              si toutes les informations sont présentes
            */
            console.log(jobber);
            var dataInformed = false; // TODO
            //test si tous les infomations de l'employeur sont renseignées
            if(dataInformed){
              //show contract page //TODO
            }
            else{
              //show employer infos page //TODO
            }
          }
          return true;
        }
      });
    }
  })
;
