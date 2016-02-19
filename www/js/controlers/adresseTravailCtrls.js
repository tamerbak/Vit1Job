/**
 * Created by Omar on 15/10/2015.
 */
'use strict';
starter

  .controller('adresseTravailCtrl', function ($scope, $rootScope, localStorageService, $state, $stateParams, formatString,
                                              UpdateInServer, LoadList, DataProvider, Validator, Global, $ionicPopup, $ionicHistory, GeoService, $timeout) {

    // FORMULAIRE
    $scope.formData = {};
    $scope.placesOptions = {
      types: [],
      componentRestrictions: {country: 'FR'}
    };
    $scope.formData.addressTravail = "";
    $scope.disableTagButton = (localStorageService.get('steps') != null) ? {'visibility': 'hidden'} : {'visibility': 'visible'};
    var steps = (localStorageService.get('steps') != null) ? localStorageService.get('steps') : '';
    // RECUPERATION SESSION-ID & EMPLOYEUR-ID
    $scope.updateAdresseTravEmployeur = function () {

      var codePost = "", num = "", ville = "", adresse1 = "", adresse2 = "";

      // RECUPERATION CONNEXION
      var connexion = localStorageService.get('connexion');
      // RECUPERATION EMPLOYEUR ID
      var employeId = connexion.employeID;
      // RECUPERATION SESSION ID
      var sessionId = localStorageService.get('sessionID');
      UpdateInServer.updateAdresseTravEmployeur(employeId, codePost, ville, num, adresse1, adresse2, sessionId)
        .success(function (response) {
          employeur = localStorageService.get('employeur');
          if (!employeur)
            var employeur = {"civilite": "", "nom": "", "prenom": "", entreprise: "", siret: "", ape: "", numUssaf: ""};
          var adresseTravail = {};
          if ($scope.formData.addressTravail)
            adresseTravail = {fullAddress: $scope.formData.addressTravail.formatted_address};
          else
            adresseTravail = {fullAddress: ""};
          employeur.adresseTravail = adresseTravail;

          // PUT IN SESSION
          localStorageService.set('employeur', employeur);
          // console.log("employeur : "+JSON.stringify(employeur));
          // REDIRECTION VERS PAGE - offres
          var steps = (localStorageService.get('steps') != null) ? localStorageService.get('steps') : '';
          if (!steps) {

            $state.go('offres');
          }
          else {

            $state.go('contract');
          }

        }).error(function (err) {
          console.log("error : insertion DATA");
          console.log("error In updateAdresseTravEmployeur: " + err);
        });
    };

    // VALIDATION
    $scope.validatElement = function (id) {
      Validator.checkField(id);
    };
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
      var employeur = localStorageService.get('employeur');
      if (employeur) {
        //console.log(employeur.adresseTravail.fullAddress);
        var result = {
          address_components: [],
          adr_address: "",
          formatted_address: (employeur.adresseTravail) ? employeur.adresseTravail.fullAddress : "",
          geometry: "",
          icon: ""
        };
        console.log(result);
        var ngModel = angular.element($('#autocomplete_travail')).controller('ngModel');
        ngModel.$setViewValue(result);
        ngModel.$render();
      }
      ;


      // console.log(states.fromCache+"  state : "+states.stateName);
      if (states.stateName == "adresseTravail") {
        var steps = (localStorageService.get('steps') != null) ? localStorageService.get('steps') : '';
        //$scope.initForm();
        // console.log("steps ="+steps);
        if (steps) {
          $scope.title = "Pré-saisie des informations contractuelles : adresse du travail";
          $scope.isContractInfo = true;

          if (steps.state) {
            steps.step3 = false;
            localStorageService.set("steps", steps);
          }
          ;
          $ionicPopup.show({
            title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
            template: 'Veuillez remplir les données suivantes, elle seront utilisées dans le processus du contractualisation.',
            buttons: [
              {
                text: '<b>OK</b>',
                type: 'button-dark',
                onTap: function (e) {
                  $timeout(function () {
                    displayPopups();
                  });
                }
              }
            ]
          });
        } else {
          $scope.title = "Adresse de travail";
          $scope.isContractInfo = false;
          displayPopups();
        }
        // console.log("steps : "+steps);
        // console.log("$scope.title : "+$scope.title);


        var employeur = localStorageService.get('employeur');
        if (employeur) {
          // INITIALISATION FORMULAIRE
          if (employeur['adresseTravail']) {
            // INITIALISATION FORMULAIRE
            /**if(employeur['adresseTravail'].codePostal)
             document.getElementById('ex2_value').value=employeur['adresseTravail']['codePostal'];
             if(employeur.adresseTravail.ville)
             document.getElementById('ex3_value').value=employeur['adresseTravail']['ville'];**/
            if (employeur['adresseTravail']) {
              //$scope.formData['adresse1']=employeur['adresseTravail']['adresse1'];
              //$scope.formData['adresse2']=employeur['adresseTravail']['adresse2'];
              // $scope.formData['addressTravail']=employeur['adresseTravail']['fullAddress'];

            }
          }
        }
      }
    });


    $scope.displayAdresseTooltip = function () {
      $scope.adresseToolTip = "Astuce : Commencez par le code postal";
      $scope.showAdresseTooltip = true;
      // console.log($scope.formData.addressTravail);
    };
    $scope.displayAdresseTooltip();
    $scope.fieldIsEmpty = function () {
      if ($scope.formData.addressTravail == "" || $scope.formData.addressTravail == null) {
        return true;
      } else {
        return false;
      }
    };
    function displayPopup1() {
      $timeout(function () {

        if (!$stateParams.geolocated) {
          var popup1 = $ionicPopup.show({
            //Votre géolocalisation pour renseigner votre adresse du siège social?
            template: "Localisation: êtes-vous dans votre lieu de travail?<br>",
            title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
            buttons: [
              {
                text: '<b>Non</b>',
                type: 'button-dark',
                onTap: function (e1) {
                  e1.preventDefault();
                  popup1.close();
                  // console.log('popup1 non');
                }
              }, {
                text: '<b>Oui</b>',
                type: 'button-calm',
                onTap: function (e2) {
                  e2.preventDefault();
                  popup1.close();
                  // console.log('popup1 oui');
                  $timeout(function () {
                    var popup2 = $ionicPopup.show({
                      //Votre géolocalisation pour renseigner votre adresse du siège social?
                      template: "Si vous acceptez d'être localisé, vous n'aurez qu'à valider votre adresse de travail.<br>",
                      title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
                      buttons: [
                        {
                          text: '<b>Non</b>',
                          type: 'button-dark',
                          onTap: function (e3) {
                            e3.preventDefault();
                            popup2.close();
                            // console.log('popup2 non');
                          }
                        }, {
                          text: '<b>Oui</b>',
                          type: 'button-calm',
                          onTap: function (e4) {
                            e4.preventDefault();
                            popup2.close();
                            // console.log('popup2 oui');
                            GeoService.getUserAddress()
                              .then(function () {
                                var geoAddress = localStorageService.get('user_address');
                                // $scope.formData.addressTravail = geoAddress.fullAddress;
                                var result = {
                                  address_components: [],
                                  adr_address: "",
                                  formatted_address: geoAddress.fullAddress,
                                  geometry: "",
                                  icon: "",
                                };
                                var ngModel = angular.element($('#autocomplete_travail')).controller('ngModel');
                                ngModel.$setViewValue(result);
                                ngModel.$render();

                              }, function (error) {
                                Global.showAlertValidation("Impossible de vous localiser, veuillez vérifier vos paramétres de localisation");
                              });
                          }
                        }
                      ]
                    });
                  });
                }
              }
            ]
          });

        }
      });
    }

    function displayPopups() {
      if ($stateParams.addressPers) {
        var popup = $ionicPopup.show({

          template: "L'adresse de travail est-elle différente de l'adresse du siège social? <br>",
          title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
          buttons: [
            {
              text: '<b>Oui</b>',
              type: 'button-calm',
              onTap: function (e) {
                e.preventDefault();
                popup.close();
                // console.log('popup oui');
                $scope.formData.addressTravail = "";
                displayPopup1();
              }
            }, {
              text: '<b>Non</b>',
              type: 'button-dark',
              onTap: function (e) {
                e.preventDefault();
                popup.close();
                $scope.formData.addressTravail = $stateParams.addressPers;
                $scope.updateAdresseTravEmployeur();
              }
            }
          ]
        });
      } else {
        displayPopup1();
      }
    }

//mobile tap on autocomplete workaround!
    $scope.disableTap = function () {

      var container = document.getElementsByClassName('pac-container');
      if (screen.height <= 480) {
        // console.log("height called");
        angular.element(container).attr('style', 'height: 60px;overflow-y: scroll');
      }
      angular.element(container).attr('data-tap-disabled', 'true');

      angular.element(container).on("click", function () {
        document.getElementById('addresseTravail').blur();
        //google.maps.event.trigger(autoComplete, 'place_changed');
      })
    };

    $scope.skipDisabled = function () {
      var employeur = localStorageService.get('employeur');
      return $scope.isContractInfo && (!employeur || !employeur.adresseTravail || !employeur.adresseTravail.fullAddress);
    };
    $scope.skipGoto = function () {
      if ($scope.isContractInfo)
        $state.go('contract');
      else
        $state.go('offres');
    }
  });

