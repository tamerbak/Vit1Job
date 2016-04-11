/**
 * Created by Omar on 14/10/2015.
 */
'use strict';
starter
  .controller('saisieCiviliteEmployeurCtrl', function ($scope, $rootScope, localStorageService, $state, $stateParams, UpdateInServer, UploadFile, $base64,
                                                       LoadList, formatString, DataProvider, Validator, $ionicPopup, $cordovaCamera) {

    //change input according to platform


    $scope.isIOS = ionic.Platform.isIOS();
    $scope.isAndroid = ionic.Platform.isAndroid();
    var steps = localStorageService.get('steps');

    $scope.showFileDialog = function () {
      document.getElementById('image').click();

    };

    // FORMULAIRE
    $scope.formData = {};
    $scope.siretValide = true;
    $scope.apeValide = true;
    // IMAGE
    $scope.formData.image = {};

    $scope.validateSiret = function (id) {
      $scope.siretValide = Validator.checkSiret(id, $scope.formData.siret);

    };
    // alert msg APN
    $scope.displayApNTooltip = function () {
      $scope.showPwdTooltip = true;
    };
    $scope.apnIsValid = function () {
      if ($scope.formData.ape != undefined) {
        if (Number($scope.formData.ape.length) >= 5) {

          return true;
        }
        else
          return false;
      }
      else
        return false;


    };
    $scope.apehidepopup = function () {
      $scope.showPwdTooltip = false;
    };


    $scope.validateApe = function (id) {
      $scope.apeValide = Validator.checkApe(id, $scope.formData.ape);
    };
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });
    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
      // console.log(states.fromCache+"  state : "+states.stateName);
      if (states.stateName == "menu.infoTabs.saisieCiviliteEmployeur") {
        $scope.disableTagButton = (localStorageService.get('steps') != null) ? {'visibility': 'hidden'} : {'visibility': 'visible'};
        steps = (localStorageService.get('steps') != null) ? localStorageService.get('steps') : '';

        if (steps != '' && steps.state && steps.step1) {
          $scope.isContractInfo = true;
          $scope.title = "Pré-saisie des informations contractuelles : fiche employeur";
          $ionicPopup.show({
            title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
            template: 'Veuillez remplir les données suivantes, elle seront utilisées dans le processus du contractualisation.',
            buttons: [
              {
                text: '<b>OK</b>',
                type: 'button-dark',
                onTap: function (e) {
                }
              }
            ]
          });

          steps.step1 = false;
          localStorageService.set("steps", steps);
        } else {
          $scope.isContractInfo = false;
          $scope.title = "Fiche employeur";
        }
      }
    });
    $scope.updateCiviliteEmployeur = function () {

      var currentEmployer = localStorageService.get('currentEmployer');
      var employerId = currentEmployer.employerId;
      var enterpriseId = currentEmployer.entreprises[0].entrepriseId;

      var titre = $scope.formData.civilite.libelle;
      var nom = $scope.formData.nom;
      var prenom = $scope.formData.prenom;
      var entreprise = $scope.formData.entreprise;
      var siret = $scope.formData.siret;
      var ape = $scope.formData.ape;
      var numUssaf = $scope.formData.numUssaf;
      var imgUri = $scope.imgURI;

      // RECUPERATION CONNEXION
      var connexion = localStorageService.get('connexion');
      // RECUPERATION EMPLOYEUR ID
      var employeId = connexion.employeID;
      // console.log("localStorageService.get(connexion) : "+JSON.stringify(connexion));
      // RECUPERATION SESSION ID
      var sessionId = localStorageService.get('sessionID');

      if (titre || nom || prenom || entreprise || siret || ape || numUssaf || imgUri) {
        if (!titre)
          titre = "";
        if (!nom)
          nom = "";
        if (!prenom)
          prenom = "";
        if (!entreprise)
          entreprise = "";
        if (!siret)
          siret = "";
        else {
          if (!$scope.siretValide) {
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
        if (!ape)
          ape = "";
        if (!numUssaf)
          numUssaf = "";
        if (!imgUri)
          imgUri = 'none';

        var user = {"email": "cmFjaGlkQHRlc3QuY29t", "password": "MTIzNDU2", "role": "ZW1wbG95ZXVy"};
        // UPDATE EMPLOYEUR
        UpdateInServer.updateCiviliteInEmployeur(
          user, titre, nom, prenom, entreprise, siret, ape, numUssaf, sessionId, employerId, enterpriseId, imgUri)
          .success(function (response) {

            // DONNEES ONT ETE SAUVEGARDES
            console.log("response" + response);

            var employeur = localStorageService.get('currentEmployer');
            if (!employeur)
              employeur = {};

            employeur.titre = titre;
            employeur.nom = nom;
            employeur.prenom = prenom;
            //employeur.entreprises = [];
            employeur.entreprises[0].name = entreprise;
            employeur.entreprises[0].siret = siret;
            employeur.entreprises[0].naf = ape;
            //employeur.entreprises[0].urssaf = numUssaf;

            // PUT IN SESSION
            localStorageService.set('currentEmployer', employeur);

            if (imgUri) {
              UpdateInServer.uploadPhoto(imgUri, employerId, 'employeur','scan','upload')
                .success(
                function (response) {
                  console.log("Photo uploaded !");
                  employeur.scan = imgUri;
                  // PUT IN SESSION
                  localStorageService.set('currentEmployer', employeur);
                }
              ).error(
                function (error) {
                  console.log("Photo upload error !");
                }
              )
            }


          }
        ).
          error(function (err) {
            console.log("error : insertion DATA");
            console.log("error In updateCiviliteInEmployeur: " + err);
          });
      }

      // UPLOAD IMAGE
      /*if ($scope.formData.imageEncode) {

        // console.log("image name : "+$scope.formData.imageName);
        //console.log("image en base64 : "+$scope.formData.imageEncode);
        // console.log("image en base64 : "+$scope.formData.imageEncode);
        // ENVOI AU SERVEUR
        //UploadFile.uploadFile($scope.formData.imageName, $scope.formData.imageEncode.split(',')[1], employeId)
        UploadFile.uploadFile("user_employeur", $scope.formData.imageName, $scope.formData.imageEncode, employeId)
          .success(function (response) {

            // FILE A ETE BIEN TRANSFERE
            console.log("File est bien uploadé");
            console.log("response : " + response);

          }).error(function (err) {
            console.log("error : upload File");
            console.log("error In UploadFile.uploadFile(): " + err);
          });
      }*/

      // REDIRECTION VERS PAGE - ADRESSE PERSONEL
      if (steps) {
        console.log(steps);
        if (steps.step2) {
          $state.go('menu.infoTabs.adressePersonel');
        }
        else if (steps.step3) {
          $state.go('menu.infoTabs.adresseTravail');
        }
        else {
          $state.go('menu.contract');
        }

      }
      else {
        console.log("else" + steps);
        $state.go('menu.infoTabs.adressePersonel');
      }
    }
    ;

    if (!$scope.items)
      $scope.items = [];

    $scope.selectImage = function () {
      /*onSuccess = function (imageURI) {
       $scope.imgURI = imageURI;
       $state.go($state.current, {}, {reload: true});
       }
       onFail = function (message) {
       console.log('An error occured: ' + message);
       }*/
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: true
        //targetWidth: 100,
        //targetHeight: 100
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {

        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        //console.log("imageURI (Android) : " + "content://media/internal/images/media/" + $scope.imgURI.split("%3A")[1]);
        // console.log("imageURI : "+$scope.imgURI);
        //$state.go($state.current, {}, {reload: true});

        window.resolveLocalFileSystemURL("content://media/internal/images/media/" + $scope.imgURI.split("%3A")[1], function (fileEntry) {

          //If this doesn't work
          $scope.image = fileEntry.nativeURL;
          console.log("ResolveLocalFileSystem" + $scope.image);
          //Try this
          //var image = document.getElementById('myImage');
          //image.src = fileEntry.nativeURL;
        });


        $scope.items.push({
          src: $scope.imgURI,//'http://www.wired.com/images_blogs/rawfile/2013/11/offset_WaterHouseMarineImages_62652-2-660x440.jpg',
          sub: 'This is a <b>subtitle</b>'
        });

      }, function (err) {
        console.log('An error occured: ' + message);
      });
    };

    $scope.getPhotoFromAlbum = function () {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(function (imageURI) {
        $scope.imgURI = "data:image/jpeg;base64," + imageURI;
        var employeur = localStorageService.get('currentEmployer');
        employeur.scan = $scope.imgURI;
        localStorageService.set('currentEmployer', employeur);
      }, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY, //Camera.PictureSourceType.PHOTOLIBRARY
        saveToPhotoAlbum: true
      });
    };

    $scope.getPhotoFromCamera = function () {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(
        function (imageURI) {
          $scope.imgURI = "data:image/jpeg;base64," + imageURI;
          var employeur = localStorageService.get('currentEmployer');
          employeur.scan = $scope.imgURI;
          localStorageService.set('currentEmployer', employeur);
        },
        onFail,
        {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          correctOrientation: true,
          sourceType: Camera.PictureSourceType.Camera, //Camera.PictureSourceType.PHOTOLIBRARY
          saveToPhotoAlbum: true
        });
    };

    function onFail() {
      console.log("Erreur de chargement de photo");
    }

    /*function onPhotoURISuccess(imageURI) {

     $scope.imgURI = "data:image/jpeg;base64," + imageURI;
     }

     function onPhotoURISuccess2(imageURI) {
     var base64String;
     window.resolveLocalFileSystemURI(imageURI,

     function (fileEntry) {
     console.log(fileEntry.name);
     },
     function (FileError) {
     console.log(FileError);
     }
     );

     }*/

    $scope.loadImage = function (img) {

      // console.log("files.length : "+img.files.length);
      // console.log("files[0] : "+img.files[0]);

      function el(id) {
        var elem = document.getElementById(id);
        if (typeof elem !== 'undefined' && elem !== null) {
          return elem;
        }
      } // Get elem by ID

      if (img.files && img.files[0]) {

        var FR = new FileReader();
        FR.onload = function (e) {
          // RECUPERE FILE-NAME
          $scope.formData.imageName = img.files[0].name;
          // RECUPERE ENCODAGE-64
          $scope.formData.imageEncode = e.target.result;
          console.log("imageEncode (iOS) : " + e.target.result);
        };
        FR.readAsDataURL(image.files[0]);
        //$scope.$apply(function(){});

        FR.onload = function (oFREvent) {
          document.getElementById("uploadPreview").src = oFREvent.target.result;
          $scope.imgURI = oFREvent.target.result;
          console.log("imageURI (iOS) : " + $scope.imgURI);
          //$state.go($state.current, {}, {reload: true});
        };
      }
    };

    $scope.validatElement = function (id) {
      Validator.checkField(id);
    };

    $scope.initForm = function () {
      // GET LIST
      $scope.formData = {'civilites': DataProvider.getCivilites()};
      $scope.formData.civ = "Titre";
      // console.log('$scope.formData.civ = '+$scope.formData.civ);
      $scope.formData.nationalite = "Nationalité";
    };

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
      if (states.stateName == "menu.infoTabs.saisieCiviliteEmployeur") {
        $scope.initForm();
        var employeur = localStorageService.get('currentEmployer');
        if (employeur) {
          // INITIALISATION FORMULAIRE
          if (employeur.titre) {
            var civiliteArray = $.grep($scope.formData.civilites, function (e) {
              return e.libelle == employeur.titre;
            });
            $scope.formData.civilite = civiliteArray.length == 1 ? civiliteArray[0] : "";
          }
          if (employeur.nom)
            $scope.formData.nom = employeur.nom;
          if (employeur.prenom)
            $scope.formData.prenom = employeur.prenom;
          if (employeur.entreprises[0]) {
            $scope.formData.entreprise = employeur.entreprises[0].name;
            $scope.formData.siret = employeur.entreprises[0].siret;
            $scope.formData.ape = employeur.entreprises[0].naf;
            //$scope.formData.numUssaf = employeur.entreprises[0].urssaf;
          }

          //Load image if exist :
          if (employeur.scan && !(employeur.scan.replace('data:image/jpeg;base64,','') == 'undefined')) {
            $scope.imgURI = employeur.scan;
          } else {
            UpdateInServer.uploadPhoto('', employeur.employerId, 'employeur','scan','get')
              .success(
              function (response) {
                console.log("Photo uploaded !");
                if (!(response[0].value == undefined)){
                  //var fichier  = JSON.parse(response[0].value);
                  var tkherbi9 = response[0].value.split("\"")[3];
                  employeur.scan = "data:image/jpeg;base64," + tkherbi9;
                  // PUT IN SESSION
                  localStorageService.set('currentEmployer', employeur);
                  $scope.imgURI = employeur.scan;
                } else console.log("Photo non récupérée");
              }
            ).error(
              function (error) {
                console.log("Photo upload error !");
              }
            );
          }
        }
      }
    });

    $scope.takePicture = function () {

      // console.log("Je suis ds takePicture() ");
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
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        console.log("imageData : " + imageData);
        //$state.go($state.current, {}, {reload: true});
      }, function (err) {
        console.log(err);
      });
    };
    /*$scope.skipDisabled= function(){
     var employeur=localStorageService.get('currentEmployer');
     return $scope.isContractInfo && (!employeur || !employeur.entreprise[0].urssaf || !employeur.entreprise[0].naf || !employeur.entreprise[0].siret || !employeur.nom || !employeur.prenom || !employeur.entreprise[0].name || !employeur.titre);
     };*/
  }
)
;
