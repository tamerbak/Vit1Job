/**
 * Created by Tamer on 09/10/2015.
 */
'use strict';

starter

  .controller('homeCtrl', function ($scope, $rootScope, $http, $state, x2js, Global, $ionicPopup, localStorageService, $timeout, $cookies, jobyerService, $ionicHistory,$cordovaNetwork) {
    $scope.$on('$ionicView.beforeEnter', function (e, config) {
      config.enableBack = false;
      //$scope.formData = "";
    });
    

    
    //$rootScope.NetworkStat = '<div>Vous n\'êtes pas connecté.</div>';
    /*$scope.displayBack = function() {
     return $ionicHistory.viewHistory().backView != null;
     };

     $scope.myGoBack = function() {
     window.history.back();
     };*/
     var init = function(){ 
        document.addEventListener("deviceready", function () {
          
            $scope.network = $cordovaNetwork.getNetwork();
            $scope.isOnline = $cordovaNetwork.isOnline();
            $scope.$apply();
            
            if($scope.isOnline){
                $rootScope.networkStat = "  ";
            }else{
                $rootScope.networkStat = "Vous n\'êtes pas connecté.";
            }

            // listen for Online event
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                $rootScope.networkStat = "   ";
                $scope.isOnline = true;
                $scope.network = $cordovaNetwork.getNetwork();
                
                $scope.$apply();
            })

            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                $rootScope.networkStat = "Vous n\'êtes pas connecté";
                $scope.isOnline = false;
                $scope.network = $cordovaNetwork.getNetwork();

                $scope.$apply();
            })
        
        

         }, false);
  
     }
     
    init();
    // FORMULAIRE
    $scope.formData = {};
    //$scope.formData.connexion= {};

    $scope.getJobbers = function (query) {

      var jobyersForMe = [];
      var jobyersNextToMe = [];

      $rootScope.jobyersForMe = [];
      $rootScope.jobyersNextToMe = [];
      $rootScope.nbJobyersForMe = 0;
      $rootScope.nbJobyersNextToMe = 0;

      $rootScope.queryText = query;

      if (sessionId != '') {
        var soapMessage = 'user_salarie;' + query; //'C# sur paris';
        $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/recherche',
          headers: {
            "Content-Type": "text/plain"
          },
          data: soapMessage
        }).then(
          function (response) {
            var jsonResp = x2js.xml_str2json(response.data);
            var jsonText = JSON.stringify(jsonResp);
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataModel/g, "dataModel");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataRow/g, "dataRow");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataEntry/g, "dataEntry");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataCouple/g, "dataCouple");
            jsonText = jsonText.replace(/<!\[CDATA\[/g, '').replace(/\]\]\>/g, '');
            jsonResp = JSON.parse(jsonText);

            // var jsonResp = parsingService.formatString.formatServerResult(response.data);

            //Check if there are rows!

            if (jsonResp.dataModel.rows.dataRow instanceof Array) {g
              //if (jsonResp.dataModel.rows.dataRow.length > 0){
              //if (rowsCount > 0){

              for (var i = 0; i < jsonResp.dataModel.rows.dataRow.length; i++) {

                //jsonResp = parsingService.formatString.formatServerResult(response.data);

                //jsonResp.dataModel.rows.dataRow[0].dataRow.dataEntry[1].value
                var prenom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[1].value;
                var nom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[2].value;
                var idVille = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].value;


                prenom = prenom.replace("<![CDATA[", '');
                prenom = prenom.replace("]]>", '');
                nom = nom.replace("<![CDATA[", '');
                nom = nom.replace("]]>", '');
                idVille = idVille.replace("<![CDATA[", '');
                idVille = idVille.replace("]]>", '');

                for (var j = 0; j < jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple.length; j++) {
                  jsonText = JSON.stringify(jsonResp);
                  jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
                  jsonResp = JSON.parse(jsonText);
                  if (jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple[j].id == idVille)
                    break;
                }

                var ville = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple[j].label;
                jobyersForMe.push(
                  {
                    'firstName': prenom,
                    'lastName': nom,
                    'city': ville
                  });
              }
            } else {
              //One Instance returned or null!
              if (jsonResp.dataModel.rows != "") {
                prenom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[1].value;
                nom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[2].value;
                idVille = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].value;

                prenom = prenom.replace("<![CDATA[", '');
                prenom = prenom.replace("]]>", '');
                nom = nom.replace("<![CDATA[", '');
                nom = nom.replace("]]>", '');
                idVille = idVille.replace("<![CDATA[", '');
                idVille = idVille.replace("]]>", '');

                for (j = 0; j < jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple.length; j++) {
                  if (jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple[j].id == idVille)
                    break;
                }

                ville = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple[j].label;

                jobyersForMe[0] = {
                  'firstName': prenom,
                  'lastName': nom,
                  'city': ville
                };
              }
            }


            $rootScope.jobyersForMe = jobyersForMe;
            $rootScope.nbJobyersForMe = jobyersForMe.length;

            // Send Http query to get jobbers with same competencies and same city as mine
            for (i = 0; i < jobyersForMe.length; i++) {
              if (jobyersForMe[i].city == myCity) {
                jobyersNextToMe.push({
                  'firstName': jobyersForMe[i].firstName,
                  'lastName': jobyersForMe[i].lastName,
                  'city': jobyersForMe[i].city
                });
              }
            }
            $rootScope.nbJobyersNextToMe = jobyersNextToMe.length;
            $rootScope.jobyersNextToMe = jobyersNextToMe;

            //isConnected = true;
            //if (jobyersForMe.length>0)
            if ($scope.nbJobyersForMe != 0) {
              $state.go('list');
            }
            //$state.go('app');
          },
          function (response) {
            alert("Error : " + response.data);
          }
        );
      }
    };

    $scope.exitVit = function () {
      navigator.app.exitApp();
    };

    $scope.initConnexion = function () {

      $scope.formData.connexion = {'etat': false, 'libelle': 'Se connecter', 'employeID': 0};
      var cnx = localStorageService.get('connexion');
      if (cnx) {
        $scope.formData.connexion = cnx;
        console.log("Employeur est connecté");
      }

      console.log("connexion[employeID] : " + $scope.formData.connexion.employeID);
      console.log("connexion[libelle] : " + $scope.formData.connexion.libelle);
      console.log("connexion[etat] : " + $scope.formData.connexion.etat);
    };

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
      if (states.fromCache && states.stateName == "app") {
        $scope.initConnexion();
      }
      $scope.formData.mDate = "23/12/2016"
    });

    $scope.modeConnexion = function () {
      var estConnecte = 0;
      var cnx = localStorageService.get('connexion');
      if (cnx) {
        if (cnx.etat) {
          console.log("IL S'AGIT D'UNE DECONNEXION");

          localStorageService.remove('connexion');
          localStorageService.remove('sessionID');
          var connexion = {'etat': false, 'libelle': 'Se connecter', 'employeID': 0};
          localStorageService.set('connexion', connexion);
          $scope.formData = {};

          console.log("New Connexion : " + JSON.stringify(localStorageService.get('connexion')));
          $state.go("menu.connection");


        }
        else {
          console.log("IL S'AGIT D'UNE CONNEXION");
          $state.go("menu.connection");
        }
      }
      else
        $state.go("menu.connection");
    };

    var checkIsLogged = function () {
      var currentEmployer = localStorageService.get('currentEmployer');
      var isLogged = (currentEmployer) ? true : false;
      return isLogged;
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.isLogged = checkIsLogged();
    });

    $scope.logOut = function () {
      localStorageService.remove('currentEmployer');
      $scope.isLogged = false;

      localStorageService.remove('connexion');
      var connexion = {
        'etat': false,
        'libelle': 'Se connecter',
        'employeID': ""
      };

      localStorageService.set('connexion', connexion);

      location.reload(false);


    };
    
    var showNonConnectedPopup = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Pour que la recherche soit plus précise, vous devez être connectés ?',
        buttons: [
          {
            text: '<b>Connection</b>',
            type: 'button-dark',
            onTap: function (e) {
              confirmPopup.close();
              $state.go("menu.connection");
            }
          }, {
            text: '<b>Retour</b>',
            type: 'button-calm',
            onTap: function (e) {
              confirmPopup.close();
            }
          }

        ]
      });
    };

    var showAddOfferConfirmPopup = function (job) {
      var confirmPopup = $ionicPopup.confirm({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Pour que la recherche soit plus précise, voulez vous créer une offre pour ' + job + '?',
        buttons: [
          {
            text: '<b>Continuer</b>',
            type: 'button-dark',
            onTap: function (e) {
              confirmPopup.close();
              //getJobyersOffersByJob(job);
              var offerId = "";
              jobyerService.recherche(job, offerId).success(onGetJobyersOffersByJobSuccess).error(onError); //HERE
            }
          }, {
            text: '<b>Ok</b>',
            type: 'button-calm',
            onTap: function (e) {
              confirmPopup.close();
              $state.go("offres");
            }
          }

        ]
      });
    };

    var onGetJobyersOffersByJobSuccess = function (data) {
      if (data == null || data.length == 0)
        return;
      var sdata = data[0]['value'];
      console.log(JSON.stringify(sdata));
      var jobyersOffers = JSON.parse(sdata);
      localStorageService.set('jobyersOffers', jobyersOffers);
      $state.go("menu.jobyersOffersTab.list");
    };

    var onError = function (data) {
      console.log(data);
    };

    var getJobyersOffersByJob = function (job) {
      jobyerService.getJobyersOffersByJob(job).success(onGetJobyersOffersByJobSuccess).error(onError);
    };

    var isEntrepriseOfferByJobExists = function (job) {
      if (!job) return;
      var currentEmployer = localStorageService.get('currentEmployer');
      if (!currentEmployer) return;
      var entreprises = currentEmployer.entreprises;
      var found = false;
      if (entreprises && entreprises.length > 0) {
        var i = 0;
        var offers = [];
        var pricticesJob = [];
        var j;
        var k;
        while (!found && i < entreprises.length) {
          offers = entreprises[i].offers;
          if (offers && offers.length > 0) {
            j = 0;
            while (!found && j < offers.length) {
              pricticesJob = offers[j].pricticesJob;
              if (pricticesJob && pricticesJob.length > 0) {
                k = 0;
                while (!found && k < pricticesJob.length) {
                  //TEL does search sentence contains job label ? ICIM
                  found = (pricticesJob[k].job && job.toLowerCase().indexOf(pricticesJob[k].job.toLowerCase()) > -1);
                  //found = (pricticesJob[k].job && pricticesJob[k].job.toLowerCase() == job.toLowerCase());
                  if (found) {
                    var currentOffer = {
                      'id': offers[j].offerId.toString(),
                      'label': offers[j].title
                    };
                    localStorageService.set('currentOffer', currentOffer);
                    var currentEntreprise = {
                      'id': entreprises[i].entrepriseId.toString(),
                      'label': entreprises[i].name
                    };
                    localStorageService.set('currentEntreprise', currentEntreprise);
                    loadCurrentEmployerEntreprises();
                  }
                  else {
                    k++;
                  }
                }
              }
              if (!found) j++;
            }
          }
          if (!found) i++;
        }
      }

      /*if(!found && $rootScope.offres != undefined) {
       var offers = $rootScope.offres;
       for(var i=0 ; i < $rootScope.offres.length ;i++){
       var practiceJob = offers[i].pricticesJob[k].job;
       found = (practiceJob && job.toLowerCase().indexOf(job.toLowerCase())>-1);
       if(found){
       var currentOffer = {
       'id' : offers[i].offerId.toString(),
       'label' : offers[i].title
       };
       localStorageService.set('currentOffer',currentOffer);
       var currentEntreprise = {
       'id' : entreprises[0].entrepriseId.toString(),
       'label' : entreprises[0].name
       };
       localStorageService.set('currentEntreprise',currentEntreprise);
       loadCurrentEmployerEntreprises();
       }
       }
       }

       var offers = localStorageService.get('offres');
       if(!found && offers != undefined && offers.length>0 && offers[0].length>0) {
       for(var i=0 ; i < offers.length ;i++){
       var practiceJob = offers[i].job.title;
       found = (practiceJob && job.toLowerCase().indexOf(job.toLowerCase())>-1);
       if(found){
       var currentOffer = {
       'id' : offers[i].offerId.toString(),
       'label' : offers[i].title
       };
       localStorageService.set('currentOffer',currentOffer);
       var currentEntreprise = {
       'id' : entreprises[0].entrepriseId.toString(),
       'label' : entreprises[0].name
       };
       localStorageService.set('currentEntreprise',currentEntreprise);
       loadCurrentEmployerEntreprises();
       }
       }
       }*/

      return found;
    };

    var loadCurrentEmployerEntreprises = function () {
      var currentEmployer = localStorageService.get('currentEmployer');
      if (!currentEmployer) return;
      var currentEmployerEntreprises = currentEmployer.entreprises;
      if (currentEmployerEntreprises && currentEmployerEntreprises.length > 0) {
        var entreprises = [];
        var entreprise;
        var offers = [];
        var offer;
        for (var i = 0; i < currentEmployerEntreprises.length; i++) {
          offers = [];
          if (currentEmployerEntreprises[i] && currentEmployerEntreprises[i].offers && currentEmployerEntreprises[i].offers.length > 0) {
            for (var j = 0; j < currentEmployerEntreprises[i].offers.length; j++) {
              offer = {
                'id': (currentEmployerEntreprises[i].offers[j].offerId) ? currentEmployerEntreprises[i].offers[j].offerId.toString() : currentEmployerEntreprises[i].offers[j].pk.toString(),
                'label': currentEmployerEntreprises[i].offers[j].title
              };
              offers.push(offer);
            }
          }
          entreprise = {
            'id': currentEmployerEntreprises[i].entrepriseId.toString(),
            'label': currentEmployerEntreprises[i].name,
            'offers': offers
          };
          entreprises.push(entreprise);
        }
        localStorageService.set('currentEmployerEntreprises', entreprises);
      }
    };

    $scope.launchSearchForJobyersOffers = function (job) {
      localStorageService.set('lastSearchedJob', job);

      var offerId = 0;

      localStorageService.remove('currentEntreprise');
      localStorageService.remove('currentOffer');
      localStorageService.remove('currentEmployerEntreprises');

      var isLogged = checkIsLogged();
      if (isLogged) {
        if (isEntrepriseOfferByJobExists(job)) {
          offerId = localStorageService.get('currentOffer').id;
          jobyerService.recherche(job, offerId).success(onGetJobyersOffersByJobSuccess).error(onError);
        } else {
          showAddOfferConfirmPopup(job);
        }
      }
      else {
        jobyerService.recherche(job, "").success(onGetJobyersOffersByJobSuccess).error(onError);
      }
    };

    //$scope.mPerson ="" ;
    $scope.personCriteria = function () {

      if ($scope.pStyle) {
        if ($scope.pStyle.activated) {
          $scope.bPerson = false;
          $scope.formData.mPerson = "";
          $scope.pStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.bPerson = true;
          $scope.pStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        //$scope.mPerson = "";
        $scope.bPerson = true;
        $scope.pStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.sectorCriteria = function () {

      if ($scope.sStyle) {
        if ($scope.sStyle.activated) {
          $scope.bSector = false;
          $scope.formData.mSector = "";
          $scope.sStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.bSector = true;
          $scope.sStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.bSector = true;
        $scope.sStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.jobCriteria = function () {

      if ($scope.jStyle) {
        if ($scope.jStyle.activated) {
          $scope.bJob = false;
          $scope.formData.mJob = "";
          $scope.jStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.bJob = true;
          $scope.jStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.bJob = true;
        $scope.jStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.langCriteria = function () {

      if ($scope.laStyle) {
        if ($scope.laStyle.activated) {
          $scope.blang = false;
          $scope.formData.mLanguage = "";
          $scope.laStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.blang = true;
          $scope.laStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.blang = true;
        $scope.laStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.calCriteria = function () {

      if ($scope.cStyle) {
        if ($scope.cStyle.activated) {
          $scope.bcal = false;
          $scope.formData.mDate = "";
          $scope.cStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.bcal = true;
          $scope.cStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.bcal = true;
        $scope.cStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.locationCriteria = function () {

      if ($scope.loStyle) {
        if ($scope.loStyle.activated) {
          $scope.blocation = false;
          $scope.formData.mLocation = "";
          $scope.loStyle = {
            "activated": false,
            "background-color": "white"
          }
        } else {
          $scope.blocation = true;
          $scope.loStyle = {
            "activated": true,
            "background-color": "#14BAA6"
          }
        }
      } else {
        $scope.blocation = true;
        $scope.loStyle = {
          "activated": true,
          "background-color": "#14BAA6"
        }
      }
    };

    $scope.criteriaSearch = function () {

      var person = "",
        sector = "",
        job = "",
        date = "",
        location = "";

      if ($scope.formData.mPerson) person = $scope.formData.mPerson;
      if ($scope.formData.mSector) sector = $scope.formData.mSector;
      if ($scope.formData.mJob) job = $scope.formData.mJob;
      if ($scope.formData.mDate) date = $scope.formData.mDate.getDate().toString() +"/" +
        ($scope.formData.mDate.getMonth() + 1) + "/" +
        $scope.formData.mDate.getFullYear().toString();
      if ($scope.formData.mLocation) location = $scope.formData.mLocation;

      var data = {
        "job": job,
        "metier": sector,
        "lieu": location,
        "nom": person,
        "date": date //"DD/MM/YYYY"
      };

      // Call web service :
      jobyerService.criteriaSearchService(data).
        success(function (response) {
          console.log('recherche par critères bien executée');
          onGetJobyersOffersByJobSuccess(response);
        }).
        error(function (error) {
          onError();
          console.log('erreur dans le ws de la recherche par critères : ' + error)
        });


    };

    $scope.$watch('formData.mDate', function () {
      console.log($scope.formData.mDate);
    });

    // Agenda
    var weekDaysList = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
    var monthList = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    var h0 = new Date(2016, 3, 4)
      , h1 = new Date(2016, 3, 9)
      , h2 = new Date(2016, 3, 3)
      , h3 = new Date(2016, 3, 10)
      , h4 = new Date(2016, 3, 30)
      , h5 = new Date(2016, 3, 16)
      , h6 = new Date(2016, 3, 6)
      , calendar0 = [h0, h1, h2, h3, h4, h5, h6];

    var c0 = new Date(2016, 3, 4)
      , c1 = new Date(2016, 3, 9)
      , c2 = new Date(2016, 3, 3)
      , c3 = new Date(2016, 3, 10)
      , c4 = new Date(2016, 3, 12)
      , c5 = new Date(2016, 3, 16)
      , c6 = new Date(2016, 3, 18)
      , c7 = new Date(2016, 3, 19)
      , c8 = new Date(2016, 3, 22)
      , c9 = new Date(2016, 3, 27)
      , c10 = new Date(2016, 3, 25)
      , c11 = new Date(2016, 3, 6)
      , calendar1 = [c0, c1]
      , calendar2 = [c2, c3]
      , calendar3 = [c4]
      , calendar4 = [c2, c5, c11]
      , calendar5 = [c4, c10]
      , calendar6 = [c6, c7, c8, c9]
      , calendar7 = [c5, c6, c11];

    var d0 = new Date(2016, 3, 16)
      , d1 = new Date(2016, 3, 17)
      , d2 = new Date(2016, 3, 17)
      , d3 = new Date(2016, 3, 30)
      , d4 = new Date(2016, 3, 1)
      , disabledDates = [d0, d1, d2, d3, d4];

    var s0 = new Date(2016, 3, 31)  // preview month
      , s1 = new Date(2016, 3, 10) // holiday
      , s2 = new Date(2016, 3, 11) // holiday
      , s7 = new Date(2016, 3, 6) //
      , s3 = new Date(2016, 3, 12) //
      , s4 = new Date(2016, 3, 12) // clone
      , s5 = new Date(2016, 3, 17) // conflict with disabled
      , s6 = new Date(2016, 3, 1); // conflict with disabled, next month
    //$scope.selectedDates = [s1, s2, s3, s4, s0, s5, s6, s7];

    //if (!$scope.selectedDatesOriginal)
    $scope.selectedDatesOriginal = [];
    if (!$scope.selectedDates)
      $scope.selectedDates = [];
    for(var i=0; i<$scope.selectedDates.length;i++){
      $scope.selectedDatesOriginal.push($scope.selectedDates[i].dates)
    }
    $scope.datepickerObject = {
      templateType: 'POPUP', // POPUP | MODAL
      modalFooterClass: 'bar-light',
      //header: 'multi-date-picker',
      headerClass: 'royal-bg light',

      btnsIsNative: false,

      btnOk: 'OK',
      btnOkClass: 'button-clear cal-green',

      btnCancel: 'Fermer',
      btnCancelClass: 'button-clear button-dark',

      btnTodayShow: true,
      btnToday: "Aujourd'hui",
      btnTodayClass: 'button-clear button-dark',

      btnClearShow: true,
      btnClear: 'Libérer',
      btnClearClass: 'button-clear button-dark',

      selectType: 'SINGLE', // SINGLE | PERIOD | MULTI

      tglSelectByWeekShow: false, // true | false (default)
      tglSelectByWeek: 'Semaine entière',
      isSelectByWeek: false, // true (default) | false
      selectByWeekMode: 'NORMAL', // INVERSION (default), NORMAL
      tglSelectByWeekClass: 'toggle-positive',
      titleSelectByWeekClass: 'positive positive-border',

      accessType: 'WRITE', // READ | WRITE
      //showErrors: true, // true (default), false
      //errorLanguage: 'RU', // EN | RU

      //fromDate: new Date(2015, 9),
      //toDate: new Date(2016, 1),

      selectedDates: $scope.selectedDatesOriginal,
      viewMonth: $scope.selectedDatesOriginal, //
      disabledDates: '', //disabledDates,

      calendar0: calendar0,
      calendar0Class: '',
      calendar0Name: 'Serveur Wahou',

      calendar1: calendar1,
      //calendar1Class: '',
      calendar1Name: 'Jours fériés',

      calendar2: calendar2,
      calendar2Class: '',
      //calendar2Name: 'calendar 2',

      calendar3: calendar3,
      calendar3Class: '',
      calendar3Name: 'Anniversaire',

      calendar4: calendar4,
      calendar4Class: 'cal-color-black',
      calendar4Name: 'Non disponible',

      calendar5: calendar5,
      calendar5Class: '',
      calendar5Name: 'Conducteur habitué',

      calendar6: calendar6,
      calendar6Class: '',
      calendar6Name: 'Cuisinier Débutant',

      calendar7: calendar7,
      calendar7Class: '',
      calendar7Name: 'Autres RDV',

      conflictSelectedDisabled: 'DISABLED', // SELECTED | DISABLED

      closeOnSelect: false,

      mondayFirst: true,
      weekDaysList: weekDaysList,
      monthList: monthList,

      callback: function (dates) {  //Mandatory
        retSelectedDates(dates);
      }
    };

    var retSelectedDates = function (dates) {
      if (!$scope.selectedDates)
        $scope.selectedDates = [];
      if (!$scope.selectedDatesOriginal)
        $scope.selectedDatesOriginal = [];
      $scope.selectedDatesOriginal.length = 0;
      $scope.selectedDates.length = 0;
      for (var i = 0; i < dates.length; i++) {
        var newValSelDate = {
          "date": angular.copy(dates[i]),
          "startHour": "--:--",
          "endHour": "--:--"
        };
        $scope.selectedDatesOriginal.push(angular.copy(dates[i]));
        $scope.selectedDates.push(newValSelDate);
      }
      $scope.formData.mDate = $scope.selectedDates[0].date.getDate()+ "/" +
        ($scope.selectedDates[0].date.getMonth() + 1) + "/" +
        $scope.selectedDates[0].date.getFullYear();
    };


  });
