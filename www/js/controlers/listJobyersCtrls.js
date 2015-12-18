/**
 * Created by Tamer on 14/10/2015.
 */
'use strict';
starter
  .controller('listCtrl', function ($scope, $rootScope,$ionicModal,$ionicActionSheet,UserService, localStorageService, $state) {
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
            var isAuth = UserService.isAuthenticated();
            if(isAuth){
              console.log("check and then redirect to contract page");
              var employer = localStorageService.get('employeur');
              var redirectToStep1 = (typeof (employer) == "undefined");
              var redirectToStep1 = (typeof (employer.civilite) == "undefined") || (typeof (employer.entreprise) == "undefined");
              var redirectToStep2 = (employer) ? (typeof (employer.adressePersonel) == "undefined") : true;
              var redirectToStep3 = (employer) ? (typeof (employer.adresseTravail) == "undefined") : true;
              if(employer && !redirectToStep1){
                for (var key in employer){
                  redirectToStep1 = (employer[key])=="";
                  if(redirectToStep1) break;
                }
                if(!redirectToStep1){
                  for (var key in employer.adressePersonel){
                    redirectToStep2 = (employer.adressePersonel[key])=="";
                    if(redirectToStep2) break;
                  }
                }
                if(!redirectToStep2){
                  for (var key in employer.adresseTravail){
                    redirectToStep3 = (employer.adresseTravail[key])=="";
                    if(redirectToStep3) break;
                  }
                }
              }
              var dataInformed = ((!redirectToStep1) && (!redirectToStep2) && (!redirectToStep3));
              var objRedirect = {"step1":redirectToStep1,"step2":redirectToStep2,"step3":redirectToStep3};
              if(dataInformed){
                //show contract page //TODO
                console.log(jobber);
                console.log("redirect to contract pages");
              }
              else{
                console.log(employer);
                if(redirectToStep1) $state.go("saisieCiviliteEmployeur",{ "steps": JSON.stringify(objRedirect)});
                else if(redirectToStep2) $state.go("adressePersonel",{ "steps": JSON.stringify(objRedirect)});
                else if(redirectToStep3) $state.go("adresseTravail",{ "steps": JSON.stringify(objRedirect)});
              }
            }else{
              $state.go("connection");
            }
          }
          return true;
        }
      });
    }
  })
;
