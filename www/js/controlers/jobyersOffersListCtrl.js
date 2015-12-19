
'use strict';

starter.controller('jobyersOffersListCtrl', 
	['$scope', 'localStorageService', '$ionicActionSheet', 'UserService', '$state', 
	function($scope, localStorageService, $ionicActionSheet, UserService, $state) {

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
		if($scope.jobyerListSetting.orderByCorrespondence) $scope.SortOrder = '+matching';
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

		jobber.contacted = true;

		var hideSheet = $ionicActionSheet.show({
			buttons: [
			{ text: '<i class="ion-android-textsms"> Contacter par SMS</i>' }, //Index = 0
			{ text: '<i class="ion-android-mail"> Contacter par Mail</i>' }, //Index = 1
			{ text: '<i class="ion-ios-telephone"> Contacter par Téléphone</i>' }, //Index = 2
			{ text: '<i class="ion-ios-paper-outline"> Créer un contrat</i>' } //Index = 3
			],
			titleText: 'Actions',
			cancelText: 'Annuler',
			buttonClicked: function(index) {
          //branchement de la page de contrat ou infos clients
          if(index==3){
            /*
              recuperation des données de l'emplyeur et calcule dans une variable boolean
              si toutes les informations sont présentes
              */
              var isAuth = UserService.isAuthenticated();
              if(isAuth){
              	console.log("check and then redirect to contract page");
              	var employer = $cookieStore.get('employeur');
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
                $state.go("contract", { jobyer: jobber });
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

}]);