/**
 * Created by Omar on 15/10/2015.
 */
'use strict';
starter

	.controller('saisieCiviliteJobeyerCtrl', function ($scope, $state, UpdateInServer, GlobalService, LocalStorageService,$ionicPopup){

		var employeId=GlobalService.getEmployeId();
		$scope.updateCivilite = function(titre, nom, prenom, entreprise, siret, ape, numUssaf){
			// RECUPERATION EMPLOYEUR ID
			console.log("$scope.employeId : "+LocalStorageService.getItem('employeID'));

			if(titre !== '' || nom !== '' || prenom !== '' || entreprise !== '' || siret !== '' || ape !== '' || numUssaf !== ''){
				// UPDATE EMPLOYEUR
				UpdateInServer.updateCiviliteInEmployeur(
					employeId, titre, nom, prenom, entreprise, siret, ape, numUssaf, sessionID)
						.success(function (response){

							// DONNEES SAUVEGARDES
							// REDIRECTION VERS PAGE - ADRESSE PERSONELLE
							$state.go("adressePersonel");

						}).error(function (err){
							console.log("error : insertion DATA");
							console.log("error In updateCiviliteInEmployeur: "+err);
						});
			}
		}
	})
;
