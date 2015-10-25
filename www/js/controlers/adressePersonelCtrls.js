/**
 * Created by Omar on 15/10/2015.
 */


angular.module('adressePersonelCtrls', ['ionic', 'ngOpenFB', 'providerServices'])

	.controller('adressePersonelCtrl', function ($scope, localStorageService, $state, UpdateInServer, DataProvider){

		// FORMULAIRE
		$scope.formData = {};

		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdressePersEmployeur = function(){

			for(var obj in $scope.formData){
				console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}

			codePostal=$scope.formData.codePostal;
			ville=$scope.formData.ville;
			adresse1=$scope.formData.adresse1;
			adresse2=$scope.formData.adresse2;

			// RECUPERATION CONNEXION
			connexion=localStorageService.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			employeId=connexion.employeID;
			console.log("localStorageService.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=localStorageService.get('sessionID');

			// TEST DE VALIDATION
			//if(codePostal !== '' && ville !== '' && adresse1 !== '' && adresse2 !== ''){
			if(codePostal && ville && adresse1 && adresse2){
			//if (1!=1){
				UpdateInServer.updateAdressePersEmployeur(employeId, codePostal, ville, adresse1, adresse2, sessionId)
					.success(function (response){

						// DONNEES ONT ETE SAUVEGARDES
						console.log("les donnes ont été sauvegarde");
						console.log("response"+response);

					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdressePersEmployeur: "+err);
					});
			}

			// REDIRECTION VERS PAGE - ADRESSE TRAVAIL
			$state.go('adresseTravail');


		}

		$scope.initForm=function(){
			$scope.formData.zipCodes=DataProvider.getZipCodes();
		}

		$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "adressePersonel" ){
				$scope.initForm();
			}
		});
	})
