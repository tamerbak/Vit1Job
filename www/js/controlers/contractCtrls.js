/**
 * Created by mourad sadiq on 12/6/2015.
 */
'use strict';

starter.controller('contractCtrl', function ($scope, localStorageService, $stateParams, DataProvider, $ionicActionSheet, $ionicPopup, $state, $cordovaPrinter, AuthentificatInServer,$http ) {

  var employeur;
  var jobyer;
  // An alert dialog
  $scope.showAlert = function () {
    //printing the pdf
    /*if (ionic.Platform.isAndroid() && ionic.Platform.version() <= 4.2) {
     var alertPopup1 = $ionicPopup.show({
     title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
     template: "Pour imprimer votre contrat, ou le sauvegarder comme PDF, veuillez configurer les paramètres d'impression de votre telephone",
     buttons: [
     {
     text: '<b>OK</b>',
     type: 'button-dark',
     onTap: function (e) {
     }
     }
     ]
     });
     alertPopup1.then(function () {
     var alertPopup = $ionicPopup.show({
     title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
     template: 'Succés: Vous avez bien établi un contrat avec ' + jobyer.jobyerName,
     buttons: [
     {
     text: '<b>OK</b>',
     type: 'button-dark',
     onTap: function (e) {
     }
     }
     ]
     });
     alertPopup.then(function () {
     $state.go("menu.app");
     });
     });
     } else {*/

    console.log(ionic.Platform.version());

    //var markup = document.documentElement.innerHTML;
    //var jsMarkup = html2json(markup);
    var contract = document.getElementById('printableContent');
    //var markup = contract.innerHTML;

    /*if ($cordovaPrinter.isAvailable().length !== 0) {
     //Print contract then send it to yousign service :
     $cordovaPrinter.print(contract);

     jobyerService.signature(employeur, jobyer, contract).success(signtaureSuccess).error(onError);

     var alertPopup = $ionicPopup.show({
     title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
     template: 'Succés: Vous avez bien établi un contrat avec ' + jobyer.jobyerName,
     buttons: [
     {
     text: '<b>OK</b>',
     type: 'button-dark',
     onTap: function (e) {
     }
     }
     ]
     });
     alertPopup.then(function () {
     $state.go("app");
     });
     } else {
     var alertPopup1 = $ionicPopup.show({
     title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
     template: "Pour imprimer votre contrat, ou le sauvegarder comme PDF, veuillez configurer les paramètres d'impression de votre telephone",
     buttons: [
     {
     text: '<b>OK</b>',
     type: 'button-dark',
     onTap: function (e) {
     }
     }
     ]
     });
     alertPopup1.then(function () {
     var alertPopup = $ionicPopup.show({
     title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
     template: 'Succés: Vous avez bien établi un contrat avec ' + jobyer.jobyerName,
     buttons: [
     {
     text: '<b>OK</b>',
     type: 'button-dark',
     onTap: function (e) {
     }
     }
     ]
     });
     alertPopup.then(function () {
     $state.go("app");
     });
     });
     }*/
    $scope.hideiFrame = false;
    AuthentificatInServer.yousignService(employeur, jobyer).success(signtaureSuccess).error(onError);
    //signtaureSuccess("");

    //}


  };
  $scope.showMenuForEditContract = function () {
    var steps = localStorageService.get('steps');
    console.log(steps);

    var hideSheet = $ionicActionSheet.show({
      buttons: [
        {text: 'Civilité'}, //Index = 0
        {text: 'Siège social'}, //Index = 1
        {text: 'Adresse de travail'} //Index = 2
      ],
      titleText: 'Editer le contrat',
      cancelText: 'Annuler',
      cssClass: (ionic.Platform.isAndroid() ? 'android-sheet-vitonjob' : 'ios-sheet-vitonjob'),
      buttonClicked: function (index) {

        var employeur = localStorageService.get('currentEmployer');
        if (index == 0) {
          $state.go("menu.infoTabs.saisieCiviliteEmployeur", {employeur: employeur});
        }
        if (index == 1) {
          $state.go("menu.infoTabs.adressePersonel", {employeur: employeur});
        }
        if (index == 2) {

          $state.go("menu.infoTabs.adresseTravail", {employeur: employeur});
        }
        //branchement de la page de contrat ou infos clients

        return true;
      }
    });
  };
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

    viewData.enableBack = true;
    $scope.showiFrame = false;
    $scope.hideiFrame = true;

    employeur = localStorageService.get('currentEmployer');
    console.log(employeur);
    jobyer = localStorageService.get('Selectedjobyer');
    if (!jobyer) jobyer = $stateParams.jobyer;
    //var civilites = DataProvider.getCivilites();
    var civilite = employeur.titre;
    /*for (var i in civilites) {
     if (civilites[i].libelle == employeur.titre)
     civilite = civilites[i].libelle;
     }*/
    $scope.societe = employeur.entreprises[0].name;
    $scope.contact = civilite + " " + employeur.nom + " " + employeur.prenom;
    //var adrTrv = employeur.adresseTravail;
    //$scope.lieu = adrTrv.fullAddress;
    //var jobyer = $stateParams.jobyer;
    $scope.firstNameJ = jobyer.prenom;
    $scope.lastNameJ = jobyer.nom;

  });

  var signtaureSuccess = function (data) {
    if (data == null || data.length == 0) {
      console.log("Yousign result is null");
      return;
    }
    var sdata = data[0]['value'];
    var youSign = JSON.parse(sdata);
    console.log(youSign);

    /*var resutTest = {
     "idDemand": "36463",
     "iFrameURLs": [
     {
     "email": "account@mail.com",
     "iFrameURL": "https://demo.yousign.fr/public/ext/cosignature/lXAtkf74F3cPXoahQ0qSGw1q6AoFf9iPZYS0lcji"
     },
     {
     "email": "soulat@jobyer.com",
     "iFrameURL": "https://demo.yousign.fr/public/ext/cosignature/4U8xrFBv683iMJ2398sNzYGPa43g2AsGWk8T2HZu"
     }],
     "status": "success"
     };*/

    //cordova.InAppBrowser.open(youSign.iFrameURLs[0].iFrameURL);

    var urlSuccess = window.location.protocol.replace(":", "%3A") + "%2F%2F" +
      window.location.host + "%2F" +
      window.location.pathname.replace("/", "%2F");
    //+ "?urlsuccess="+urlSuccess
    $scope.showiFrame = true;
    $scope.hideiFrame = false;
    var link = youSign.iFrameURLs[0].iFrameURL;
    //"https://demo.yousign.fr/public/cosignature/fBIcrK6aJgL5J3NXSvFxyLMve18Zw9LqJHXVtGJd?tpl=e9ecb0d279aaed5495890bfc84020501";
    var iframe = document.createElement('iframe');
    iframe.frameBorder = 0;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.id = "youSign";
    iframe.style.overflow = "hidden";
    iframe.style.height = "100%";
    iframe.style.width = "100%";
    iframe.setAttribute("src", link);


    $(iframe).appendTo($("#iframPlaceHolder"));

    //$state.go('contract');
    //location.reload();


    //$state.go('profile', {"link" : youSign.iFrameURLs[0].iFrameURL});


    // Send notification to jobyer
    var jobyer = localStorageService.get('Selectedjobyer');

    // Define relevant info
    var jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwMzI1NGY3Ny0wNDNlLTQ2NGQtYTYwNS1hM2UwMzE5MzBhMTMifQ.ebmk18wbIs6dLVa8UP8kdWHHJpy7d2ft2Y8hRc3FNhw';
    var tokens = [jobyer.deviceToken];
    var profile = 'commanaonavitonjobemployeur';

    console.log(JSON.stringify(jobyer));
// Build the request object
    var req = {
      method: 'POST',
      url: 'https://api.ionic.io/push/notifications',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
      },
      data: {
        "tokens": tokens,
        "profile": profile,
        "notification": {
          "title": "Contrat",
          "message": "Veuillez signer le contrat",
          "android": {
            "title": "Contrat",
            "message": "Veuillez signer le contrat",
            //"icon": "img/vit1job-mini.png",
            "payload": {
              "url": youSign.iFrameURLs[1].iFrameURL
            }
          },
          "ios": {
            "title": "Contrat",
            "message": "Veuillez signer le contrat",
            "payload": {
              "url": youSign.iFrameURLs[1].iFrameURL
            }
          }
        }
      }
    };

// Make the API call
    $http(req).success(function (resp) {
      // Handle success
      console.log("Ionic Push: Push success", resp);
    }).error(function (error) {
      // Handle error
      console.log("Ionic Push: Push error", error);
    });

  };

  var onError = function (data) {
    console.log(data);
  };


  //document.addEventListener("deviceready", $scope.showAlert, false);
});
