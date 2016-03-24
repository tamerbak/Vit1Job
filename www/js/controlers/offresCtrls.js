/**
 * Created by Tamer on 15/10/2015.
 */

'use strict';
starter

  .controller('offresCtrl', function ($scope, $rootScope, Global, $state, $filter, localStorageService) {
    // FORMULAIRE

    //
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
      console.log("Load offers from localStorage");

      var entreprises = localStorageService.get('currentEmployer').entreprises;
      var offers = entreprises[0].offers;

      $rootScope.offres = offers;
    });
    $scope.initAll = function () {

      // GET LIST
      $scope.formData = {'offresPublies': [], 'offresNonPublies': []};
      $scope.formData.offre = {};
      console.log("Load offers from localStorage");

      var entreprises = localStorageService.get('currentEmployer').entreprises;
      var offers = entreprises[0].offers;

      $rootScope.offres = offers;

      if ($rootScope.offres == undefined)
        $rootScope.offres = [];


      /*if (localStorageService.get('offres') !== undefined){
       var tempOffres = localStorageService.get('offres');
       for (var i=0; i<tempOffres.length; i++){
       if (tempOffres[i].id == localStorageService.get('currentEmployer').id){
       $rootScope.offres = tempOffres.values;
       break;
       }
       }
       }*/


      /*
       *  [{pk:1,"titre":"Serveur",selected:false,remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}], etat:"publie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]},
       {pk:2,titre:"java",selected:false,remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}],etat:"publie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]},
       {pk:3,titre:"Chef cuisinier",remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}],etat:"noPublie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]},
       {pk:4,titre:"Serveur debutant",remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}],etat:"noPublie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]},
       {pk:5,titre:"Caissier",remuneration:"99$",jours:[{"pk_user_jour_de_la_semaine":"40","nom":"Lundi"}],dateFin:$filter("date")(Date.now(), 'yyyy-MM-dd'),dateDebut:$filter("date")(Date.now(), 'yyyy-MM-dd'),heures:[{"heureDebut": "2h30min", "heureFin": "4h15min"}],etat:"noPublie",degre:89,metier:{"pk_user_metier":"44","libelle":"Transport"},job:{"pk_user_competence":"60","libelle":"Conducteur","fk_user_metier":"44"},qiList:[{"pk_user_competence_transverse":"40","libelle":"Sérieux"},{"pk_user_competence_transverse":"42","libelle":"Dynamique"},{"pk_user_competence_transverse":"44","libelle":"Souriant"}],languesList:[{"pk_user_langue":"40","libelle":"Français"}]}];

       * */
      var offres = $rootScope.offres;
      for (var i = 0; i < offres.length; i++) {
        if (offres[i].etat == "true")
          $scope.formData.offresPublies.push(offres[i]);
        else
          $scope.formData.offresNonPublies.push(offres[i]);
      }

    };

    $scope.goBackToPrevious = function () {
      window.history.back();
    };

    $scope.offreChange = function (item) {
      console.log(item);
      if (item.selected)
        item.selected = false;
      else
        item.selected = true;
      console.log(item.selected);
    };

    $scope.modifierOffre = function () {
      var offre = $scope.formData.offre;
      console.log($scope.formData.offre);
      if (offre.offerId) {
        $state.go('offreTabs.job', {"offre": JSON.stringify(offre)});
      } else {
        Global.showAlertValidation("Veuillez séléctionner une offre.");
      }
    };
    $scope.editStateOffre = function () {
      console.log("aaaaaaa" + $scope.formData.offre.etat);
      if ($scope.formData.offre.etat == "publie") {
        $scope.formData.offre.etat = "noPublie";
      } else {
        $scope.formData.offre.etat = "publie";
      }
    };
    $scope.dupliquerOffre = function () {
      var offre = $scope.formData.offre;
      if (offre.offerId) {
        var offre1 = {};
        offre1.degre = offre.degre;
        if (offre.jours)
          offre1.jours = offre.jours;
        offre1.etat = offre.etat;
        if (offre.title)
          offre1.title = offre.title;
        if (offre.pricticesJob[0])
          offre1.metier = offre.pricticesJob[0].metier;
        if (offre.pricticesJob[0])
          offre1.job = offre.pricticesJob[0].job;
        if (offre.pricticesIndisponsables)
          offre1.qiList = offre.pricticesIndisponsables;
        if (offre.pricticesLanguage)
          offre1.languesList = offre.pricticesLanguage;
        if (offre.remuneration)
          offre1.remuneration = offre.remuneration;
        if (offre.heures)
          offre1.heures = offre.heures;
        if (offre.dateDebut)
          offre1.dateDebut = offre.dateDebut;
        if (offre.dateFin)
          offre1.dateFin = offre.dateFin;
        offre1.title = offre.title + " (copie)";
        offre1.offerId = $rootScope.offres.length + 2;
        $rootScope.offres.push(offre1);
        console.log("Load offers from localStorage");

        var employeur = localStorageService.get('currentEmployer');
        employeur.entreprises[0].offers = $rootScope.offres;
        localStorageService.set('currentEmployer', employeur);

      } else {
        Global.showAlertValidation("Veuillez séléctionner une offre.");
      }
    };
    $scope.compteCree = function () {
      var employeur = localStorageService.get('currentEmployer');
      if (employeur.new == true)
        Global.showAlertValidation("Bienvenue dans VitOnJob.<br>Vous venez de créer votre compte.<br>Vous pouvez lancer la recherche de jobyers selon vos critères.");
      $state.go('menu.app');
    };
    $scope.supprimerOffre = function () {
      var offre = $scope.formData.offre;
      if (offre.offerId) {
        var offres = $rootScope.offres;
        var indexOffres = offres.indexOf(offre);
        $rootScope.offres.splice(indexOffres, 1);

        console.log("Load offers in localStorage");

        var employeur = localStorageService.get('currentEmployer');
        employeur.entreprises[0].offers = $rootScope.offres;
        localStorageService.set('currentEmployer', employeur);

        if (offre.etat == "publie")
          $scope.formData.offresPublies.splice($scope.formData.offresPublies.indexOf(offre), 1);
        else
          $scope.formData.offresNonPublies.splice($scope.formData.offresNonPublies.indexOf(offre), 1);
        $scope.formData.offre = {selected: false};
      } else {
        Global.showAlertValidation("Veuillez séléctionner une offre.");
      }
    };
    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
      if (states.fromCache && states.stateName == "competence") {
        console.log("Initialisation : beforeEnter(competence)");
        $scope.formData['currentFeuille'] = 1;
        $scope.formData['allFeuilles'] = 1;
      }
    });
  });
