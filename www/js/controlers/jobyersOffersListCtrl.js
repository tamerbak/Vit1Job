'use strict';

starter.controller('jobyersOffersListCtrl',
	['$scope', 'localStorageService', '$ionicActionSheet', 'UserService', '$state','Global','$cordovaSms',
	function($scope, localStorageService, $ionicActionSheet, UserService, $state,Global,$cordovaSms) {
    
    localStorageService.remove("steps");


    var init = function(){

    	$scope.OfferLabel = capitalize(localStorageService.get('lastSearchedJob'));

    	$scope.jobyerListSetting = localStorageService.get('jobyerListSetting');
    	if(!$scope.jobyerListSetting){
    		$scope.jobyerListSetting = {
    			orderByAvialability : true,
    			orderByCorrespondence : false,
    			job : 50,
    			qi : 25,
    			language : 25,
    			transportationmode : 'driving'
    		};
    		localStorageService.set('jobyerListSetting', $scope.jobyerListSetting);
    	};

		$scope.jobyersOffers = localStorageService.get('jobyersOffers');

		$scope.transportationmode = $scope.jobyerListSetting.transportationmode;

	};

	$scope.$on('$ionicView.beforeEnter', function(){
		init();
	});

	var capitalize = function(st) {
		return st.charAt(0).toUpperCase() + st.slice(1);
	};

	var setJobyerListSetting = function(property, newValue){
		var jobyerListSetting = localStorageService.get('jobyerListSetting');
		jobyerListSetting[property] = newValue;
		localStorageService.set('jobyerListSetting', jobyerListSetting);
	};

	$scope.$watch('jobyerListSetting.orderByAvialability', function (newValue, oldValue) {
		setJobyerListSetting('orderByAvialability', newValue);
	});

	$scope.$watch('jobyerListSetting.orderByCorrespondence', function (newValue, oldValue) {
		setJobyerListSetting('orderByCorrespondence', newValue);
	});

	var onError = function(data){
  console.log(data);
};

	var onGetJobyersOffersByJobSuccess = function(data){
  var jobyersOffers = data;
  localStorageService.set('jobyersOffers',jobyersOffers);
  $scope.jobyersOffers = localStorageService.get('jobyersOffers');
 };

	var getByLibelleJobAndAvailability = function(libelleJob, idEntreprise, idModeTransport){
    jobyerService.getByLibelleJobAndAvailability(libelleJob, idEntreprise, idModeTransport).success(onGetJobyersOffersByJobSuccess).error(onError);
  };

	var getIdModeTransport = function(){
    var jobyerListSetting = localStorageService.get('jobyerListSetting');
    var idModeTransport = 1;
    if(jobyerListSetting){
      var transportationmode = jobyerListSetting.transportationmode;
      switch(transportationmode) {
        case 'driving': idModeTransport = 1; break;
        case 'walking': idModeTransport = 2; break;
        case 'bicycling': idModeTransport = 3; break;
        case 'transit': idModeTransport = 4; break;
        default: idModeTransport = 1;
      }
    }
    return idModeTransport;
  };


	var getJobyersOffersByJob = function(libelleJob){

    var idModeTransport = getIdModeTransport();

    var currentEmployer = localStorageService.get('currentEmployer');
    if(currentEmployer){
      var currentEntreprise = localStorageService.get('currentEntreprise');
      var idEntreprise;
      if(currentEntreprise){
        idEntreprise = currentEntreprise.entrepriseId;
        getByLibelleJobAndAvailability(libelleJob, idEntreprise, idModeTransport);
      }
      else
      {
        var firstEntrepriseOfCurrentEmployer = getFirstEntrepriseOfCurrentEmployer();
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

  $scope.getJobyersOffersOrdred = function(){

  	var jobLabel = localStorageService.get('lastSearchedJob');
  	var orderByAvialability = $scope.jobyerListSetting.orderByAvialability;
  	var orderByCorrespondence = $scope.jobyerListSetting.orderByCorrespondence;

  	if(orderByAvialability && !orderByCorrespondence){
  		getJobyersOffersByJob(jobLabel);
  	}
  	else if(!orderByAvialability && orderByCorrespondence){

  	}
  	else if(orderByAvialability && orderByCorrespondence){
  		
  	}
  	else if(!orderByAvialability && !orderByCorrespondence){
  		
  	}

  };

	$scope.showMenuForContract = function(jobber){

    localStorageService.remove('Selectedjobyer');
    localStorageService.set('Selectedjobyer',jobber);
		var hideSheet = $ionicActionSheet.show({
			buttons: [
			{ text: '<i class="ion-android-textsms"> Contacter par SMS</i>' }, //Index = 0
			{ text: '<i class="ion-android-mail"> Contacter par Mail</i>' }, //Index = 1
			{ text: '<i class="ion-ios-telephone"> Contacter par Téléphone</i>' }, //Index = 2
			{ text: '<i class="ion-ios-paper-outline"> Créer un contrat</i>' } //Index = 3
			],
			titleText: 'Mise en relation',
			cancelText: 'Annuler',
			buttonClicked: function(index) {
        jobber.on = true;

		if(index==0){
              console.log('called send sms');
              document.addEventListener("deviceready", function() {
              var options = {
                  replaceLineBreaks: false, // true to replace \n by a new line, false by default
                  android: {
                    intent: 'INTENT'
                 }
             };
            $cordovaSms.send(jobber.tel, 'Vitojob :Inivitation de mise en relation', options)
                .then(function() {
                      console.log('Message sent successfully');
                }, function(error) {
                      console.log('Message Failed:' + error);

                    });
                   });
            }
		if(index==1){
				cordova.plugins.email.isAvailable(
					function (isAvailable) {
					cordova.plugins.email.open({
					to:  [jobber.email], // email addresses for TO field
					subject:    "Vitojob :Inivitation de mise en relation", // subject of the email
					//app: 'gmail'
					}, function(){
						    console.log('email view dismissed');
							//Global.showAlertValidation("Votre email a été bien envoyé.");
					}, this);
					}
				);
		}
		if(index==2){

			window.plugins.CallNumber.callNumber(function(){
				console.log("success call");
			}, function(){
				console.log("error call");
				Global.showAlertValidation("Une erreur est survenue.Veuillez réssayer plus tard");
			} ,jobber.tel, false);
		}
        //branchement de la page de contrat ou infos clients
          if(index==3){
            /*
              recuperation des données de l'emplyeur et calcule dans une variable boolean
              si toutes les informations sont présentes
              */

              var isAuth = UserService.isAuthenticated();
              if (isAuth) {
                console.log("check and then redirect to contract page");
                var employer = localStorageService.get('employeur');
                var redirectToStep1 = (typeof (employer) == "undefined");
                var redirectToStep1 = (employer) ? (typeof (employer.civilite) == "undefined") || (typeof (employer.entreprise) == "undefined") : true;
                var redirectToStep2 = (employer) ? (typeof (employer.adressePersonel) == "undefined") : true;
                var redirectToStep3 = (employer) ? (typeof (employer.adresseTravail) == "undefined") : true;
                if (employer && !redirectToStep1) {
                  for (var key in employer) {
                    redirectToStep1 = (employer[key]) == "";
                    if (redirectToStep1) break;
                  }
                  if (!redirectToStep1) {
                    for (var key in employer.adressePersonel) {
                      redirectToStep2 = (employer.adressePersonel[key]) == "";
                      if (redirectToStep2) break;
                    }
                  }
                  if (!redirectToStep2) {
                    for (var key in employer.adresseTravail) {
                      redirectToStep3 = (employer.adresseTravail[key]) == "";
                      if (redirectToStep3) break;
                    }
                  }
                }
                var dataInformed = ((!redirectToStep1) && (!redirectToStep2) && (!redirectToStep3));
                var objRedirect = {"step1": redirectToStep1, "step2": redirectToStep2, "step3": redirectToStep3};
                if (dataInformed) {
                  //show contract page //TODO
                  $state.go("contract", {jobyer: jobber});
                  console.log(jobber);
                  console.log("redirect to contract pages");
                }
                else {
                  localStorageService.set("steps",JSON.stringify(objRedirect));
                  console.log(employer);
                  if (redirectToStep1) $state.go("saisieCiviliteEmployeur");
                  else if (redirectToStep2) $state.go("adressePersonel");
                  else if (redirectToStep3) $state.go("adresseTravail");
                }
              } else {
                $state.go("connection");
              }
            }
            return true;
          }
        });
      }

    }]);
