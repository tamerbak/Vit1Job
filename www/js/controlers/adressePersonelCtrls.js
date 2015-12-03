/**
 * Created by Omar on 15/10/2015.
 */

starter

	.controller('adressePersonelCtrl', function ($scope, $rootScope, $cookieStore, $state, UpdateInServer,
			DataProvider, Validator, UserService, GeoService, $ionicPopup,localStorageService ){

		// FORMULAIRE
		$scope.formData = {};

		// RECUPERATION SESSION-ID & EMPLOYEUR-ID
		$scope.updateAdressePersEmployeur = function(){

			for(var obj in $scope.formData){
				//console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}
			/**if($scope.formData.codePostal !== null && typeof $scope.formData.codePostal !== 'undefined'){
				console.log("code postale: "+JSON.stringify($scope.formData.codePostal));
				console.log("postale: "+$scope.formData.codePostal.originalObject.pk_user_code_postal);
			}
			return;**/

			var codePostal="A", ville="A";
			if(typeof $scope.formData.codePostal !== 'undefined')
				if(typeof $scope.formData.codePostal.originalObject !== 'undefined')
					codePostal=Number($scope.formData.codePostal.originalObject.pk_user_code_postal);
			if(typeof $scope.formData.ville !== 'undefined')
				if(typeof $scope.formData.ville.originalObject !== 'undefined')
					ville=Number($scope.formData.ville.originalObject.pk_user_ville);
      var num = $scope.formData.num;
			var adresse1=$scope.formData.adresse1;
			var adresse2=$scope.formData.adresse2;

			console.log("codePostal: "+codePostal);
			console.log("ville : "+ville);

			// RECUPERATION CONNEXION
			connexion=$cookieStore.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
			console.log("$cookieStore.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=$cookieStore.get('sessionID');

			// TEST DE VALIDATION
			//if(codePostal !== '' && ville !== '' && adresse1 !== '' && adresse2 !== ''){
			if(!isNaN(codePostal) || !isNaN(ville) || adresse1 || adresse2 || num){
				if(!adresse1)
					adresse1='';
				if(!adresse2)
					adresse2='';
        if(!num)
          num='';

				UpdateInServer.updateAdressePersEmployeur(employeId, codePostal, ville, num, adresse1, adresse2, sessionId)
					.success(function (response){

						// DONNEES ONT ETE SAUVEGARDES
						console.log("les donnes ont été sauvegarde");
						console.log("response"+response);

						employeur=$cookieStore.get('employeur');
						if(!employeur)
							var employeur={};
						var adressePersonel={};
						adressePersonel={'codePostal': codePostal, 'ville': ville, 'num':num, 'adresse1': adresse1, 'adresse2': adresse2};
						employeur.adressePersonel=adressePersonel;

						// PUT IN SESSION
						$cookieStore.put('employeur', employeur);
						console.log("employeur : "+JSON.stringify(employeur));

						var code="", vi="";
						if(typeof $scope.formData.codePostal !== 'undefined')
							if(typeof $scope.formData.codePostal.originalObject !== 'undefined')
								code=$scope.formData.codePostal.originalObject.libelle;
						if(typeof $scope.formData.ville !== 'undefined')
							if(typeof $scope.formData.ville.originalObject !== 'undefined')
								vi=$scope.formData.ville.originalObject.libelle;

						// AFFICHE POPUP
						$rootScope.$broadcast('show-pop-up', {params:
							{
                'num': num,
								'adresse1': adresse1,
								'adresse2': adresse2,
								'vi': vi,
								'code': code
							}
								});
					}).error(function (err){
						console.log("error : insertion DATA");
						console.log("error In updateAdressePersEmployeur: "+err);
					});
			}
			// REDIRECTION VERS PAGE - ADRESSE TRAVAIL
			$state.go('adresseTravail');
		};

		// VALIDATION - FIELD
		$scope.validatElement=function(id){
			Validator.checkField(id);
		};

		$scope.$watch('formData.zipCodes', function(){
			console.log('hey, formData.zipCodes has changed!');
			//console.log('zipCodes.length : '+$scope.formData.zipCodes.length);
		});

		$scope.$on('update-list-ville', function(event, args){

			var params = args.params;
			console.log("params : "+JSON.stringify(params));

			var list =params.list;
			var fk=params.fk;
			// NEW LIST - VILLES
			vls=[];

			if(list === "postal"){
				// VIDER LIST - VILLES
				$scope.formData.villes=[];

				allVilles=DataProvider.getVilles();
				villes=[];
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
    $scope.$on('update-list-code', function(event, args){
      var params = args.params;
      console.log("params : "+JSON.stringify(params));

      var list =params.list;
      var pk_ville=params.fk;
      var pk_user_code_postal;
      allZipCodes=DataProvider.getZipCodes();
      allVilles=DataProvider.getVilles();
      newZipCodes=[];
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


    $scope.initForm=function(){
			/**var elm = angular.element(document.querySelector('#ex0_value'));
			elm.val("Ville");**/
			$scope.formData.zipCodes=DataProvider.getZipCodes();
			$scope.formData.villes=DataProvider.getVilles();
		};

		$scope.$on("$ionicView.beforeEnter", function( scopes, states ){
			if(states.stateName == "adressePersonel" ){ //states.fromCache &&
				$scope.initForm();
				console.log("Je suis ds $ionicView.beforeEnter(adressePersonel)");
				//employeur=$cookieStore.get('employeur');
				if(isNaN($scope.formData.codePostal) && isNaN($scope.formData.ville) && !$scope.formData.adresse1 && !$scope.formData.adresse2 && !$scope.formData.num){
					// INITIALISATION FORMULAIRE
						GeoService.getUserAddress()
								.then(function() {
									var myPopup = $ionicPopup.show({
										//Votre géolocalisation pour renseigner votre adresse du siège social?
										template: "Pour remplir rapidement votre adresse du siège social, veuillez vous localiser <br>",
										title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
										buttons: [
											{
												text: '<b>Non</b>',
												type: 'button-dark'
											},{
												text: '<b>Oui</b>',
												type: 'button-calm',
												onTap: function(e){
													var geoAddress = localStorageService.get('user_address');
													$scope.formData.adresse1 = geoAddress.street;
													$scope.formData.adresse2 = geoAddress.complement;
													$scope.formData.num = geoAddress.num;
													$scope.formData.initialCity = geoAddress.city;
													$scope.formData.initialPC = geoAddress.postalCode;
												}
											}
										]
									});
								}, function(error) {
								});

					/**if(employeur['adressePersonel'].codePostal)
					 *  document.getElementById('ex0_value').value=employeur['adressePersonel']['codePostal'];
					 *  if(employeur.adresseTravail.ville)
					 *  document.getElementById('ex1_value').value=employeur['adressePersonel']['ville'];
					 *  if(employeur['adressePersonel']){
					 *  $scope.formData['adresse1']=employeur['adressePersonel']['adresse1'];
					 *  $scope.formData['adresse2']=employeur['adressePersonel']['adresse2'];
					 *  $scope.formData['num']=employeur['adressePersonel']['num'];
					 *  **/
				}
			}


			/**
			 * employeur=$cookieStore.get('employeur');
			 * if(employeur && employeur['adressePersonel']){
			 * // INITIALISATION FORMULAIRE
			 * if(employeur['adressePersonel'].codePostal)
			 * scope.formData.codePostal=employeur.adressePersonel.codePostal;
			 * if(employeur['adressePersonel'].ville)
			 * $scope.formData.ville=employeur.adressePersonel.ville;
			 * if(employeur['adressePersonel']){
			 * $scope.formData.adresse1=employeur['adressePersonel'].adresse1;
			 * $scope.formData.adresse2=employeur['adressePersonel'].adresse2;
			 * }}
			 **/
			}
		);

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
			document.getElementById('ex0_value').value=$scope.formData.zipCodeSelected['libelle'];
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
			document.getElementById('ex1_value').value=$scope.formData.villeSelected['libelle'];
		}


    $scope.$on('show-pop-up-geo', function(event, args) {
      ///

      var params = args.params;
      console.log("params : "+JSON.stringify(params));

      var myPopup = $ionicPopup.show({

        template: "Votre géolocalisation pour renseigner votre adresse du siège social? <br>",
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        buttons: [
          {
            text: '<b>Non</b>',
            type: 'button-dark'
          },{
            text: '<b>Oui</b>',
            type: 'button-calm',
            onTap: function(e){
              $scope.formData.adresse1= params.adresse1;
              $scope.formData.adresse2= params.adresse2;
              $scope.formData.num= params.num;
              if(params.code)
                document.getElementById('ex2_value').value=params.code;
              if(params.vi)
                document.getElementById('ex3_value').value=params.vi;
            }
          }
        ]
      });
    });
	});
