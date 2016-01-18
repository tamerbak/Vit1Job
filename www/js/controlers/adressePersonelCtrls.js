/**
 * Created by Omar on 15/10/2015.
 */

starter

	.controller('adressePersonelCtrl', function ($scope, $rootScope, $state,$stateParams, UpdateInServer,
			DataProvider, Validator, UserService, GeoService, $ionicPopup,localStorageService ,$ionicPopup,$timeout,Global){

		// FORMULAIRE
    var geolocated=false;
		$scope.formData = {};
    $scope.placesOptions = {
      types: [],
      componentRestrictions: {country:'FR'}
    };
    $scope.formData.address="";
    $scope.disableTagButton = (localStorageService.get('steps')!=null)?{'visibility': 'hidden'}:{'visibility': 'visible'};
    var steps =  (localStorageService.get('steps')!=null) ? JSON.parse(localStorageService.get('steps')) : '';
    $scope.geocodeOptions = {
      componentRestrictions: {
        country : 'FR'
      }
    };
		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdressePersEmployeur = function(){

			var codePostal="", ville="" , num = "", adresse1="",adresse2="";

			// RECUPERATION CONNEXION
			connexion=localStorageService.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
			// RECUPERATION SESSION ID
			sessionId=localStorageService.get('sessionID');

				UpdateInServer.updateAdressePersEmployeur(employeId, codePostal, ville, num, adresse1, adresse2, sessionId)
					.success(function (response){
						employeur=localStorageService.get('employeur');
						if(!employeur)
							var employeur={"civilite":"","nom":"","prenom":"",entreprise:"",siret:"",ape:"",numUssaf:""};
						var adressePersonel={};
						adressePersonel={'codePostal': codePostal, 'ville': ville, 'num':num, 'adresse1': adresse1, 'adresse2': adresse2, 'adressePersonel':$scope.formData.address.formatted_address};
						employeur.adressePersonel=adressePersonel;

						// PUT IN SESSION
						localStorageService.set('employeur', employeur);
						

						var code="", vi="";
						// AFFICHE POPUP
						$rootScope.$broadcast('show-pop-up', {params:
							{
                'num': num,
								'adresse1': adresse1,
								'adresse2': adresse2,
                'address':$scope.formData.address,
								'vi': vi,
								'code': code,
                'geolocated':geolocated
							}
								});
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdressePersEmployeur: "+err);
					});
        // }
			// REDIRECTION VERS PAGE - ADRESSE TRAVAIL
			$state.go('adresseTravail',{"geolocated":geolocated,addressPers:$scope.formData.address});
		};

		// VALIDATION - FIELD
		$scope.validatElement=function(id){
			Validator.checkField(id);
		};

		$scope.$watch('formData.zipCodes', function(){
			console.log('hey, formData.zipCodes has changed!');
			//console.log('zipCodes.length : '+$scope.formData.zipCodes.length);
		});
 
    function displayPopups(){
      if(isNaN($scope.formData.codePostal) && isNaN($scope.formData.ville) && !$scope.formData.adresse1 && !$scope.formData.adresse2 && !$scope.formData.num){
        // INITIALISATION FORMULAIRE
        var myPopup = $ionicPopup.show({
          //Votre géolocalisation pour renseigner votre adresse du siège social?
          template: "Localisation: êtes-vous dans votre siège social?<br>",
          title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
          buttons: [
            {
              text: '<b>Non</b>',
              type: 'button-dark',
              onTap: function(e) {
                myPopup.close();
              }
            },{
              text: '<b>Oui</b>',
              type: 'button-calm',
              onTap: function(e){
                myPopup.close();
                $timeout( function () {
                  var myPopup2 = $ionicPopup.show({
                    //Votre géolocalisation pour renseigner votre adresse du siège social?
                    template: "Si vous acceptez d'être localisé, vous n'aurez qu'à valider l'adresse de votre siège social.<br>",
                    title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
                    buttons: [
                      {
                        text: '<b>Non</b>',
                        type: 'button-dark',
                        onTap: function (e) {
                          myPopup2.close();
                        }
                      }, {
                        text: '<b>Oui</b>',
                        type: 'button-calm',
                        onTap: function (e) {
                          myPopup2.close();
                          GeoService.getUserAddress().then(function() {
                          geolocated = true;
                          var geoAddress = localStorageService.get('user_address');

                          $scope.formData.adresse1 = geoAddress.street;
                          $scope.formData.adresse2 = geoAddress.complement;
                          $scope.formData.num = geoAddress.num;
                          $scope.formData.initialCity = geoAddress.city;
                          $scope.formData.initialPC = geoAddress.postalCode;

                          // $scope.formData.address=geoAddress.fullAddress;
                         
                          var result = { 
                            address_components: [], 
                            adr_address: "", 
                            formatted_address: geoAddress.fullAddress,
                            geometry: "",
                            icon: "",
                          };
                          var ngModel = angular.element($('.autocomplete-personel')).controller('ngModel');
                          ngModel.$setViewValue(result);
                          ngModel.$render();
                        }, function(error) {
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
    }
    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.formData.zipCodes=DataProvider.getZipCodes();
      $scope.formData.villes=DataProvider.getVilles();
    });

       $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    });
		$scope.$on("$ionicView.beforeEnter", function( scopes, states ){
			if(states.stateName == "adressePersonel" ){ //states.fromCache &&
				//$scope.initForm();
				//employeur=localStorageService.get('employeur');
        var steps =  (localStorageService.get('steps')!=null) ? JSON.parse(localStorageService.get('steps')) : '';        
        if(steps!='')
          {
             $scope.title="Pré-saisie des informations contractuelles : adresse siège social";    
             $scope.isContractInfo=true;                    
            $ionicPopup.show({
              title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
              template: 'Veuillez remplir les données suivantes, elle seront utilisées dans le processus du contractualisation.',
              buttons : [
              {
                  text: '<b>OK</b>',
                  type: 'button-dark',
                  onTap: function(e) {
                  //$ionicPopup.hide();
                    $timeout( function () {                  
                      displayPopups();
                    });
                  }
                }
              ]
            });
          }
          else{
             $scope.title="Siège social"; 
             $scope.isContractInfo=false;                                                       
            displayPopups();
          }
			}


			}
		);

    $scope.displayAdresseTooltip = function () {
      $scope.adresseToolTip = "Astuce : Commencez par le code postal";
      $scope.showAdresseTooltip = true;
    };
    $scope.displayAdresseTooltip();

    $scope.fieldIsEmpty = function() {
      if($scope.formData.address == "" || $scope.formData.address == null){
        return true;
      } else {
        return false;
      }
    };

//mobile tap on autocomplete workaround!
  $scope.disableTap = function(){
    
    var container = document.getElementsByClassName('pac-container');
    if(screen.height <= 480){
      angular.element(container).attr('style', 'height: 60px;overflow-y: scroll');  
    }
    angular.element(container).attr('data-tap-disabled', 'true');
    
    angular.element(container).on("click", function(){
        document.getElementById('address').blur();
        //google.maps.event.trigger(autoComplete, 'place_changed');
    })
  };    
});
