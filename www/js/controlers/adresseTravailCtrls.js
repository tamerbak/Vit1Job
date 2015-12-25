/**
 * Created by Omar on 15/10/2015.
 */
'use strict';
starter

	.controller('adresseTravailCtrl', function ($scope, $rootScope, localStorageService, $state, $stateParams,formatString,
					UpdateInServer, LoadList, DataProvider, Validator, Global, $ionicPopup, $ionicHistory,GeoService,$timeout){

		// FORMULAIRE
		$scope.formData = {};
    $scope.formData.addressTravail="";
    $scope.disableTagButton = (localStorageService.get('steps')!=null)?{'visibility': 'hidden'}:{'visibility': 'visible'};
    var steps =  (localStorageService.get('steps')!=null) ? JSON.parse(localStorageService.get('steps')) : '';
    if(steps!='')
    {
      $ionicPopup.show({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Veuillez remplir les données suivantes, elle seront utilisées dans le processus du contractualisation.',
        buttons : [
          {
            text: '<b>OK</b>',
            type: 'button-dark',
            onTap: function(e) {
            }
          }
        ]
      });
    }
		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdresseTravEmployeur = function(){

			for(var obj in $scope.formData){
				//console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}

			var codePost="A", ville="A";
			if(typeof $scope.formData.codePostal !== 'undefined')
				if(typeof $scope.formData.codePostal.originalObject !== 'undefined'){
					console.log("codePostal : "+JSON.stringify($scope.formData.codePostal));
					codePost=Number($scope.formData.codePostal.originalObject.pk_user_code_postal);
				}

			if(typeof $scope.formData.ville !== 'undefined')
				if(typeof $scope.formData.ville.originalObject !== 'undefined')
					ville=Number($scope.formData.ville.originalObject.pk_user_ville);
      var num = $scope.formData.num;
      var adresse1=$scope.formData.adresse1;
			var adresse2=$scope.formData.adresse2;

			console.log("codePostal: "+codePost);
			console.log("ville : "+ville);

			// RECUPERATION CONNEXION
			var connexion=localStorageService.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
			console.log("localStorageService.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			var sessionId=localStorageService.get('sessionID');

			// TEST DE VALIDATION
			if(!isNaN(codePost) || !isNaN(ville) || adresse1  || adresse2 || num){
				if(!adresse1)
					adresse1='';
				if(!adresse2)
					adresse2='';
        if(!num)
          num='';
				UpdateInServer.updateAdresseTravEmployeur(employeId, codePost, ville,num, adresse1, adresse2, sessionId)
					.success(function (response){

						// DONNEES ONT ETE SAUVEGARDES
						console.log("les donnes ont été sauvegarde");
						console.log("response"+response);

						employeur=localStorageService.get('employeur');
						if(!employeur)
              var employeur={"civilite":"","nom":"","prenom":"",entreprise:"",siret:"",ape:"",numUssaf:""};
						var adresseTravail={};
						 adresseTravail={'codePostal': codePost, 'ville': ville, 'adresse1': adresse1, 'adresse2': adresse2};
						employeur.adresseTravail=adresseTravail;

						// PUT IN SESSION
						localStorageService.set('employeur', employeur);
						console.log("employeur : "+JSON.stringify(employeur));
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdresseTravEmployeur: "+err);
					});
			}

			/*** CHARGEMENT METIERS
			metiers=localStorageService.get('metiers');
			//metiers=$rootScope.metiers;
			if(!metiers){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListMetiers(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les metiers ont été bien chargé");
						metiersObjects=resp.dataModel.rows.dataRow;
						//console.log("metiersObjects : "+JSON.stringify(metiersObjects));

						// GET METIERS
						metiers=[];
						metier={}; // metier.libelle | metier.id

						metiersList=[].concat(metiersObjects);
						for(var i=0; i<metiersList.length; i++){
							object=metiersList[i].dataRow.dataEntry;

							// PARCOURIR LIST PROPERTIES
							metier[object[0].attributeReference]=object[0].value;
							metier[object[1].attributeReference]=object[1].value;

							if(metier)
								metiers.push(metier);
							metier={}
						}

						console.log("metiers.length : "+metiers.length);

						// PUT IN SESSION
						localStorageService.set('metiers', metiers);
						console.log("metiers : "+JSON.stringify(metiers));
					}).error(function (err){
						console.log("error : GET DATA from metiers");
						console.log("error In : "+err);
					});
			}

			// CHARGEMENT LANGUES
			langues=localStorageService.get('langues');
			if(!langues){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListLangues(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les langues ont été bien chargé");
						languesObjects=resp.dataModel.rows.dataRow;

						// GET LANGUES
						langues=[];
						langue={}; // langue.libelle | langue.id

						languesList=[].concat(languesObjects);
						for(var i=0; i<languesList.length; i++){
							object=languesList[i].dataRow.dataEntry;

							// PARCOURIR LIST PROPERTIES
							langue[object[0].attributeReference]=object[0].value;
							langue[object[1].attributeReference]=object[1].value;

							if(langue)
								langues.push(langue);
							langue={}
						}

						console.log("langues.length : "+langues.length);
						// PUT IN SESSION
						localStorageService.set('langues', langues);
						console.log("langues : "+JSON.stringify(langues));
					}).error(function (err){
						console.log("error : GET DATA from langues");
						console.log("error In : "+err);
					});
			}

			// CHARGEMENT JOBS
			jobs=localStorageService.get('jobs');
			if(!jobs){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListJobs(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les jobs ont été bien chargé");
						jobsObjects=resp.dataModel.rows.dataRow;

						// GET LANGUES
						jobs=[];
						job={}; // job.libelle | job.id

						jobsList=[].concat(jobsObjects);
						for(var i=0; i<jobsList.length; i++){
							object=jobsList[i].dataRow.dataEntry;

							// PARCOURIR LIST PROPERTIES
							job[object[0].attributeReference]=object[0].value;
							job[object[1].attributeReference]=object[1].value;

							if(job)
								jobs.push(job);
							job={}
						}

						console.log("jobs.length : "+jobs.length);
						// PUT IN SESSION
						localStorageService.set('jobs', jobs);
						console.log("jobs : "+JSON.stringify(jobs));
					}).error(function (err){
						console.log("error : GET DATA from jobs");
						console.log("error In : "+err);
					});
			}

			// CHARGEMENT COMPETENCES INDISPENSABLES
			transvers=localStorageService.get('transvers');
			if(!transvers){
				// CHARGEMENT DES DONNES AUPRES BD
				LoadList.loadListIndespensables(sessionId)
					.success(function (response){

						resp=formatString.formatServerResult(response);
						// DONNEES ONT ETE CHARGES
						console.log("les transvers ont été bien chargé");
						transversObjects=resp.dataModel.rows.dataRow;

						// GET TRANSVERS
						transvers=[];
						transver={}; // transver.libelle | transver.id

						transversList=[].concat(transversObjects);
						for(var i=0; i<transversList.length; i++){
							object=transversList[i].dataRow.dataEntry;

							// PARCOURIR LIST PROPERTIES
							transver[object[0].attributeReference]=object[0].value;
							transver[object[1].attributeReference]=object[1].value;

							if(transver)
								transvers.push(transver);
							transver={}
						}

						console.log("transvers.length : "+transvers.length);
						// PUT IN SESSION
						$cookieStore.put('transvers', transvers);
						console.log("transvers : "+JSON.stringify(transvers));
					}).error(function (err){
						console.log("error : GET DATA from transvers");
						console.log("error In : "+err);
					});
			}***/

			// REDIRECTION VERS PAGE - offres
			if(steps == '')$state.go('offres');
      else $state.go('contract');
		};

		// VALIDATION
		$scope.validatElement=function(id){
			Validator.checkField(id);
		};

    $scope.$on("$ionicView.beforeEnter", function () {
      $scope.formData.zipCodes=DataProvider.getZipCodes();
      $scope.formData.villes=DataProvider.getVilles();
    });

		//$scope.initForm=function(){
			//$scope.formData.zipCodes=DataProvider.getZipCodes();
			//$scope.formData.villes=DataProvider.getVilles();
		//};
/*
		$scope.$on('update-list-ville', function(event, args){

			var params = args.params;
			console.log("params : "+JSON.stringify(params));

			var list=params.list;
			var fk=params.fk;
			// NEW LIST - VILLES
			var vls=[];

			if(list === "postal"){
				// VIDER LIST - VILLES
				$scope.formData.villes=[];

				var allVilles=DataProvider.getVilles();
				var villes=[];
				for(var i=0; i<allVilles.length; i++){
					if(allVilles[i]['fk_user_code_postal'] === fk){
						villes.push(allVilles[i]);
					}
				}


				// UPDATE ZIP CODES - GLOBAL
				$scope.formData.villes=[];
				$scope.formData.villes=villes;
				console.log("New $scope.formData.villes : "+JSON.stringify($scope.formData.villes));

				// ENVOI AU AUTOCOMPLETE CONTROLLEUR
				//$rootScope.$broadcast('load-new-list', {newList: {codes}});
			}
		});
*/
		/**$scope.$on('update-list-code', function(event, args){

			var params = args.params;
			console.log("params : "+JSON.stringify(params));

			list=params.list;
			fk=params.fk;
			// NEW LIST - CODES POSTAL
			codes=[];

			if(list === "ville"){
				// VIDER LIST - ZIP CODES
				$scope.formData.zipCodes=[];
				// TABLE ASSOCIATION
				zip_ville=DataProvider.getZip_Ville();
				// TABLE CODES POSTAL
				zips=DataProvider.getZipCodes();
				for(var i=0; i<zip_ville.length; i++){
					if(Number(zip_ville[i]['ville']) === Number(fk)){
						// PARCOURIR LIST CODES POSTAL
						for(var j=0; j<zips.length; j++){
							if(Number(zips[j]['pk_user_code_postal']) === Number(zip_ville[i]['zip'])){
								zip={};
								zip.pk_user_code_postal=zips[j]['pk_user_code_postal'];
								zip.libelle=zips[j]['libelle'];
								codes.push(zip);
							}
						}
					}
				}

				// UPDATE ZIP CODES - GLOBAL
				$scope.formData.zipCodes=[];
				$scope.formData.zipCodes=codes;
				console.log("New $scope.formData.zipCodes : "+$scope.formData.zipCodes.length);

				// ENVOI AU AUTOCOMPLETE CONTROLLEUR
				//$rootScope.$broadcast('load-new-list', {newList: {codes}});
			}
		});**/

    $scope.$on('update-list-code', function(event, args){
      document.getElementById('ex2_value').value="";
      var params = args.params;
      console.log("params : "+JSON.stringify(params));

      var list =params.list;
      var pk_ville=params.fk;
      var pk_user_code_postal;
      var allZipCodes=DataProvider.getZipCodes();
      var allVilles=DataProvider.getVilles();
      var newZipCodes=[];
      for(var i=0; i<allVilles.length; i++) {
        if (allVilles[i]['pk_user_ville'] === pk_ville) {
          pk_user_code_postal = allVilles[i]['fk_user_code_postal'];
        }
      }
      console.log("fk_user_code_postal : "+pk_user_code_postal);
      for(var j=0; j<allZipCodes.length; j++){
        if (allZipCodes[j]['pk_user_code_postal'] === pk_user_code_postal) {
          newZipCodes.push(allZipCodes[j]);
        }
      }

      $scope.formData.zipCodes=newZipCodes;
      console.log("New $scope.formData.zipCodes : "+JSON.stringify($scope.formData.zipCodes));

      // ENVOI AU AUTOCOMPLETE CONTROLLEUR
      //$rootScope.$broadcast('load-new-list', {newList: {codes}});
    });

    $rootScope.$on('show-pop-up', function(event, args){

			var params = args.params;
			console.log("params : "+JSON.stringify(params));

			var popup = $ionicPopup.show({

			  template: "L'adresse de travail est-elle différente de l'adresse du siège social? <br>",
			  title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
			  buttons: [
				{
					text: '<b>Oui</b>',
					type: 'button-calm',
          onTap: function(e) {
            popup.close();
            $timeout( function () {
              if (!params.geolocated) {
                GeoService.getUserAddress()
                  .then(function () {
                    var popup1 = $ionicPopup.show({
                      //Votre géolocalisation pour renseigner votre adresse du siège social?
                      template: "Localisation: êtes-vous dans votre lieu de travail?<br>",
                      title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
                      buttons: [
                        {
                          text: '<b>Non</b>',
                          type: 'button-dark',
                          onTap: function (e) {
                            popup1.close();
                          }
                        }, {
                          text: '<b>Oui</b>',
                          type: 'button-calm',
                          onTap: function (e) {
                            popup1.close();
                            $timeout(function () {
                              var popup2 = $ionicPopup.show({
                                //Votre géolocalisation pour renseigner votre adresse du siège social?
                                template: "Si vous acceptez d'être localisé, vous n'aurez qu'à valider votre adresse de travail.<br>",
                                title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
                                buttons: [
                                  {
                                    text: '<b>Non</b>',
                                    type: 'button-dark',
                                    onTap: function (e) {
                                      popup2.close();
                                    }
                                  }, {
                                    text: '<b>Oui</b>',
                                    type: 'button-calm',
                                    onTap: function (e) {
                                      popup2.close();
                                      var geoAddress = localStorageService.get('user_address');
                                      console.log(geoAddress);
                                      $scope.formData.adresse1 = geoAddress.street;
                                      $scope.formData.adresse2 = geoAddress.complement;
                                      $scope.formData.num = geoAddress.num;
                                      $scope.formData.initialCity = geoAddress.city;
                                      $scope.formData.initialPC = geoAddress.postalCode;
                                      $scope.formData.addressTravail= geoAddress.fullAddress;
                                    }
                                  }
                                ]
                              });
                            });
                          }
                        }
                      ]
                    });
                  }, function (error) {
                    Global.showAlertValidation("Echec de geolocalisation 0 : "+error.message);
                  });
              }
            },1000);
          }
				},{
					text: '<b>Non</b>',
					type: 'button-dark',
					onTap: function(e){
            popup.close();
            $scope.formData.adresse1= params.adresse1;
						$scope.formData.adresse2= params.adresse2;
						$scope.formData.num= params.num;
						if(params.code)
							document.getElementById('ex2_value').value=params.code;
						if(params.vi)
							document.getElementById('ex3_value').value=params.vi;
            $scope.formData.initialCity = geoAddress.city;
            $scope.formData.initialPC = geoAddress.postalCode;
						$scope.updateAdresseTravEmployeur();
						// REDIRECTION VERS PAGE - COMPETENCES
						//$state.go('competence');
					}
				}
			 ]
		 });
		});

		$scope.$on("$ionicView.beforeEnter", function(scopes, states){
			if(states.fromCache && states.stateName == "adresseTravail" ){
				//$scope.initForm();

				// AFFICHE POPUP - SI JE VIENS
				if($ionicHistory.backView() === "adressePersonel"){}
				console.log("Je suis ds $ionicView.beforeEnter(adresseTravail)");

				var employeur=localStorageService.get('employeur');
				if(employeur){
					// INITIALISATION FORMULAIRE
					if(employeur['adresseTravail']){
						// INITIALISATION FORMULAIRE
						/**if(employeur['adresseTravail'].codePostal)
							document.getElementById('ex2_value').value=employeur['adresseTravail']['codePostal'];
						if(employeur.adresseTravail.ville)
							document.getElementById('ex3_value').value=employeur['adresseTravail']['ville'];**/
						if(employeur['adresseTravail']){
							$scope.formData['adresse1']=employeur['adresseTravail']['adresse1'];
							$scope.formData['adresse2']=employeur['adresseTravail']['adresse2'];
						}
					}
				}
			}
		});

		$scope.updateAutoCompleteZip= function(){
			console.log("zip : "+$scope.formData.zipCodeSelected.pk);
			var zipCodes=$scope.formData.zipCodes;
			// RECHERCHE LIBELLE
			for(var i=0; i<zipCodes.length; i++){
				if(zipCodes[i]['pk_user_code_postal'] === $scope.formData.zipCodeSelected.pk){
					$scope.formData.zipCodeSelected.libelle=zipCodes[i]['libelle'];
					break;
				}
			}

			if(typeof $scope.formData.codePostal === 'undefined')
				$scope.formData.codePostal={};
			$scope.formData.codePostal.originalObject={'pk_user_code_postal': $scope.formData.zipCodeSelected.pk, 'libelle': $scope.formData.zipCodeSelected.libelle};
			console.log("formData.codePostal : "+JSON.stringify($scope.formData.codePostal));
			document.getElementById('ex2_value').value=$scope.formData.zipCodeSelected['libelle'];
/*
			// VIDER LIST - VILLES
			$scope.formData.villes=[];
			var villes=DataProvider.getVilles();
			for(var i=0; i<villes.length; i++){
				if(villes[i]['fk_user_code_postal'] === $scope.formData.zipCodeSelected.pk)
					$scope.formData.villes.push(villes[i]);
			}

			// RE-INITIALISE INPUT VILLE
			document.getElementById('ex3_value').value='Villes';
			$scope.formData.ville={};

      */
		};

		$scope.updateAutoCompleteVille= function(){
			console.log("ville : "+$scope.formData.villeSelected.pk);
			var villes=$scope.formData.villes;
			// RECHERCHE LIBELLE
			for(var i=0; i<villes.length; i++){
				if(villes[i]['pk_user_ville'] === $scope.formData.villeSelected.pk){
					$scope.formData.villeSelected.libelle=villes[i]['libelle'];
					break;
				}
			}

			if(typeof $scope.formData.ville === 'undefined')
				$scope.formData.ville={};
			$scope.formData.ville.originalObject={'pk_user_ville': $scope.formData.villeSelected.pk, 'libelle': $scope.formData.villeSelected.libelle};
			console.log("formData.ville : "+JSON.stringify($scope.formData.ville));
			document.getElementById('ex3_value').value=$scope.formData.villeSelected['libelle'];
      $rootScope.$broadcast('update-list-code', {params: {'fk':$scope.formData.villeSelected.pk, 'list':'ville'}});

    }
	})
;
