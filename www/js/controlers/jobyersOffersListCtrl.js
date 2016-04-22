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
            "titre": $scope.jobyersOffers[i].titre,
            "prenom": $scope.jobyersOffers[i].prenom,
            "nom": $scope.jobyersOffers[i].nom,
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
            "tel": $scope.jobyersOffers[i].tel,
            "dateNaissance": $scope.jobyersOffers[i].dateNaissance,
            "lieuNaissance": $scope.jobyersOffers[i].lieuNaissance,
            "nationalite": $scope.jobyersOffers[i].nationalite,
            "deviceToken": $scope.jobyersOffers[i].deviceToken

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
            "titre": $scope.jobyersOffers[i].titre,
            "prenom": $scope.jobyersOffers[i].prenom,
            "nom": $scope.jobyersOffers[i].nom,
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
            "tel": $scope.jobyersOffers[i].tel,
            "dateNaissance": $scope.jobyersOffers[i].dateNaissance,
            "lieuNaissance": $scope.jobyersOffers[i].lieuNaissance,
            "nationalite": $scope.jobyersOffers[i].nationalite,
            "deviceToken": $scope.jobyersOffers[i].deviceToken

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
        console.log();
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
                (currentEmployer.entreprises[0].naf == "") : true;
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
                  $state.go("menu.contract", {jobyer: jobber});
                  // console.log(jobber);
                  // console.log("redirect to contract pages");
                }
                else {
                  objRedirect.state = true;
                  localStorageService.set("steps", objRedirect);
                  // console.log(employer);
                  if (redirectToStep1) $state.go("menu.infoTabs.saisieCiviliteEmployeur", {jobyer: jobber});
                  else if (redirectToStep2) $state.go("menu.infoTabs.adressePersonel", {jobyer: jobber});
                  else if (redirectToStep3) $state.go("menu.infoTabs.adresseTravail", {jobyer: jobber});
                }
              } else {
                showNonConnectedPopup(jobber);
                //$state.go("map.connection", {jobyer: jobber});
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
                $state.go("menu.connection", {jobyer: jobber});
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

  .controller('CardsCtrl', function ($scope, TDCardDelegate, $timeout, localStorageService) {


    $scope.$on('$ionicView.beforeEnter', function (viewData) {
      viewData.enableBack = true;

      $scope.jobyersOffers = localStorageService.get('jobyersOffers');

      var cardTypes = [];

      for (var i = 0; i < $scope.jobyersOffers.length; i++) {
        //TEL: for Track by use..
        //$scope.jobyersOffers[i].push({"id":"i"});
        if ($scope.jobyersOffers[i].matching.toString().indexOf(".") > 0){
          if ($scope.jobyersOffers[i].matching.toString().split(".")[0])
            $scope.jobyersOffers[i].matching = $scope.jobyersOffers[i].matching.toString().split(".")[0];
        } else
          $scope.jobyersOffers[i].matching = $scope.jobyersOffers[i].matching.toString();
        if ($scope.jobyersOffers[i].availability.text == '0 minutes')
          $scope.jobyersOffers[i].availability.text = 'Maintenant!';
        if ($scope.jobyersOffers[i].prenom && $scope.jobyersOffers[i].titre)
          $scope.jobyersOffers[i].jobyerName = $scope.jobyersOffers[i].titre + " " +
            $scope.jobyersOffers[i].prenom;
        cardTypes.push({
          "id": i,
          "offerId" : $scope.jobyersOffers[i].idOffre,
          "offerTitle" : $scope.jobyersOffers[i].titreoffre,
          "titre": $scope.jobyersOffers[i].titre,
          "prenom": $scope.jobyersOffers[i].prenom,
          "nom": $scope.jobyersOffers[i].nom,
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
          "tel": $scope.jobyersOffers[i].tel,
          "dateNaissance": $scope.jobyersOffers[i].dateNaissance,
          "lieuNaissance": $scope.jobyersOffers[i].lieuNaissance,
          "nationalite": $scope.jobyersOffers[i].nationalite,
          "deviceToken": $scope.jobyersOffers[i].deviceToken

        })
      }

      /*var cardTypes = [
       { image: '' ,
       text : 'hello world'}
       ];*/

      $scope.cards = {
        master: Array.prototype.slice.call(cardTypes, 0),
        active: Array.prototype.slice.call(cardTypes, 0),
        discards: [],
        liked: [],
        disliked: []
      };

      $scope.refreshCards();
    });

    $scope.cardDestroyed = function (index) {
      $scope.cards.active.splice(index, 1);
      /*if (bjobExist) {
       $scope.addCard(index);
       bjobExist = false
       }*/

    };

    $scope.addCard = function (index) {
      var newCard = cardTypes[index];
      $scope.cards.active.push(angular.extend({}, newCard));
    };

    $scope.refreshCards = function () {
      // Set $scope.cards to null so that directive reloads
      $scope.cards.active = null;
      $timeout(function () {
        $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
      });
    };

    $scope.$on('removeCard', function (event, element, card) {
      var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
      $scope.cards.discards.push(discarded);
    });

    $scope.cardSwipedLeft = function (index) {
      console.log('LEFT SWIPE');
      var card = $scope.cards.active[index];
      $scope.cards.disliked.push(card);
    };

    function isJobyerAllreadySelected(element) {
      //var eArr = $scope.cards.values();
      for (var i = 0; i < $scope.cards.active.length; i++) {
        if (($scope.cards.active[i].email == element.email) && ($scope.cards.active[i].tel == element.tel)) {
          return true;
        }
      }
      return false;
    }

    var bjobExist;
    $scope.cardSwipedRight = function (index) {
      console.log('RIGHT SWIPE');
      bjobExist = $scope.cards.liked.some(isJobyerAllreadySelected);
      console.log("jobyer exist : " + bjobExist);
      if (bjobExist)
        return;
      var card = $scope.cards.active[index];
      $scope.cards.liked.push(card);
      //$scope.cards.master.splice(index, 1);
    };

    $scope.tab1 = {
      expand: false   // initial state
    };

    $scope.toggleTab1 = function () {
      $scope.tab1.expand = !$scope.tab1.expand;
    };

  })

  .controller('CardCtrl', function ($scope, TDCardDelegate, localStorageService, $ionicActionSheet, UserService,
                                    $state, Global, $cordovaSms, $ionicPopup) {


    $scope.sendSMS = function (tel) {
      // console.log('called send sms');
      document.addEventListener("deviceready", function () {
        var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
            intent: 'INTENT'
          }
        };
        $cordovaSms.send(tel, 'Vitojob : invitation de mise en relation', options)
          .then(function () {
            //Get Date & Time
            //jobber.date_invit = new Date();
            //jobber.contacted = true;
            console.log('Message sent successfully');

          }, function (error) {
            console.log('Message Failed:' + error);
          });
      });
    };

    $scope.sendEmail = function (mail) {
      cordova.plugins.email.isAvailable(
        function (isAvailable) {
          //jobber.date_invit = new Date();
          //jobber.contacted = true;
          cordova.plugins.email.open({
            to: [mail], // email addresses for TO field
            subject: "Vitojob :Inivitation de mise en relation" // subject of the email
            //app: 'gmail'
          }, function () {
            //Global.showAlertValidation("Votre email a été bien envoyé.");
          }, this);
        }
      );
    };

    $scope.phoneCall = function (tel) {
      window.plugins.CallNumber.callNumber(function () {
        //jobber.date_invit = new Date();
        //jobber.contacted = true;
      }, function () {
        // console.log("error call");
        Global.showAlertValidation("Une erreur est survenue. Veuillez réssayer plus tard");
      }, tel, false);
    };

    $scope.recruit = function (jobyer) {

      localStorageService.remove('Selectedjobyer');
      localStorageService.set('Selectedjobyer', jobyer);

      var isAuth = UserService.isAuthenticated();
      if (isAuth) {
        jobyer.date_invit = new Date();
        jobyer.contacted = true;

        //TEL 25022016 : Use of the currentEmployer localStorage variable
        var currentEmployer = localStorageService.get('currentEmployer');

        //var redirectToStep1 = (typeof (employer) == "undefined");
        var redirectToStep1 = (currentEmployer && currentEmployer.entreprises[0]) ?
        (currentEmployer.titre == "") ||
        (currentEmployer.prenom == "") ||
        (currentEmployer.nom == "") ||
        (currentEmployer.entreprises[0].name == "") ||
        (currentEmployer.entreprises[0].siret == "") ||
        (currentEmployer.entreprises[0].naf == "") : true;
        var redirectToStep2 = (currentEmployer && currentEmployer.entreprises[0]) ?
        (typeof (currentEmployer.entreprises[0].adresses) == "undefined") ||
        (typeof (currentEmployer.entreprises[0].adresses[0]) == "undefined") : true;
        var redirectToStep3 = (currentEmployer && currentEmployer.entreprises[0]) ?
        (typeof (currentEmployer.entreprises[0].adresses) == "undefined") ||
        (typeof (currentEmployer.entreprises[0].adresses[1]) == "undefined") : true;

        var dataInformed = ((!redirectToStep1) && (!redirectToStep2) && (!redirectToStep3));
        var objRedirect = {
          "state": false,
          "step1": redirectToStep1,
          "step2": redirectToStep2,
          "step3": redirectToStep3
        };
        if (dataInformed) {
          //onClickTransitionOut(jobyer);
          objRedirect.state = false;
          localStorageService.set("steps", objRedirect);
          //show contract page
          $state.go("menu.contract", {jobyer: jobyer});
        }
        else {
          objRedirect.state = true;
          localStorageService.set("steps", objRedirect);
          // console.log(employer);
          if (redirectToStep1) $state.go("menu.infoTabs.saisieCiviliteEmployeur", {jobyer: jobyer});
          else if (redirectToStep2) $state.go("menu.infoTabs.adressePersonel", {jobyer: jobyer});
          else if (redirectToStep3) $state.go("menu.infoTabs.adresseTravail", {jobyer: jobyer});
        }
      } else {
        showNonConnectedPopup(jobyer);
        //$state.go("map.connection", {jobyer: jobber});
      }
    };

    var showNonConnectedPopup = function (jobyer) {
      var confirmPopup = $ionicPopup.confirm({
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        template: 'Pour contacter ce jobyer, vous devez être connectés.',
        buttons: [
          {
            text: '<b>Connection</b>',
            type: 'button-dark',
            onTap: function (e) {
              confirmPopup.close();
              $state.go("menu.connection", {jobyer: jobyer});
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


  })
;
