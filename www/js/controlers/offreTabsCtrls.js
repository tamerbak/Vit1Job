/**
 * Created by Tamer on 15/10/2015.
 */

'use strict';
starter

  .controller('offreTabsCtrl', function ($scope, $rootScope, DataProvider, Global, $state, $stateParams, $cordovaDatePicker, $ionicPopup,
                                         localStorageService, jobyerService, ionicTimePicker) {
    $scope.absoluteJobs = DataProvider.getJobs();
    //$scope.formData={};
    if ($stateParams.offre) {
      $scope.offre = JSON.parse($stateParams.offre);
    }
    //go back
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    $scope.updateAutoCompleteMetier = function () {
      $scope.formData.metier = JSON.parse($scope.formData.metier);
      var metiers = $scope.formData.metiers;
      // RECHERCHE LIBELLE

      for (var i = 0; i < metiers.length; i++) {
        if (metiers[i]['pk_user_metier'] === $scope.formData.metier.pk_user_metier) {
          $scope.formData.metier.libelle = metiers[i]['libelle'];
          break;
        }
      }

      if (typeof $scope.formData.metier === 'undefined')
        $scope.formData.metier = {};
      //$scope.formData.metier.originalObject={'pk_user_metier': $scope.formData.metier.pk_user_metier, 'libelle': $scope.formData.metier.libelle};
      document.getElementById('metiers_value').value = $scope.formData.metier['libelle'];
      //$rootScope.$broadcast('update-list-job', {params: {'fk':$scope.formData.metier.pk_user_metier, 'list':'metier'}});

      // VIDER LIST - JOBS
      $scope.formData.jobs = [];
      var jobs = $scope.absoluteJobs;
      for (var i = 0; i < jobs.length; i++) {
        if (jobs[i]['fk_user_metier'] === $scope.formData.metier.pk_user_metier) {
          $scope.formData.jobs.push(jobs[i]);
        }
      }

      // RE-INITIALISE INPUT JOB
      document.getElementById('jobs_value').value = '';
      //$scope.formData.job={};
    };
    $scope.updateAutoCompleteJob = function () {
      $scope.formData.job = JSON.parse($scope.formData.job);

      var jobs = $scope.formData.jobs;
      // RECHERCHE LIBELLE
      for (var i = 0; i < jobs.length; i++) {
        if (jobs[i]['pk_user_competence'] === $scope.formData.job.pk) {
          $scope.formData.job.libelle = jobs[i]['libelle'];
          break;
        }
      }

      if (typeof $scope.formData.job === 'undefined')
        $scope.formData.job = {};
      $scope.formData.job.originalObject = {
        'pk_user_competence': $scope.formData.job.pk,
        'libelle': $scope.formData.job.libelle
      };

      document.getElementById('jobs_value').value = $scope.formData.job['libelle'];
    };
    function formatDate(d) {
      if (typeof d === "string") {
        var day = d.split("-")[2];
        var monthIndex = d.split("-")[1];
        var year = d.split("-")[0];
        return new Date(year, monthIndex, day);
      } else {
        var day = d.getDate();
        var monthIndex = d.getMonth() + 1;
        var year = d.getFullYear();
        return new Date(year, monthIndex, day);
      }

    }

    $scope.initAll = function () {
      console.log("initAll");
      if ($scope.offre) {

        $scope.formData = {
          'maitrise': $scope.offre.pricticesJob[0].level, //'Débutant',
          'maitriseIcon': 'tree1_small.png',
          'maitriseStyle': "display: inline;max-width: 33px;max-height: 50px;",
          'maitriseLangueIcon': 'tree1_small.png',
          'maitriseLangue': 'Débutant',
          'maitriseLangueStyle': "display: inline;max-width: 33px;max-height: 50px;",
          'heureDebut': 0,
          'heureFin': 0,
          'heureDebutFormat': '00h00',
          'heureFinFormat': '00h00',
          'jourSelect': "Lundi"
        };
        $scope.formData.metiers = DataProvider.getMetiers();
        $scope.formData.langues = DataProvider.getLangues();
        $scope.formData.jobs = DataProvider.getJobs();
        $scope.absoluteJobs = DataProvider.getJobs();
        $scope.formData.transvers = DataProvider.getTransvers();
        $scope.formData.jours = DataProvider.getDays();
        $scope.formData.degre = $scope.offre.degre;
        $scope.rangeChange();
        if ($scope.offre.jours) {
          for (var i = 0; i < $scope.offre.jours.length; i++) {
            for (var j = 0; j < $scope.formData.jours.length; j++) {
              if ($scope.formData.jours[j].pk_user_jour_de_la_semaine == $scope.offre.jours[i].pk_user_jour_de_la_semaine)
                $scope.formData.jours[j].checked = true;
            }
          }
        }
        console.log($scope.offre);
        if ($scope.offre.title)
          $scope.formData.titre = $scope.offre.title;

        /*if ($scope.offre.pricticesJob[0])
         DataProvider.getMetierByIdJob($scope.offre.pricticesJob[0].pricticeJobId).success(function (data) {
         $scope.formData.metier = data.data[0];
         });*/
        if ($scope.offre.pricticesJob[0])
          $scope.formData.metier = $scope.offre.pricticesJob[0].metier;
        if ($scope.offre.pricticesJob[0])
          $scope.formData.job = $scope.offre.pricticesJob[0];
        if ($scope.offre.pricticesIndisponsables)
          $scope.formData.qiList = $scope.offre.pricticesIndisponsables;
        if ($scope.offre.pricticesLanguage)
          $scope.formData.languesList = $scope.offre.pricticesLanguage;
        if ($scope.offre.remuneration)
          $scope.formData.remuneration = $scope.offre.remuneration;
        if ($scope.offre.disponibilite[0] && $scope.offre.disponibilite[0].repetitions){
          for (var i = 0; i < $scope.offre.disponibilite[0].repetitions.length; i++)
            for (var j = 0; j < $scope.offre.disponibilite[0].repetitions.length; j++)
              $scope.formData.horaires += {
                "jour" :$scope.offre.disponibilite[0].repetitions[i].jour,
                "heureDebut" : $scope.offre.disponibilite[0].repetitions[i].plagesHoraires[j].heureDebut,
                "heureFin" : $scope.offre.disponibilite[0].repetitions[i].plagesHoraires[j].heureFin
              }
            $scope.formData.horaires = $scope.offre.horaires;
        }
        else
          $scope.formData.horaires = [];
        console.log('init called');

        if ($scope.offre.disponibilite[0] && $scope.offre.disponibilite[0].dateDebut)
          $scope.formData.dateDebut = formatDate(new Date(parseInt($scope.offre.disponibilite[0].dateDebut)));
        else
          $scope.formData.dateDebut = formatDate(new Date());

        if ($scope.offre.disponibilite[0] && $scope.offre.disponibilite[0].dateFin)
          $scope.formData.dateFin = formatDate(new Date(parseInt($scope.offre.disponibilite[0].dateFin)));
        else
          $scope.formData.dateFin = formatDate(new Date());

      } else
        $scope.formData = {
          'maitrise': 'Débutant',
          'maitriseIcon': 'tree1_small.png',
          'maitriseStyle': "display: inline;max-width: 33px;max-height: 50px;",
          'maitriseLangueIcon': 'tree1_small.png',
          'maitriseLangue': 'Débutant',
          'maitriseLangueStyle': "display: inline;max-width: 33px;max-height: 50px;",
          'metiers': DataProvider.getMetiers(),
          'langues': DataProvider.getLangues(),
          'jobs': DataProvider.getJobs(),
          'absoluteJobs': DataProvider.getJobs(),
          'transvers': DataProvider.getTransvers(),
          //'dateFin': "Jamais",
          'jourSelect': "Lundi",
          'heureDebut': 0,
          'heureFin': 0,
          'heureDebutFormat': '00h00',
          'heureFinFormat': '00h00',
          horaires: [],
          jours: DataProvider.getDays(),
          qiList: [],
          languesList: [],
          qi: {},
          degre: 10,
          selectedLangue: {},
          dateDebut: formatDate(new Date()),
          dateFin: formatDate(new Date())
        };
      console.log($scope.formData.dateDebut);
      console.log($scope.formData.dateFin);
    };

    $scope.rangeChange = function () {
      var rangeModel = $scope.formData.degre;

      if (rangeModel <= 25) {
        $scope.formData.maitrise = "Débutant";
        $scope.formData.maitriseIcon = "tree1_small.png";
        $scope.formData.maitriseWidth = "33px";
        $scope.formData.maitriseHeight = "50px";
      }

      else if (rangeModel > 25 && rangeModel <= 50) {
        $scope.formData.maitrise = 'Habitué';
        $scope.formData.maitriseIcon = "tree2_small.png";
        //$scope.formData.maitriseStyle = "display: inline;max-width: 33px;max-height: 50px;";
      }

      else if (rangeModel > 50 && rangeModel <= 75) {
        $scope.formData.maitrise = 'Confirmé';
        $scope.formData.maitriseIcon = "tree3_small.png";
        //$scope.formData.maitriseStyle = "display: inline;max-width: 59px;max-height: 77px;";
      }
      else if (rangeModel > 75 && rangeModel <= 100) {
        $scope.formData.maitrise = 'Waouh!';
        $scope.formData.maitriseIcon = "tree4_small.png";
        //$scope.formData.maitriseStyle = "display: inline;max-width: 60px;max-height: 80px;";
      }
    };

    $scope.rangeLangueChange = function () {
      var rangeModel = $scope.formData.degreLangue;

      if (rangeModel <= 25) {
        $scope.formData.maitriseLangue = "Débutant";
        $scope.formData.maitriseLangueIcon = "tree1_small.png";
        $scope.formData.maitriseLangueWidth = "33px";
        $scope.formData.maitriseLangueHeight = "50px";
      }

      else if (rangeModel > 25 && rangeModel <= 50) {
        $scope.formData.maitriseLangue = 'Habitué';
        $scope.formData.maitriseLangueIcon = "tree2_small.png";
        //$scope.formData.maitriseLangueStyle = "display: inline;max-width: 33px;max-height: 50px;";
      }

      else if (rangeModel > 50 && rangeModel <= 75) {
        $scope.formData.maitriseLangue = 'Confirmé';
        $scope.formData.maitriseLangueIcon = "tree3_small.png";
        //$scope.formData.maitriseLangueStyle = "display: inline;max-width: 59px;max-height: 77px;";
      }
      else if (rangeModel > 75 && rangeModel <= 100) {
        $scope.formData.maitriseLangue = 'Waouh!';
        $scope.formData.maitriseLangueIcon = "tree4_small.png";
        //$scope.formData.maitriseLangueStyle = "display: inline;max-width: 60px;max-height: 80px;";
      }
    };

    $scope.ajouterQi = function () {
      var qi;

      if ($scope.formData.indisp != "Qualités indispensables")
        qi = JSON.parse($scope.formData.indisp);
      if (qi != undefined) {
        var qiList = $scope.formData.qiList;
        for (var i = 0; i < qiList.length; i++) {
          if (qiList[i].pk_user_competence_transverse == qi.pk_user_competence_transverse) {
            Global.showAlertValidation("Cette qualité existe déjà dans la liste.");
            return;
          }
        }
        $scope.formData.qiList.push(qi);

      } else {
        Global.showAlertValidation("Veuillez séléctionner une qualité.");
      }
    };

    $scope.supprimerQi = function () {
      var qiList = $scope.formData.qiList;
      if (qiList.length != 0) {
        var qi = $scope.formData.qi;
        if (qi.selected) {
          var index = qiList.indexOf(qi);
          $scope.formData.qiList.splice(index, 1);
          $scope.formData.qi = {selected: false};
        } else
          Global.showAlertValidation("Veuillez séléctionner une qualité.");
      } else {
        Global.showAlertValidation("La liste est vide.");
      }
    };

    $scope.onChange = function (item) {

      if (item.selected)
        item.selected = false;
      else
        item.selected = true;

    };

    $scope.ajouterLangue = function () {
      var langue;
      if ($scope.formData.langue != "Langue")
        langue = JSON.parse($scope.formData.langue);
      if (langue != undefined) {
        var languesList = $scope.formData.languesList;
        for (var i = 0; i < languesList.length; i++) {
          if (languesList[i].pk_user_langue == langue.pk_user_langue) {
            Global.showAlertValidation("Cette langue existe déjà dans la liste.");
            return;
          }
        }
        langue.maitriseLangue = $scope.formData.maitriseLangue;
        $scope.formData.languesList.push(langue);

      } else {
        Global.showAlertValidation("Veuillez séléctionner une langue.");
      }
    };


    $scope.supprimerLangue = function () {
      var languesList = $scope.formData.languesList;
      if (languesList.length != 0) {
        var langue = $scope.formData.selectedLangue;
        if (langue.selected) {
          var index = languesList.indexOf(langue);
          $scope.formData.languesList.splice(index, 1);
          $scope.formData.selectedLangue = {selected: false};
        } else
          Global.showAlertValidation("Veuillez séléctionner une langue.");
      } else {
        Global.showAlertValidation("La liste est vide.");
      }
    };
    $scope.gotToOffres = function () {
      var myPopup2 = $ionicPopup.show({
        template: "Voulez-vous enregistrer cette offre ?<br>",
        title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
        buttons: [
          {
            text: '<b>Non</b>',
            type: 'button-dark',
            onTap: function (e) {
              myPopup2.close();
              $state.go('menu.offres');
            }
          }, {
            text: '<b>Oui</b>',
            type: 'button-calm',
            onTap: function (e) {
              $scope.validerOffre();
            }
          }
        ]
      });
    };

    //validate date
    function validateDate() {
      if (($scope.formData.dateDebut) > ($scope.formData.dateFin)) {
        Global.showAlertValidation("La Date de Fin doit être supérieur à l'heure de début. ");
        return false;
      }
      return true;
    }

    $scope.validerOffre = function () {
      var titre = '';
      var metier;
      var job;
      var langues = [];
      var indispensables = [];
      var disponibilites;
      var plagesHoraires = [];
      var remuneration;


      if (!$scope.selectedDates || $scope.selectedDates.length == 0) {
        Global.showAlertValidation("Vous n'avez pas ajouter des dates valides,Veuillez cliquer sur l'agenda pour les ajouter.");
        return false;
      };

      if (!$scope.offre)
        $scope.offre = {};
      $scope.offre.degre = $scope.formData.degre;

      console.log($scope.formData.job);
      if ($scope.formData.job && $scope.formData.job.originalObject)
        $scope.offre.titre = $scope.formData.job.originalObject.libelle + " " + $scope.formData.maitrise;
      else if ($scope.formData.job)
        $scope.offre.titre = $scope.formData.job.libelle + " " + $scope.formData.maitrise;
      else
        $scope.offre.titre = $scope.formData.maitrise;
      titre = $scope.offre.titre;
      $scope.offre.metier = $scope.formData.metier.originalObject;
      metier = $scope.offre.metier.pk_user_metier;
      $scope.offre.job = $scope.formData.job.originalObject;
      job = $scope.offre.job.pk_user_competence;
      $scope.offre.qiList = $scope.formData.qiList;
      for (var i = 0; i < $scope.offre.qiList.length; i++)
        indispensables.push({
          "class": "com.vitonjob.QIndispensable",
          "qi": $scope.offre.qiList[i].pk_user_competence_transverse
        });
      $scope.offre.languesList = $scope.formData.languesList;
      for (var i = 0; i < $scope.offre.languesList.length; i++) {
        var l = {
          "class": "com.vitonjob.Langue",
          "pk": $scope.offre.languesList[i].pk_user_langue,
          "maitrise": $scope.offre.languesList[i].maitriseLangue
        };
        langues.push(l);
      }

      $scope.offre.remuneration = $scope.formData.remuneration;
      remuneration = $scope.offre.remuneration;


      //TEL 31/03/2016 New agenda :
      var weekday = new Array(7);
      weekday[0] = "Dimanche";
      weekday[1] = "Lundi";
      weekday[2] = "Mardi";
      weekday[3] = "Mercredi";
      weekday[4] = "Jeudi";
      weekday[5] = "Vendredi";
      weekday[6] = "Samedi";
      if ($scope.selectedDates.length > 0) {
        $scope.formData.horaires = [];
        for (var i = 0; i < $scope.selectedDates.length; i++) {
          $scope.formData.horaires.push({
              "jour": weekday[$scope.selectedDates[i].date.getDay()],
              "heureDebut": $scope.selectedDates[i].startHour,
              "heureFin": $scope.selectedDates[i].endHour
            }
          )
        }
      }

      $scope.offre.horaires = $scope.formData.horaires;
      for (var i = 0; i < $scope.offre.horaires.length; i++) {
        var ho = $scope.offre.horaires[i];
        var h = {
          "class": "com.vitonjob.PlageHoraire",
          "jour": ho.jour,
          "heureDebut": ho.heureDebut,
          "heureFin": ho.heureFin
        };
        plagesHoraires.push(h);
      }

      //validate date
      var accept = validateDate();
      if (accept) {
        //date debut
        if (!$scope.formData.dateDebut)
          $scope.formData.dateDebut = new Date();
        var dateDebutFormatted = formatDate($scope.formData.dateDebut);
        console.log('dateDebutFormatted' + dateDebutFormatted + typeof dateDebutFormatted);

        //date fin
        if (!$scope.formData.dateFin)
          $scope.formData.dateFin = new Date();

        var dateFinFormatted = formatDate($scope.formData.dateFin);

        console.log('dateFinFormatted' + dateFinFormatted + typeof dateFinFormatted);

        $scope.offre.dateDebut = dateDebutFormatted.getFullYear() + "-" + dateDebutFormatted.getMonth() + "-" + dateDebutFormatted.getDate();
        $scope.offre.dateFin = dateFinFormatted.getFullYear() + "-" + dateFinFormatted.getMonth() + "-" + dateFinFormatted.getDate();

      }
      disponibilites = {
        "class": "com.vitonjob.Disponibilite",
        "dateDebut": $scope.offre.dateDebut,
        "dateFin": $scope.offre.dateFin,
        "plagesHoraires": plagesHoraires
      };
      var offre = $scope.offre;
      console.log(offre);
      console.log($scope.formData);

      /*
       * ICI PERSISTENCE
       */
      var currentEmployer = localStorageService.get('currentEmployer');
      var eid = currentEmployer.entreprises[0].entrepriseId;
      jobyerService.enregistrerOffre(
        eid,
        titre,
        job,
        langues,
        indispensables,
        disponibilites,
        remuneration)
        .success(function (response){
          console.log(response);
          var employeur = localStorageService.get('currentEmployer');
          var entreprises = employeur.entreprises;
          var offers = entreprises[0].offers;

          if (offers == undefined)
            offers = [];

          /*offers.push (response[0].value);
          employeur.entreprises[0].offers = offers;
          localStorageService.set('currentEmployer', employeur);*/

        }).error(queryError);

      var exist = false;
      if ($rootScope.offres !== undefined) {
        console.log("$rootScope.offres.length = " + $rootScope.offres.length);
        for (var i = 0; i < $rootScope.offres.length; i++) {
          console.log("$rootScope.offres[i].pk = " + $rootScope.offres[i].pk);
          if ($rootScope.offres[i].pk == offre.pk) {
            $rootScope.offres[i] = offre;
            exist = true;
            break;
          }
          else {
            exist = false;
          }
        }

        if (!exist) {
          offre.etat = "publie";
          offre.pk = $rootScope.offres.length + 1;
          $rootScope.offres.push(offre);
          $scope.jobyersOffers = localStorageService.get('jobyersOffers');
          if ($scope.jobyersOffers == undefined)
            $scope.jobyersOffers = [];
          $scope.jobyersOffers.push(offre);
        }
      }

      // stock new offer in currentemployer localstorage variable
      var entreprises = localStorageService.get('currentEmployer').entreprises;
      var offers = entreprises[0].offers;

      if (offers == undefined)
        offers = [];

      offers.push(
        {
          "offerId": offers.length + 1,
          "title" : titre,
          "remuneration" : remuneration,
          "publiee" : "false",
          "pricticesJob" : [{
            "pricticeJobId": "",
            "metier": $scope.offre.metier.libelle,
            "job": $scope.offre.job.libelle,
            "level": $scope.offre.job.level
          }],
          "pricticesLanguage" : $scope.offre.languesList,
          "pricticesIndisponsables" : $scope.offre.qiList,
          "disponibilite" : [
            {
              "disponibiliteId" : "",
              "dateDebut" : $scope.offre.dateDebut,
              "dateFin" : $scope.offre.dateFin,
              "Repetitions" : []
            }
          ]
        }
      );

      var employeur = localStorageService.get('currentEmployer');
      employeur.entreprises[0].offers = offers;
      localStorageService.set ('currentEmployer', employeur);

      /*if ($rootScope.offres == undefined)
        localStorageService.set('offres', []);
      else {
        var offerPerUser = [];
        offerPerUser.id = localStorageService.get('currentEmployer').id;
        offerPerUser.values = $rootScope.offres;
        listOffersPerUser.push(offerPerUser);
        localStorageService.set('offres', listOffersPerUser);
      }*/

      $state.go('menu.offres');

    };
    var idUser = 1;
    var listOffersPerUser = [];

    $scope.$on('update-list-job', function (event, args) {

      var params = args.params;

      // VIDER LIST - JOBS
      $scope.formData.jobs = [];
      var jobs = $scope.absoluteJobs;
      for (var i = 0; i < jobs.length; i++) {
        if (jobs[i]['fk_user_metier'] === params.fk)
          $scope.formData.jobs.push(jobs[i]);
      }
    });

    var querySuccess = function (data) {
      console.log(data);
    }
    var queryError = function (data) {
      console.log(data);
    }

    $scope.ajouterHoraire = function () {

      var valid = $scope.validateHoraire();

      if (valid) {
        $scope.formData.horaires.push({
          "jour": $scope.formData.jourSelect,
          "heureDebut": $scope.formData.heureDebutFormat,
          "heureFin": $scope.formData.heureFinFormat,
          "minuteDebut": $scope.formData.heureDebut,
          "minuteFin": $scope.formData.heureFin
        });
      }
    };

    $scope.supprimerHoraire = function () {
      if ($scope.formData.horaires) {
        if ($scope.formData.horaires.length > 0 && typeof($scope.formData.horaireSelect) !== "undefined") {
          $scope.formData.horaires.splice($scope.formData.horaireSelect, 1);
          $scope.formData.editShow = false;
          delete $scope.formData.horaireSelect;
        }
      } else {
        Global.showAlertValidation("La liste est vide.");
      }
    };

    $scope.editerHoraire = function () {

      if ($scope.formData.horaires.length > 0 && typeof($scope.formData.horaireSelect) !== "undefined") {
        var horaireSelect = $scope.formData.horaires[$scope.formData.horaireSelect];

        $scope.formData.jourSelect = horaireSelect.jour;
        $scope.formData.heureDebut = horaireSelect.minuteDebut;
        $scope.formData.heureDebutFormat = horaireSelect.heureDebut;
        $scope.formData.heureFin = horaireSelect.minuteFin;
        $scope.formData.heureFinFormat = horaireSelect.heureFin;
        $scope.formData.editShow = true;
      }
    };

    $scope.saveEditHoraire = function () {

      var valid = $scope.validateHoraire("update");
      if (valid) {
        $scope.formData.horaires[$scope.formData.horaireSelect] = {
          "jour": $scope.formData.jourSelect,
          "heureDebut": $scope.formData.heureDebutFormat,
          "heureFin": $scope.formData.heureFinFormat,
          "minuteDebut": $scope.formData.heureDebut,
          "minuteFin": $scope.formData.heureFin
        };
        $scope.formData.editShow = false;
      }
    };


    var options = {
      date: new Date(),
      mode: 'date', // or 'time'
      minDate: new Date() - 10000,
      allowOldDates: true,
      allowFutureDates: true,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };


    /*$scope.showDatePickerDebut = function() {
     console.log(document.getElementById('dateDebutInput'));
     console.log(angular.element('#dateDebutInput'));
     document.getElementById('dateDebutInput').focus();
     //angular.element('#dateDebutInput').triggerHandler('click');
     };

     $scope.showDatePickerFin = function() {
     document.getElementById('dateFinInput').focus();
     };*/


    /*function () {


     document.addEventListener("deviceready", function () {

     $cordovaDatePicker.show(options).then(function(date){
     $scope.formData.dateDebut = date;
     });


     }, false);

     };*/

    /*  $scope.dateFin = function () {

     $cordovaDatePicker.show(options).then(function(date){
     $scope.formData.dateFin = date;
     });

     };*/

    $scope.heureChange = function (params) {
      if (params === 'debut') {
        var restofdiv = ($scope.formData.heureDebut % 60 === 0 ? "00" : $scope.formData.heureDebut % 60)
        $scope.formData.heureDebutFormat = ($scope.formData.heureDebut === "0" ? "00h00" : Math.floor($scope.formData.heureDebut / 60) + "h" + restofdiv);
      }
      else if (params === 'fin') {
        var restofdiv = ($scope.formData.heureFin % 60 === 0 ? "00" : $scope.formData.heureFin % 60)
        $scope.formData.heureFinFormat = ($scope.formData.heureFin === "0" ? "00h00" : Math.floor($scope.formData.heureFin / 60) + "h" + restofdiv);
      }
    };

    $scope.validateHoraire = function (params) {
      if (parseInt($scope.formData.heureDebut) >= parseInt($scope.formData.heureFin)) {
        Global.showAlertValidation("L'heure de fin doit être supérieur à l'heure de début.");
        return false;
      }
      else if ($scope.horaireExist(params)) {
        Global.showAlertValidation("L horaire choisie existe déja.");
        return false
      }

      return true;

    };


    $scope.horaireExist = function (params) {

      for (var index in $scope.formData.horaires) {

        var horaire = $scope.formData.horaires[index];

        if (horaire.jour === $scope.formData.jourSelect) {

          if (params !== "update" || parseInt(index) !== $scope.formData.horaireSelect) {
            if (parseInt(horaire.minuteDebut) >= parseInt($scope.formData.heureDebut) && parseInt(horaire.minuteDebut) <= parseInt($scope.formData.heureFin)) {
              return true;
            }
            else if (parseInt($scope.formData.heureDebut) >= parseInt(horaire.minuteDebut) && parseInt($scope.formData.heureDebut) <= parseInt(horaire.minuteFin)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    $scope.changeEditState = function () {
      if ($scope.formData.editShow) {
        $scope.formData.editShow = false
      }
    };

    //################# Agenda parameters ####################
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

      selectType: 'MULTI', // SINGLE | PERIOD | MULTI

      tglSelectByWeekShow: true, // true | false (default)
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
    };

    $scope.fixedStartHour = "--:--";
    $scope.fixedEndHour = "--:--";

    $scope.timePicker = function () {
      var ipObj1 = {
        callback: function (val) {      //Mandatory
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            var selectedTime = new Date(val * 1000);
            var hours = (selectedTime.getUTCHours() < 10) ? "0" + selectedTime.getUTCHours() : selectedTime.getUTCHours();
            var minutes = (selectedTime.getUTCMinutes() < 10) ? "0" + selectedTime.getUTCMinutes() : selectedTime.getUTCMinutes();
            $scope.fixedStartHour = hours + ":" + minutes;
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
          }
        }//,
        //inputTime: 50400,   //Optional
        //format: 12,         //Optional
        //step: 15//,           //Optional
        //setLabel: 'Set2'    //Optional
      };

      ionicTimePicker.openTimePicker(ipObj1);
    };

    $scope.timePicker2 = function () {
      var ipObj1 = {
        callback: function (val) {      //Mandatory
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            var selectedTime = new Date(val * 1000);
            var hours = (selectedTime.getUTCHours() < 10) ? "0" + selectedTime.getUTCHours() : selectedTime.getUTCHours();
            var minutes = (selectedTime.getUTCMinutes() < 10) ? "0" + selectedTime.getUTCMinutes() : selectedTime.getUTCMinutes();
            $scope.fixedEndHour = hours + ":" + minutes;
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
          }
        }
      };

      ionicTimePicker.openTimePicker(ipObj1);
    };

    $scope.timePickerStart = function (d) {
      var ipObj1 = {
        callback: function (val) {      //Mandatory
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            var selectedTime = new Date(val * 1000);
            var hours = (selectedTime.getUTCHours() < 10) ? "0" + selectedTime.getUTCHours() : selectedTime.getUTCHours();
            var minutes = (selectedTime.getUTCMinutes() < 10) ? "0" + selectedTime.getUTCMinutes() : selectedTime.getUTCMinutes();
            d.startHour = hours + ":" + minutes;
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
          }
        }
      };

      ionicTimePicker.openTimePicker(ipObj1);
    };

    $scope.timePickerEnd = function (d) {
      var ipObj1 = {
        callback: function (val) {      //Mandatory
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            var selectedTime = new Date(val * 1000);
            var hours = (selectedTime.getUTCHours() < 10) ? "0" + selectedTime.getUTCHours() : selectedTime.getUTCHours();
            var minutes = (selectedTime.getUTCMinutes() < 10) ? "0" + selectedTime.getUTCMinutes() : selectedTime.getUTCMinutes();
            d.endHour = hours + ":" + minutes;
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
          }
        }
      };

      ionicTimePicker.openTimePicker(ipObj1);
    };

    $scope.isChecked = false;
    $scope.checkAction = function (bool) {
      if (bool && $scope.selectedDates) {
        for (var i = 0; i < $scope.selectedDates.length; i++) {
          $scope.selectedDates[i].startHour = $scope.fixedStartHour;
          $scope.selectedDates[i].endHour = $scope.fixedEndHour;
        }
      }
    };


  });
