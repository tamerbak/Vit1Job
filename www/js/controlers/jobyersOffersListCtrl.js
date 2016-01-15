'use strict';

starter.controller('jobyersOffersListCtrl',
	['$scope', 'localStorageService', '$ionicActionSheet', 'UserService', '$state','Global','$cordovaSms',
	function($scope, localStorageService, $ionicActionSheet, UserService, $state,Global,$cordovaSms) {

		$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
});

    localStorageService.remove("steps");
		var init = function(){

			$scope.OfferLabel = capitalize(localStorageService.get('lastSearchedJob'));
			$scope.jobyerListSetting = localStorageService.get('jobyerListSetting');
			if(!$scope.jobyerListSetting){
				$scope.jobyerListSetting = {
					orderByAvialability : false,
					orderByCorrespondence : false,
					job : 50,
					qi : 25,
					language : 25,
					transportationmode : 'driving'
				};
				localStorageService.set('jobyerListSetting', $scope.jobyerListSetting);
			};

			//*/

			$scope.jobyersOffers = [{
				jobyerName : 'Jérôme',
				availability : {
					value : 210,
					text : '8h 30min'
				},
				tel: "+212676109994",
				email:"ettebaa.marouane@gmail.com",
				matching : 60,
				contacted : false,
				latitude : 0,
				longitude : 0
			},
			{
				jobyerName : 'Alain',
				availability : {
					value : 20,
					text : '3h 30min'
				},
				tel: "+212623628174",
				email:"hanane.aitamhira@gmail.com",
				matching : 20,
				contacted : true,
				latitude : 0,
				longitude : 0
			},
			{
				jobyerName : 'Philippe',
				availability : {
					value : 1000,
					text : '17h 30min'
				},
				tel: "+212623628174",
				email:"hanane.aitamhira@gmail.com",
				matching : 10,
				contacted : false,
				latitude : 0,
				longitude : 0
			}];
		//*/
		/*
		$scope.jobyersOffers = localStorageService.get('jobyersOffers');
		//*/

		$scope.transportationmode = $scope.jobyerListSetting.transportationmode;

		$scope.sort();
	};

	$scope.$on('$ionicView.beforeEnter', function(){
		init();
	});

	$scope.sort = function(){
		if($scope.jobyerListSetting.orderByCorrespondence) $scope.SortOrder = '-matching';
		if($scope.jobyerListSetting.orderByAvialability) $scope.SortOrder = '+availability.value';
	};

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

	$scope.showMenuForContract = function(jobber){

    localStorageService.remove('Selectedjobyer');
    localStorageService.set('Selectedjobyer',jobber);
		var hideSheet = $ionicActionSheet.show({
			buttons: [
			{ text: '<i class="ion-android-textsms">Contacter par SMS</i>'}, //Index = 0
			{ text: '<i class="ion-android-mail">Contacter Mail</i>'}, //Index = 1
			{ text: '<i class="ion-ios-telephone">Contacter par Téléphone</i>' }, //Index = 2
			{ text: '<i class="ion-ios-paper-outline"> Créer un contrat</i>' } //Index = 3
			],
			titleText: 'Mise en relation',
			cancelText: 'Annuler',
			cssClass:(ionic.Platform.isAndroid()?'android-sheet-vitonjob':'ios-sheet-vitonjob'),
			buttonClicked: function(index) {
        jobber.contacted = true;

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
                  if (redirectToStep1) $state.go("saisieCiviliteEmployeur", {jobyer: jobber});
                  else if (redirectToStep2) $state.go("adressePersonel", {jobyer: jobber});
                  else if (redirectToStep3) $state.go("adresseTravail", {jobyer: jobber});
                }
              } else {
                $state.go("connection", {jobyer: jobber});
              }
            }
            return true;
          }
        });
      }

    }]);
