/**
 * Created by Omar on 14/10/2015.
 */
'use strict';
starter
	.controller('saisieCiviliteEmployeurCtrl', function ($scope, $rootScope, localStorageService, $state,$stateParams, UpdateInServer, UploadFile, $base64,
				LoadList, formatString, DataProvider, Validator, $ionicPopup, $cordovaCamera){

		//change input according to platform
		

		$scope.isIOS = ionic.Platform.isIOS();
  		$scope.isAndroid = ionic.Platform.isAndroid();

  		$scope.showFileDialog = function() {
  			document.getElementById('image').click();

  		};

		// FORMULAIRE
		$scope.formData = {};
    $scope.siretValide =true;
    $scope.apeValide =true;
		// IMAGE
		$scope.formData.image={};

    $scope.validateSiret= function(id){
      $scope.siretValide =Validator.checkSiret(id,$scope.formData.siret);

    };
    $scope.validateApe= function(id){
      $scope.apeValide = Validator.checkApe(id,$scope.formData.ape);
    };
$scope.$on("$ionicView.beforeEnter", function(scopes, states){
  console.log(states.fromCache+"  state : "+states.stateName);
  if(states.stateName == "saisieCiviliteEmployeur" ){
    $scope.disableTagButton = (localStorageService.get('steps')!=null)?{'visibility': 'hidden'}:{'visibility': 'visible'};
    var steps =  (localStorageService.get('steps')!=null) ? JSON.parse(localStorageService.get('steps')) : '';
    console.log("steps : "+steps);
    if(steps!='')
    {
      $scope.title="Pré-saisie des informations contractuelles : civilité";
      $scope.isContractInfo=true;
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
    }else{
    	$scope.isContractInfo=false;
    	$scope.title="Saisie de la civilité";
    }
	}
});
		$scope.updateCiviliteEmployeur = function(){

			for(var obj in $scope.formData){
				console.log("formData["+obj+"] : "+$scope.formData[obj]);
			}

			var titre=$scope.formData.civ;
			var nom=$scope.formData.nom;
			var prenom=$scope.formData.prenom;
			var entreprise=$scope.formData.entreprise;
			var siret=$scope.formData.siret;
			var ape=$scope.formData.ape;
			var numUssaf=$scope.formData.numUssaf;

			// RECUPERATION CONNEXION
			var connexion=localStorageService.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
			console.log("localStorageService.get(connexion) : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			var sessionId=localStorageService.get('sessionID');

			if(!isNaN(titre) || nom || prenom || entreprise || siret || ape || numUssaf){
				if(!nom)
					nom="";
				if(!prenom)
					prenom="";
				if(!entreprise)
					entreprise="";
				if(!siret)
					siret="";
        else{
          if(!$scope.siretValide){
            var myPopup = $ionicPopup.show({
              template: "Le format du SIRET est incorrect <br>",
              title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
              buttons: [
                {
                  text: '<b>Non</b>',
                  type: 'button-dark'
                }
              ]
            });
            return;
          }

        }
				if(!ape)
					ape="";
				if(!numUssaf)
					numUssaf="";

				// UPDATE EMPLOYEUR
				UpdateInServer.updateCiviliteInEmployeur(
					Number(employeId), Number(titre), nom, prenom, entreprise, siret, ape, numUssaf, sessionId)
						.success(function (response){

							// DONNEES ONT ETE SAUVEGARDES
							console.log("les donnes ont été sauvegarde");
							console.log("response"+response);

							var employeur=localStorageService.get('employeur');
							if(!employeur)
								employeur={};

							employeur.civilite=titre;
							employeur.nom=nom;
							employeur.prenom=prenom;
							employeur.entreprise=entreprise;
							employeur.siret=siret;
							employeur.ape=ape;
							employeur.numUssaf=numUssaf;

							console.log("employeur : "+JSON.stringify(employeur));
							// PUT IN SESSION
							localStorageService.set('employeur', employeur);

						}).error(function (err){
							console.log("error : insertion DATA");
							console.log("error In updateCiviliteInEmployeur: "+err);
						});
			}

			// UPLOAD IMAGE
			if($scope.formData.imageEncode){

				console.log("image name : "+$scope.formData.imageName);
				//console.log("image en base64 : "+$scope.formData.imageEncode);
				console.log("image en base64 : "+$scope.formData.imageEncode);
				// ENVOI AU SERVEUR
				//UploadFile.uploadFile($scope.formData.imageName, $scope.formData.imageEncode.split(',')[1], employeId)
				UploadFile.uploadFile("user_employeur", $scope.formData.imageName, $scope.formData.imageEncode, employeId)
					.success(function (response){

						// FILE A ETE BIEN TRANSFERE
						console.log("File est bien uploadé");
						console.log("response : "+response);

					}).error(function (err){
						console.log("error : upload File");
						console.log("error In UploadFile.uploadFile(): "+err);
					});
			}

			/*** LOAD LIST ZIP-CODE
			codePostals=localStorageService.get('zipCodes');
			if(!codePostals){
				LoadList.loadZipCodes(sessionId)
					.success(function (response){
							resp=formatString.formatServerResult(response);
							// DONNEES ONT ETE CHARGES
							console.log("les ZipCodes ont été bien chargé");
							zipCodesObjects=resp.dataModel.rows.dataRow;

							if(typeof zipCodesObjects === 'undefined' || zipCodesObjects.length<=0 || zipCodesObjects===""){
								console.log('Aucune résultat trouvé');
								// PUT IN SESSION
								localStorageService.set('zipCodes', []);
								return;
							}

							// GET ZIP-CODE
							zipCodes=[];
							zipCode={}; // zipCode.libelle | zipCode.id

							zipCodesList=[].concat(zipCodesObjects);
							console.log("zipCodesList.length : "+zipCodesList.length);
							for(var i=0; i<zipCodesList.length; i++){
								object=zipCodesList[i].dataRow.dataEntry;

								// PARCOURIR LIST PROPERTIES
								zipCode[object[0].attributeReference]=object[0].value;
								zipCode[object[1].attributeReference]=object[1].value;

								if(zipCode)
									zipCodes.push(zipCode);
								zipCode={}
							}

							console.log("zipCodes.length : "+zipCodes.length);
							// PUT IN SESSION
							//localStorageService.set('zipCodes', zipCodes);
							console.log("zipCodes : "+JSON.stringify(zipCodes));
						}).error(function (err){
							console.log("error : LOAD DATA");
							console.log("error in loadZipCodes : "+err);
						});
			}***/

			// REDIRECTION VERS PAGE - ADRESSE PERSONEL
      $state.go('adressePersonel');
		};
		

    $scope.selectImage = function() {
    	/*onSuccess = function (imageURI) {
	        $scope.imgURI = imageURI;
	        $state.go($state.current, {}, {reload: true});
	      }
	    onFail = function (message) {
	      console.log('An error occured: ' + message);
	  }*/
      var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 100,
                    targetHeight: 100
                };

      $cordovaCamera.getPicture(options).then(function(imageData){
				$scope.imgURI = "data:image/jpeg;base64," + imageData;;
				console.log("imageURI : "+$scope.imgURI);
				$state.go($state.current, {}, {reload: true});

			}, function(err) {
				console.log('An error occured: ' + message);
			});
    };
  /*
    $scope.selectImage = function() {
      console.log("selectImage");
      document.getElementById('image').click();
    };
*/
		$scope.loadImage=function(img){

			console.log("files.length : "+img.files.length);
			console.log("files[0] : "+img.files[0]);

			function el(id){
				var elem = document.getElementById(id);
				if(typeof elem !== 'undefined' && elem !== null){
					return elem;
				}
			} // Get elem by ID

			if(img.files && img.files[0]){

				var FR= new FileReader();
				FR.onload = function(e){
					// RECUPERE FILE-NAME
					$scope.formData.imageName=img.files[0].name;
					// RECUPERE ENCODAGE-64
					$scope.formData.imageEncode=e.target.result;
				};
				FR.readAsDataURL(image.files[0]);
				//$scope.$apply(function(){});

        FR.onload = function (oFREvent) {
          document.getElementById("uploadPreview").src = oFREvent.target.result;
          $scope.imgURI = oFREvent.target.result;
          $state.go($state.current, {}, {reload: true});
        };
			}
		};

		$scope.validatElement=function(id){
			Validator.checkField(id);
		};

		$scope.initForm=function(){
			// GET LIST
			$scope.formData={'civilites': DataProvider.getCivilites()};
			$scope.formData.civ="Titre";
			console.log('$scope.formData.civ = '+$scope.formData.civ);
			$scope.formData.nationalite="Nationalité";						
		};

		$scope.$on("$ionicView.beforeEnter", function(scopes, states){
			if(states.fromCache && states.stateName == "saisieCiviliteEmployeur"){
				$scope.initForm();

				console.log("Je suis ds $ionicView.beforeEnter(saisieCivilite)");
			  var employeur=localStorageService.get('employeur');
				console.log("employeur : "+JSON.stringify(employeur));
				if(employeur){
					// INITIALISATION FORMULAIRE
					if(employeur.civilite)
						$scope.formData.civ=employeur.civilite;
					if(employeur.nom)
						$scope.formData.nom=employeur.nom;
					if(employeur.prenom)
						$scope.formData.prenom=employeur.prenom;
					if(employeur.entreprise)
						$scope.formData.entreprise=employeur.entreprise;
					if(employeur.siret)
						$scope.formData.siret=employeur.siret;
					if(employeur.ape)
						$scope.formData.ape=employeur.ape;
					if(employeur.numUssaf)
						$scope.formData.numUssaf=employeur.numUssaf;
				}
			}
		});

		$scope.takePicture = function(){

			console.log("Je suis ds takePicture() ");
			var options = {
				quality: 75,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 100,
				targetHeight: 100,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation:true
			};

			$cordovaCamera.getPicture(options).then(function(imageData){
				$scope.imgURI = "data:image/jpeg;base64," + imageData;
				console.log("imageData : "+imageData);
				$state.go($state.current, {}, {reload: true});
			}, function(err) {
				console.log(err);
			});
		}
	});
