/**
 * Created by mourad sadiq on 12/6/2015.
 */
'use strict';

starter.controller('contractCtrl', function ($scope, localStorageService, $stateParams, DataProvider, $ionicActionSheet, $ionicPopup, $state, $cordovaPrinter, AuthentificatInServer) {












  var employeur = localStorageService.get('currentEmployer');
  console.log(employeur);
  var jobyer = localStorageService.get('Selectedjobyer');
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

  // An alert dialog
  $scope.showAlert = function () {
    //printing the pdf
    if (ionic.Platform.isAndroid() && ionic.Platform.version() <= 4.2) {
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
    } else {

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

      AuthentificatInServer.yousignService(employeur, jobyer).success(signtaureSuccess).error(onError);
      //signtaureSuccess("");

    }


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
          $state.go("saisieCiviliteEmployeur", {employeur: employeur});
        }
        if (index == 1) {
          $state.go("adressePersonel", {employeur: employeur});
        }
        if (index == 2) {

          $state.go("adresseTravail", {employeur: employeur});
        }
        //branchement de la page de contrat ou infos clients

        return true;
      }
    });
  };
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

    viewData.enableBack = true;
    $scope.showiFrame = false;

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

    var urlSuccess = window.location.protocol.replace(":","%3A") + "%2F%2F" +
      window.location.host + "%2F" +
      window.location.pathname.replace("/","%2F");
    //+ "?urlsuccess="+urlSuccess
    $scope.showiFrame = true;
    var link = youSign.iFrameURLs[0].iFrameURL ;
    //"https://demo.yousign.fr/public/cosignature/fBIcrK6aJgL5J3NXSvFxyLMve18Zw9LqJHXVtGJd?tpl=e9ecb0d279aaed5495890bfc84020501";
    var iframe = document.createElement('iframe');
    iframe.frameBorder=0;
    iframe.width="100%";
    iframe.height="100%";
    iframe.id="youSign";
    iframe.style.overflow =  "hidden";
    iframe.style.height =  "100%";
    iframe.style.width = "100%";
    iframe.setAttribute("src", link);



    $(iframe).appendTo($("#iframPlaceHolder"));

    //$state.go('contract');
    //location.reload();


    //$state.go('profile', {"link" : youSign.iFrameURLs[0].iFrameURL});

  };

  var onError = function (data) {
    console.log(data);
  };


  //document.addEventListener("deviceready", $scope.showAlert, false);
});
