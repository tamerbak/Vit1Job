'use strict';

starter.controller('jobyersOffersListCtrl',
  ['$scope', 'localStorageService', '$ionicActionSheet', 'UserService', '$state', 'Global', '$cordovaSms', '$ionicPopup',
    function ($scope, localStorageService, $ionicActionSheet, UserService, $state, Global, $cordovaSms, $ionicPopup) {

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
      });

      localStorageService.remove("steps");
      var init = function () {
        if (localStorageService.get('currentOffer') != null)
          $scope.OfferLabel = capitalize(localStorageService.get('currentOffer').label);
        $scope.jobyerListSetting = localStorageService.get('jobyerListSetting');
        if (!$scope.jobyerListSetting) {
          $scope.jobyerListSetting = {
            orderByAvialability: false,
            orderByCorrespondence: false,
            job: 50,
            qi: 25,
            language: 25,
            transportationmode: 'driving'
          };
          localStorageService.set('jobyerListSetting', $scope.jobyerListSetting);
        }


        /*
         $scope.jobyersOffers = localStorageService.get(''):


         [{
         jobyerName : 'Jérôme',
         availability : {
         value : 210,
         text : '8h 30min'
         },
         tel: "+212676109994",
         email:"ettebaa.marouane@gmail.com",
         matching : 60,
         contacted : false,
         latitude : 0,
         longitude : 0,
         date_invit: ''

         //Date_Invit : $scope.ge

         },
         {
         jobyerName : 'Alain',
         availability : {
         value : 20,
         text : '3h 30min'
         },
         tel: "+212623628174",
         email:"hanane.aitamhira@gmail.com",
         matching : 20,
         contacted : true,
         latitude : 0,
         longitude : 0,
         date_invit:'19-01-2016  11:20'
         },
         {
         jobyerName : 'Philippe',
         availability : {
         value : 1000,
         text : '17h 30min'
         },
         tel: "+212623628174",
         email:"hanane.aitamhira@gmail.com",
         matching : 10,
         contacted : false,
         latitude : 0,
         longitude : 0,
         date_invit: ''
         }];
         */
        //*
        $scope.jobyersOffers = localStorageService.get('jobyersOffers');
        $scope.jobyersOffersPart = [];

        var nbrJobyerOffers = 3;
        if ($scope.jobyersOffers.length < 3) nbrJobyerOffers = $scope.jobyersOffers.length;

        for (var i = 0; i < nbrJobyerOffers; i++) {
          //TEL: for Track by use..
          //$scope.jobyersOffers[i].push({"id":"i"});
          if ($scope.jobyersOffers[i].matching.split(".")[0])
            $scope.jobyersOffers[i].matching = $scope.jobyersOffers[i].matching.split(".")[0];
          if ($scope.jobyersOffers[i].availability.text == '0 minutes')
            $scope.jobyersOffers[i].availability.text = 'Maintenant!';
          if ($scope.jobyersOffers[i].prenom && $scope.jobyersOffers[i].titre)
            $scope.jobyersOffers[i].jobyerName = $scope.jobyersOffers[i].titre + " " +
              $scope.jobyersOffers[i].prenom;
          $scope.jobyersOffersPart.push({
            "id": i,
            "titre" :  $scope.jobyersOffers[i].titre,
            "prenom" :  $scope.jobyersOffers[i].prenom,
            "nom" :  $scope.jobyersOffers[i].nom,
            "availability": {
              value: $scope.jobyersOffers[i].availability.value,
              text: $scope.jobyersOffers[i].availability.text
            },
            "contacted": $scope.jobyersOffers[i].contacted,
            "date_invit": $scope.jobyersOffers[i].date_invit,
            "email": $scope.jobyersOffers[i].email,
            "jobyerName": $scope.jobyersOffers[i].jobyerName,
            "latitude": $scope.jobyersOffers[i].latitude,
            "logitude": $scope.jobyersOffers[i].logitude,
            "matching": $scope.jobyersOffers[i].matching,
            "tel": $scope.jobyersOffers[i].tel

          });
        }


        //*/

        $scope.transportationmode = $scope.jobyerListSetting.transportationmode;

        $scope.sort();
      };

      var currentStart = 3;


      $scope.loadMoreOffers = function () {

        if ($scope.jobyersOffers == "undefined")
          return;
        for (var i = currentStart; (i < currentStart + 3 && i < $scope.jobyersOffers.length); i++) {
          //TEL: for Track by use..
          //$scope.jobyersOffers[i].push({"id":"i"});
          if ($scope.jobyersOffers[i].matching.split(".")[0])
            $scope.jobyersOffers[i].matching = $scope.jobyersOffers[i].matching.split(".")[0];
          if ($scope.jobyersOffers[i].availability.text == '0 minutes')
            $scope.jobyersOffers[i].availability.text = 'Maintenant!';
          if ($scope.jobyersOffers[i].prenom && $scope.jobyersOffers[i].titre)
            $scope.jobyersOffers[i].jobyerName = $scope.jobyersOffers[i].titre + " " +
              $scope.jobyersOffers[i].prenom;

          $scope.jobyersOffersPart.push({
            "id": i,
            "titre" :  $scope.jobyersOffers[i].titre,
            "prenom" :  $scope.jobyersOffers[i].prenom,
            "nom" :  $scope.jobyersOffers[i].nom,
            "availability": {
              value: $scope.jobyersOffers[i].availability.value,
              text: $scope.jobyersOffers[i].availability.text
            },
            "contacted": $scope.jobyersOffers[i].contacted,
            "date_invit": $scope.jobyersOffers[i].date_invit,
            "email": $scope.jobyersOffers[i].email,
            "jobyerName": $scope.jobyersOffers[i].jobyerName,
            "latitude": $scope.jobyersOffers[i].latitude,
            "logitude": $scope.jobyersOffers[i].logitude,
            "matching": $scope.jobyersOffers[i].matching,
            "tel": $scope.jobyersOffers[i].tel

          });
        }

        currentStart += 3;

        $scope.$broadcast('scroll.infiniteScrollComplete');

      };

      $scope.$on('$ionicView.beforeEnter', function () {
        init();
      });

      $scope.sort = function () {
        if ($scope.jobyerListSetting.orderByCorrespondence) $scope.SortOrder = '-matching';
        if ($scope.jobyerListSetting.orderByAvialability) $scope.SortOrder = '+availability.value';
      };

      var capitalize = function (st) {
        return st.charAt(0).toUpperCase() + st.slice(1);
      };

      var setJobyerListSetting = function (property, newValue) {
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
      function has(object, key) {
        return object ? hasOwnProperty.call(object, key) : false;
      }

      $scope.showMenuForContract = function (jobber) {

        localStorageService.remove('Selectedjobyer');
        localStorageService.set('Selectedjobyer', jobber);
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: '<i class="ion-android-textsms"> Contacter par SMS</i>'}, //Index = 0
            {text: '<i class="ion-android-mail"> Contacter Mail</i>'}, //Index = 1
            {text: '<i class="ion-ios-telephone"> Contacter par Téléphone</i>'}, //Index = 2
            {text: '<i class="ion-ios-paper-outline"> Créer un contrat</i>'} //Index = 3
          ],
          titleText: 'Mise en relation',
          cancelText: 'Annuler',
          cssClass: (ionic.Platform.isAndroid() ? 'android-sheet-vitonjob' : 'ios-sheet-vitonjob'),
          buttonClicked: function (index) {


            if (index == 0) {
              // console.log('called send sms');
              document.addEventListener("deviceready", function () {
                var options = {
                  replaceLineBreaks: false, // true to replace \n by a new line, false by default
                  android: {
                    intent: 'INTENT'
                  }
                };
                $cordovaSms.send(jobber.tel, 'Vitojob :Inivitation de mise en relation', options)
                  .then(function () {
                    //Get Date & Time
                    jobber.date_invit = new Date();
                    jobber.contacted = true;
                    console.log('Message sent successfully');

                  }, function (error) {
                    console.log('Message Failed:' + error);

                  });
              });
            }
            if (index == 1) {
              cordova.plugins.email.isAvailable(
                function (isAvailable) {
                  jobber.date_invit = new Date();
                  jobber.contacted = true;
                  cordova.plugins.email.open({
                    to: [jobber.email], // email addresses for TO field
                    subject: "Vitojob :Inivitation de mise en relation" // subject of the email
                    //app: 'gmail'
                  }, function () {
                    //Global.showAlertValidation("Votre email a été bien envoyé.");
                  }, this);
                }
              );
            }
            if (index == 2) {

              window.plugins.CallNumber.callNumber(function () {
                jobber.date_invit = new Date();
                jobber.contacted = true;
              }, function () {
                // console.log("error call");
                Global.showAlertValidation("Une erreur est survenue.Veuillez réssayer plus tard");
              }, jobber.tel, false);
            }
            //branchement de la page de contrat ou infos clients
            if (index == 3) {
              /*
               recuperation des données de l'emplyeur et calcule dans une variable boolean
               si toutes les informations sont présentes
               */

              var isAuth = UserService.isAuthenticated();
              if (isAuth) {
                jobber.date_invit = new Date();
                jobber.contacted = true;
                var employer = localStorageService.get('employeur');

                //TEL 25022016 : Use of the currentEmployer localStorage variable
                var currentEmployer = localStorageService.get('currentEmployer');

                //var redirectToStep1 = (typeof (employer) == "undefined");
                var redirectToStep1 = (currentEmployer && currentEmployer.entreprises[0]) ?
                (currentEmployer.titre == "") ||
                (currentEmployer.prenom == "") ||
                (currentEmployer.nom == "") ||
                (currentEmployer.entreprises[0].name == "") ||
                (currentEmployer.entreprises[0].siret == "") ||
                (currentEmployer.entreprises[0].naf == "") ||
                (currentEmployer.entreprises[0].urssaf == "") : true;
                var redirectToStep2 = (currentEmployer && currentEmployer.entreprises[0]) ?
                (typeof (currentEmployer.entreprises[0].adresses) == "undefined") ||
                (typeof (currentEmployer.entreprises[0].adresses[0]) == "undefined") : true;
                var redirectToStep3 = (currentEmployer && currentEmployer.entreprises[0]) ?
                (typeof (currentEmployer.entreprises[0].adresses) == "undefined") ||
                (typeof (currentEmployer.entreprises[0].adresses[1]) == "undefined") : true;

                /*if (has(employer.adressePersonel, 'fullAddress')) {
                 redirectToStep2 = false
                 } else {
                 redirectToStep2 = true
                 }
                 if (has(employer.adresseTravail, 'fullAddress')) {
                 redirectToStep3 = false
                 } else {
                 redirectToStep3 = true
                 }*/


                //if (employer) {
                //for (var key in employer) {
                //redirectToStep1 = (employer[key]) == "";
                //if (redirectToStep1) break;
                //}
                // if (!redirectToStep1) {
                //   for (var key in employer.adressePersonel) {
                //     redirectToStep2 = (employer.adressePersonel[key]) == "";
                //     if (redirectToStep2) break;
                //   }
                // }
                // if (!redirectToStep2) {
                //   for (var key in employer.adresseTravail) {
                //     redirectToStep3 = (employer.adresseTravail[key]) == "";
                //     if (redirectToStep3) break;
                //   }
                // }
                //}
                var dataInformed = ((!redirectToStep1) && (!redirectToStep2) && (!redirectToStep3));
                var objRedirect = {
                  "state": false,
                  "step1": redirectToStep1,
                  "step2": redirectToStep2,
                  "step3": redirectToStep3
                };
                if (dataInformed) {
                  objRedirect.state = false;
                  localStorageService.set("steps", objRedirect);
                  //show contract page //TODO
                  $state.go("contract", {jobyer: jobber});
                  // console.log(jobber);
                  // console.log("redirect to contract pages");
                }
                else {
                  objRedirect.state = true;
                  localStorageService.set("steps", objRedirect);
                  // console.log(employer);
                  if (redirectToStep1) $state.go("saisieCiviliteEmployeur", {jobyer: jobber});
                  else if (redirectToStep2) $state.go("adressePersonel", {jobyer: jobber});
                  else if (redirectToStep3) $state.go("adresseTravail", {jobyer: jobber});
                }
              } else {
                showNonConnectedPopup(jobber);
                //$state.go("connection", {jobyer: jobber});
              }
            }
            return true;
          }
        });
      }
      ;

      var showNonConnectedPopup = function (jobber) {
        var confirmPopup = $ionicPopup.confirm({
          title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
          template: 'Pour contacter ce jobyer, vous devez être connectés.',
          buttons: [
            {
              text: '<b>Connection</b>',
              type: 'button-dark',
              onTap: function (e) {
                confirmPopup.close();
                $state.go("connection", {jobyer: jobber});
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

    }])
;
