/**
 * Created by Tamer on 14/10/2015.
 */
 'use strict';
 starter
 .controller('listNextCtrl', function ($scope, $rootScope, $ionicModal, $http,x2js,GeoService) {

  //$scope.jobyersNextToMe = $rootScope.jobyersNextToMe;

    // Tri de la table

    $scope.init = function () {

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

    var onGoogleGeocodingRequestError = function (data, status, headers, config) {
    };
    
    var onJobyerBySkillRequestSuccess = function (data, status, headers, config) {

      if(data.status = 'success')
      {
        if(data.error)
        {
          alert(data.error);
        }
        else
        {
          var dataLenght = data.data.length;

          if(dataLenght > 0)
          {
            var jobyerArray = new Array(dataLenght);
            var jobyer;
            var address;
            var googleGeocodingRequest;
            var googleGeocodingRequestPrefix = 'https://maps.googleapis.com/maps/api/geocode/json?address='

            for(var i = 0; i < dataLenght; i++)
            {

              address = getAddress(data.data[i]);

              if(address) {

                googleGeocodingRequest = googleGeocodingRequestPrefix + address + '&index=' + i;

                $http.get(googleGeocodingRequest)
                .success((function(i) {
                  return function(data) {

                    var location = (data.results && data.results.length > 0) ? data.results[0].geometry.location : NULL;
                    if(location){
                      GeoService.getUserGeo()
                      .then(function(data) {
                        var userGeo = data;
                        if(userGeo)
                        {
                          var distance = GeoService.getDistanceBetween(userGeo.latitude,userGeo.longitude,location.lat,location.lng)
                          $scope.jobyersNextToMe[i].distance = distance;
                        }
                      });
                    }
                    
                  }
                })(i))
                .error(onGoogleGeocodingRequestError)
              }

              jobyer = { 'name': data.data[i].jobyername, 'distance': 0, 'availability': 0 };

              jobyerArray[i] = jobyer;

            }

            $scope.jobyersNextToMe = jobyerArray;
          }
        }
      }
      else if(data.status = 'failure')
      {
        alert(data.error);
      }

    };

    var getAddress = function(jobyerData){

      var address;

      var number = (jobyerData.number && jobyerData.number.toUpperCase() != "NULL") ? jobyerData.number : '';
      var street = (jobyerData.street && jobyerData.street.toUpperCase() != "NULL") ? '+' + jobyerData.street : '';
      var complement = (jobyerData.complement && jobyerData.complement.toUpperCase() != "NULL") ? '+' +  jobyerData.complement : '';
      var zipCode = (jobyerData.zipcode && jobyerData.zipcode.toUpperCase() != "NULL") ? '+' + jobyerData.zipcode : ''
      var city = (jobyerData.city && jobyerData.city.toUpperCase() != "NULL") ? '+' + jobyerData.city : '';
      var country = (jobyerData.country && jobyerData.country.toUpperCase() != "NULL") ? '+' + jobyerData.country : '';

      var address = number + street + complement + zipCode + city + country;

      return address;

    }

    var onJobyerBySkillRequestError = function (data, status, headers, config) {
      alert(status);
    };

    $rootScope.queryText = 'java';

    var jobyerBySkillQuery = "SELECT user_salarie.pk_user_salarie AS id,";
    jobyerBySkillQuery += "user_salarie.nom AS jobyerName,";
    jobyerBySkillQuery += "user_adresse_salarie.num AS number,";
    jobyerBySkillQuery += "user_adresse_salarie.rue AS street,";
    jobyerBySkillQuery += "user_adresse_salarie.complement AS complement,";
    jobyerBySkillQuery += "user_code_postal.libelle AS zipCode,";
    jobyerBySkillQuery += "user_ville.nom AS city,";
    jobyerBySkillQuery += "user_pays.nom AS country ";
    jobyerBySkillQuery += "FROM user_salarie ";
    jobyerBySkillQuery += "FULL JOIN user_adresse_salarie ON user_salarie.pk_user_salarie = user_adresse_salarie.fk_user_salarie ";
    jobyerBySkillQuery += "FULL JOIN user_code_postal ON user_code_postal.pk_user_code_postal = user_adresse_salarie.fk_user_code_postal ";
    jobyerBySkillQuery += "FULL JOIN user_ville ON user_ville.pk_user_ville = user_adresse_salarie.fk_user_ville ";
    jobyerBySkillQuery += "FULL JOIN user_pays ON user_pays.pk_user_pays = user_ville.fk_user_pays ";
    jobyerBySkillQuery += "INNER JOIN user_competence_salarie ON user_salarie.pk_user_salarie = user_competence_salarie.fk_user_salarie ";
    jobyerBySkillQuery += "INNER JOIN user_competence ON user_competence.pk_user_competence = user_competence_salarie.fk_user_competence ";
    jobyerBySkillQuery += "WHERE LOWER(user_competence.libelle) = '" + $rootScope.queryText + "';";
    
    var jobyerBySkillRequest = {
      method : 'POST',
      url : 'http://ns389914.ovh.net:8080/vit1job/api/sql',
      headers : {
        'Content-Type' : 'text/plain'
      },
      data : jobyerBySkillQuery
    };

    $http(jobyerBySkillRequest).success(onJobyerBySkillRequestSuccess).error(onJobyerBySkillRequestError);

    var jobyerId = 42;
    var jobyerAperiodicAvailabilityQuery = "SELECT user_disponibilite_aperiodique.date_disponibilite AS date_disponibilite,";
    jobyerAperiodicAvailabilityQuery += "user_disponibilite_aperiodique.heure_de_debut AS heure_de_debut,";
    jobyerAperiodicAvailabilityQuery += "user_disponibilite_aperiodique.heure_de_fin AS heure_de_fin ";
    jobyerAperiodicAvailabilityQuery += "FROM user_disponibilite_aperiodique ";
    jobyerAperiodicAvailabilityQuery += "FULL JOIN user_offre_salarie ON user_disponibilite_aperiodique.fk_user_disponibilite_aperiodique__user_offre_salarie = user_offre_salarie.pk_user_offre_salarie ";
    jobyerAperiodicAvailabilityQuery += "FULL JOIN user_salarie ON user_offre_salarie.fk_user_salarie = user_salarie.pk_user_salarie ";
    jobyerAperiodicAvailabilityQuery += "WHERE user_salarie.pk_user_salarie = " + jobyerId;
    //jobyerAperiodicAvailabilityQuery += "AND user_offre_salarie.disponible_du >= '" + ($scope.availability) ? $scope.availability.startDate : NULL+ "'";
    //jobyerAperiodicAvailabilityQuery += "AND user_offre_salarie.disponible_au <= '" + ($scope.availability) ? $scope.availability.endDate : NULL + "'";

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
