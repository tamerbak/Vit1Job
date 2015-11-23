/**
 * Created by Tamer on 14/10/2015.
 */
'use strict';
starter
  .controller('listCtrl', function ($scope, $rootScope,$ionicModal,$ionicActionSheet) {
    $scope.jobyersForMe = $rootScope.jobyersForMe;
    $scope.matchingOptions = {
      'comp' : 20,
      'job' : 20,
      'mait' : 20,
      'indis' : 20,
      'lang' : 20
    };

    $scope.$watch('matchingOptions.comp', function(oldval, newval){
      if (newval < 0)
        $scope.matchingOptions.comp = oldval;
      else if (newval > 100)
        $scope.matchingOptions.comp = oldval;
      else{
        $scope.matchingOptions.job = (100 - $scope.matchingOptions.comp)/4 ;
      }
    });

    $scope.$watch('matchingOptions.job', function(oldval, newval){
      if (newval < 0)
        $scope.matchingOptions.job = oldval;
      else if (newval > 100)
        $scope.matchingOptions.job = oldval;
      else{
        $scope.matchingOptions.mait = (100 - $scope.matchingOptions.job - $scope.matchingOptions.comp )/3 ;
        $scope.matchingOptions.indis = (100 - $scope.matchingOptions.job - $scope.matchingOptions.comp)/3 ;
        $scope.matchingOptions.lang = (100 - $scope.matchingOptions.job- $scope.matchingOptions.comp)/3 ;
      }
    });

    $scope.$watch('matchingOptions.mait', function(oldval, newval){
      if (newval < 0)
        $scope.matchingOptions.mait = oldval;
      else if (newval > 100)
        $scope.matchingOptions.mait = oldval;
      else{
        $scope.matchingOptions.indis = (100 - $scope.matchingOptions.mait - $scope.matchingOptions.comp - $scope.matchingOptions.job)/2 ;
        $scope.matchingOptions.lang = (100 - $scope.matchingOptions.mait - $scope.matchingOptions.comp- $scope.matchingOptions.job )/2 ;
      }
    });

    $scope.$watch('matchingOptions.indis', function(oldval, newval){
      if (newval < 0)
        $scope.matchingOptions.indis = oldval;
      else if (newval > 100)
        $scope.matchingOptions.indis = oldval;
      else{
        $scope.matchingOptions.lang = (100 - $scope.matchingOptions.mait - $scope.matchingOptions.comp- $scope.matchingOptions.job - $scope.matchingOptions.indis) ;
      }
    });

    $scope.$watch('matchingOptions.lang', function(oldval, newval){
      if (newval < 0)
        $scope.matchingOptions.lang = oldval;
      else if (newval > 100)
        $scope.matchingOptions.lang = oldval;
      else{
        if (newval > (100 - $scope.matchingOptions.mait - $scope.matchingOptions.comp- $scope.matchingOptions.job - $scope.matchingOptions.indis))
          $scope.matchingOptions.lang = oldval;
      }
    });

    $scope.initiateParams = function(){
      $scope.matchingOptions = {
        'comp' : 20,
        'job' : 20,
        'mait' : 20,
        'indis' : 20,
        'lang' : 20
      };
    };

    $scope.loadModal = function(template){
      $ionicModal.fromTemplateUrl(template, {
        scope: $scope,
        animation: 'fade-in'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.openModal();
      });
    };

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

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
