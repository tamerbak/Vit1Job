/**
 * Created by Tamer on 14/10/2015.
 */
'use strict';
starter
  .controller('listNextCtrl', function ($scope, $rootScope, $ionicModal, $http,x2js) {

    $scope.jobyersNextToMe = $rootScope.jobyersNextToMe;

    // Tri de la table
    
    var onSuccess = function (data, status, headers, config) {
      if(data.status = 'success')
      {
        if(data.error)
        {
          alert(data.error);
        }
        else
        {
          var dataLenght = data.data.length;
          var jobyerArray = new Array(dataLenght);
          var jobyer;
          for(var i = 0; i < dataLenght; i++)
          {
            jobyer = { firstName: data.data[i].salarie, distance: 0, availability: 0 };
            jobyerArray[i] = jobyer;
          }
          
          $scope.jobyersNextToMe = jobyerArray;
        }
      }
      else if(data.status = 'failure')
      {
        alert(data.error);
      }
    };

    var onError = function (data, status, headers, config) {
      alert(status);
    };

    $rootScope.queryText = 'serveur';

    var query = "SELECT user_salarie.nom AS salarie,";
    query += "user_competence.libelle AS competence,";
    query += "user_adresse_salarie.num AS numero_adresse,";
    query += "user_adresse_salarie.rue AS rue_adresse,";
    query += "user_adresse_salarie.complement AS complement_adresse,";
    query += "user_code_postal.libelle AS codePostal,";
    query += "user_ville.nom AS ville,";
    query += "user_pays.nom AS pays ";
    query += "FROM user_salarie ";
    query += "FULL JOIN user_adresse_salarie ON user_salarie.pk_user_salarie = user_adresse_salarie.fk_user_salarie ";
    query += "FULL JOIN user_code_postal ON user_code_postal.pk_user_code_postal = user_adresse_salarie.fk_user_code_postal ";
    query += "FULL JOIN user_ville ON user_ville.pk_user_ville = user_adresse_salarie.fk_user_ville ";
    query += "FULL JOIN user_pays ON user_pays.pk_user_pays = user_ville.fk_user_pays ";
    query += "INNER JOIN user_competence_salarie ON user_salarie.pk_user_salarie = user_competence_salarie.fk_user_salarie ";
    query += "INNER JOIN user_competence ON user_competence.pk_user_competence = user_competence_salarie.fk_user_competence ";
    query += "WHERE LOWER(user_competence.libelle) = '" + $rootScope.queryText + "';";
    
    var request = {
      method : 'POST',
      url : 'http://ns389914.ovh.net:8080/vit1job/api/sql',
      headers : {
        'Content-Type' : 'text/plain'
      },
      data : query
    };

    $http(request).success(onSuccess).error(onError);

    $scope.init = function () {

      // $scope.jobyersNextToMe = [
      //   { firstName: 'mohammed', distance: 10, availability: 0 },
      //   { firstName: 'adil', distance: 20, availability: 0 },
      //   { firstName: 'sami', distance: 15, availability: 0 },
      //   { firstName: 'mehdi', distance: 45, availability: 0 },
      //   { firstName: 'tamer', distance: 0, availability: 0 },
      //   { firstName: 'khalid', distance: 95, availability: 0 },
      //   { firstName: 'mourad', distance: 100, availability: 0 },
      //   { firstName: 'ali', distance: 55, availability: 0 }
      // ];

      $scope.SortOrder = undefined;

      $scope.position = { checked: false, minDistance: 15 };

      var todayDate = new Date();
      todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
      $scope.availability = {
        checked: false,
        startDate: todayDate,
        endDate: todayDate,
        currentDate: new Date()
      };

      $scope.matching = { checked: false }

    }

    $scope.sort = function () {

      if ($scope.position.checked) {
        $scope.SortOrder = '+distance';
      }

      if ($scope.matching.checked) {

      }

      if ($scope.availability.checked) {
        $scope.SortOrder = '+availability';
      }

    };

    $scope.moredata = false;

    $scope.loadMoreData = function () {
      var index = $scope.jobyersNextToMe.length;
      $scope.jobyersNextToMe.push({ firstName: 'mohammed' + index, distance: 10, availability: 0 });
      if ($scope.jobyersNextToMe.length == 100) {
        $scope.moredata = true;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    // Fin Tri de la table

    $scope.matchingOptions = {
      'comp': 20,
      'job': 20,
      'mait': 20,
      'indis': 20,
      'lang': 20
    };

    $scope.$watch('matchingOptions.comp', function (oldval, newval) {
      if (newval < 0)
        $scope.matchingOptions.comp = oldval;
      else if (newval > 100)
        $scope.matchingOptions.comp = oldval;
      else {
        $scope.matchingOptions.job = (100 - $scope.matchingOptions.comp) / 4;
      }
    });

    $scope.$watch('matchingOptions.job', function (oldval, newval) {
      if (newval < 0)
        $scope.matchingOptions.job = oldval;
      else if (newval > 100)
        $scope.matchingOptions.job = oldval;
      else {
        $scope.matchingOptions.mait = (100 - $scope.matchingOptions.job - $scope.matchingOptions.comp) / 3;
        $scope.matchingOptions.indis = (100 - $scope.matchingOptions.job - $scope.matchingOptions.comp) / 3;
        $scope.matchingOptions.lang = (100 - $scope.matchingOptions.job - $scope.matchingOptions.comp) / 3;
      }
    });

    $scope.$watch('matchingOptions.mait', function (oldval, newval) {
      if (newval < 0)
        $scope.matchingOptions.mait = oldval;
      else if (newval > 100)
        $scope.matchingOptions.mait = oldval;
      else {
        $scope.matchingOptions.indis = (100 - $scope.matchingOptions.mait - $scope.matchingOptions.comp - $scope.matchingOptions.job) / 2;
        $scope.matchingOptions.lang = (100 - $scope.matchingOptions.mait - $scope.matchingOptions.comp - $scope.matchingOptions.job) / 2;
      }
    });

    $scope.$watch('matchingOptions.indis', function (oldval, newval) {
      if (newval < 0)
        $scope.matchingOptions.indis = oldval;
      else if (newval > 100)
        $scope.matchingOptions.indis = oldval;
      else {
        $scope.matchingOptions.lang = (100 - $scope.matchingOptions.mait - $scope.matchingOptions.comp - $scope.matchingOptions.job - $scope.matchingOptions.indis);
      }
    });

    $scope.$watch('matchingOptions.lang', function (oldval, newval) {
      if (newval < 0)
        $scope.matchingOptions.lang = oldval;
      else if (newval > 100)
        $scope.matchingOptions.lang = oldval;
      else {
        if (newval > (100 - $scope.matchingOptions.mait - $scope.matchingOptions.comp - $scope.matchingOptions.job - $scope.matchingOptions.indis))
          $scope.matchingOptions.lang = oldval;
      }
    });

    $scope.initiateParams = function () {
      $scope.matchingOptions = {
        'comp': 20,
        'job': 20,
        'mait': 20,
        'indis': 20,
        'lang': 20
      };
    };

    $scope.loadModal = function (template) {
      $ionicModal.fromTemplateUrl(template, {
        scope: $scope,
        animation: 'fade-in'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.openModal();
      });
    };

    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });
  })
;
