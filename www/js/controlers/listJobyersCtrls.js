/**
 * Created by Tamer on 14/10/2015.

'use strict';
starter
  .controller('listCtrl', function ($scope, $rootScope,$ionicModal,$ionicActionSheet,UserService, localStorageService, $state,$http,x2js,GeoService) {

$scope.init = function () {

      $scope.SortOrder = undefined;

      $scope.position = {
        'checked' : false,
        'sortingMethod' : 'byDistance',
        'minDistance' : 15,
        'transportationMode' : 'driving'
      };

      var todayDate = new Date();
      todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
      $scope.availability = {
        'checked' : false,
        'startDate' : todayDate,
        'endDate' : todayDate,
        'currentDate' : new Date()
      };

      $scope.matching = { checked: false }

      $scope.moredata = false;

      loadJobyersFormPresentation();
      reCalculateDistanceAndDurations();
      reCalculateAvailabilities2();

    };

    // $rootScope.queryText = 'java';

    var jobyeroffersBySkillQuery = "SELECT user_offre_salarie.pk_user_offre_salarie AS jobyerofferid,";
    //jobyeroffersBySkillQuery += "user_salarie.pk_user_salarie AS jobyerid,";
    jobyeroffersBySkillQuery += "user_salarie.nom AS jobyername,";
    jobyeroffersBySkillQuery += "user_adresse_salarie.num AS number,";
    jobyeroffersBySkillQuery += "user_adresse_salarie.rue AS street,";
    jobyeroffersBySkillQuery += "user_adresse_salarie.complement AS complement,";
    jobyeroffersBySkillQuery += "user_code_postal.libelle AS zipcode,";
    jobyeroffersBySkillQuery += "user_ville.nom AS city,";
    jobyeroffersBySkillQuery += "user_pays.nom AS country ";
    jobyeroffersBySkillQuery += "FROM user_salarie ";
    jobyeroffersBySkillQuery += "FULL JOIN user_adresse_salarie ON user_salarie.pk_user_salarie = user_adresse_salarie.fk_user_salarie ";
    jobyeroffersBySkillQuery += "FULL JOIN user_code_postal ON user_code_postal.pk_user_code_postal = user_adresse_salarie.fk_user_code_postal ";
    jobyeroffersBySkillQuery += "FULL JOIN user_ville ON user_ville.pk_user_ville = user_adresse_salarie.fk_user_ville ";
    jobyeroffersBySkillQuery += "FULL JOIN user_pays ON user_pays.pk_user_pays = user_ville.fk_user_pays ";
    jobyeroffersBySkillQuery += "INNER JOIN user_competence_salarie ON user_salarie.pk_user_salarie = user_competence_salarie.fk_user_salarie ";
    jobyeroffersBySkillQuery += "INNER JOIN user_competence ON user_competence.pk_user_competence = user_competence_salarie.fk_user_competence ";
    jobyeroffersBySkillQuery += "INNER JOIN user_offre_salarie ON user_salarie.pk_user_salarie = user_offre_salarie.fk_user_salarie "
    jobyeroffersBySkillQuery += "WHERE LOWER(user_competence.libelle) = '" + $rootScope.queryText + "';";

    var jobyerOffersBySkillRequest = {
      method : 'POST',
      url : 'http://ns389914.ovh.net:8080/vit1job/api/sql',
      headers : {
        'Content-Type' : 'text/plain'
      },
      data : jobyeroffersBySkillQuery
    };

    var googleGeocodingRequestPrefix = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

    // Si succès de la fonction qui récupère les coordonnées depuis l'adresse de l'utilisateur courant
    var onGetUserGeoSuccess = function(location,index) {
      return function(data) {
        var userGeo = data;
        if(userGeo)
        {
          var distance = GeoService.getDistanceBetween(userGeo.latitude,userGeo.longitude,location.lat,location.lng)
          $scope.jobyersNextToMe[index].distance.value = distance;
          $scope.jobyersNextToMe[index].distance.text = distance.toFixed(2) + " Km";
        }
      }
    };

    // Si echec de la fonction qui récupère les coordonnées depuis l'adresse de l'utilisateur courant
    var onGetUserGeoError = function(data){
    };

    // Si succès de la requète https de google geocoding qui récupère les coordonnées depuis l'adresse
    var onGoogleGeocodingRequestSuccess = function(index) {
      return function(data) {
        var location = (data.results && data.results.length > 0) ? data.results[0].geometry.location : NULL;
        if(location){
          GeoService.getUserGeo().then(onGetUserGeoSuccess(location,index), onGetUserGeoError);
        }
      }
    };

    // Si echec de la requète https de google geocoding qui récupère les coordonnées depuis l'adresse
    var onGoogleGeocodingRequestError = function (data) {
    };

    // Construire l'adresse à envoyer au web service geocoding de google
    var getAddress = function(jobyerData){

      var address;

      var number = (jobyerData.number && jobyerData.number.toUpperCase() != "NULL") ? jobyerData.number : '';
      var street = (jobyerData.street && jobyerData.street.toUpperCase() != "NULL") ? '+' + jobyerData.street : '';
      var complement = (jobyerData.complement && jobyerData.complement.toUpperCase() != "NULL") ? '+' +  jobyerData.complement : '';
      var zipCode = (jobyerData.zipcode && jobyerData.zipcode.toUpperCase() != "NULL") ? '+' + jobyerData.zipcode : ''
      var city = (jobyerData.city && jobyerData.city.toUpperCase() != "NULL") ? '+' + jobyerData.city : '';
      var country = (jobyerData.country && jobyerData.country.toUpperCase() != "NULL") ? '+' + jobyerData.country : '';

      var address = number + street + complement + zipCode + city + country;
      if(address){
        address = address.replace(new RegExp(' ', 'g'), '+');
        if(address.startsWith('+')){
          address = address.replace('+','');
        }
      }

      return address;

    };

    var getAddress2 = function(jobyerData){

      var address;

      var number = (jobyerData.number && jobyerData.number.toUpperCase() != "NULL") ? jobyerData.number : '';
      var street = (jobyerData.street && jobyerData.street.toUpperCase() != "NULL") ? ' ' + jobyerData.street : '';
      var complement = (jobyerData.complement && jobyerData.complement.toUpperCase() != "NULL") ? '+' +  jobyerData.complement : '';
      var zipCode = (jobyerData.zipcode && jobyerData.zipcode.toUpperCase() != "NULL") ? ' ' + jobyerData.zipcode : ''
      var city = (jobyerData.city && jobyerData.city.toUpperCase() != "NULL") ? ' ' + jobyerData.city : '';
      var country = (jobyerData.country && jobyerData.country.toUpperCase() != "NULL") ? ' ' + jobyerData.country : '';

      var address = number + street + complement + zipCode + city + country;
      if(address){
        address = address.replace(new RegExp(' ', 'g'), ' ');
        if(address.startsWith(' ')){
          address = address.replace(' ','');
        }
      }

      return address;

    };

    var getSqlDateFormat = function(adate){

      var year = adate.getFullYear();
      var month = adate.getMonth();
      var date = adate.getDate();

      return year + "/" + month + "/" + date;
    }

    var getJobyerOfferPeriodicAvailabilityQuery = function(jobyerOfferId){

      var jobyerOfferPeriodicAvailabilityQuery = "SELECT user_disponibilite_offre_salarie.heure_debut AS starthour,";
      jobyerOfferPeriodicAvailabilityQuery += "user_disponibilite_offre_salarie.heure_fin AS endhour,";
      jobyerOfferPeriodicAvailabilityQuery += "user_jour_de_la_semaine.nom AS day ";
      jobyerOfferPeriodicAvailabilityQuery += "FROM user_disponibilite_offre_salarie ";
      jobyerOfferPeriodicAvailabilityQuery += "INNER JOIN user_offre_salarie ON user_disponibilite_offre_salarie.fk_user_disponibilite_offre_salarie__user_offre_salarie = user_offre_salarie.pk_user_offre_salarie ";
      jobyerOfferPeriodicAvailabilityQuery += "INNER JOIN user_jour_de_la_semaine ON user_disponibilite_offre_salarie.fk_user_jour_de_la_semaine = user_jour_de_la_semaine.pk_user_jour_de_la_semaine ";
      jobyerOfferPeriodicAvailabilityQuery += "WHERE user_disponibilite_offre_salarie.fk_user_disponibilite_offre_salarie__user_offre_salarie = " + jobyerOfferId;
      jobyerOfferPeriodicAvailabilityQuery += " AND user_offre_salarie.disponible_du >= '" + getSqlDateFormat($scope.availability.startDate) + "'";
      jobyerOfferPeriodicAvailabilityQuery += " AND user_offre_salarie.disponible_au <= '" + getSqlDateFormat($scope.availability.endDate) + "'";

      return jobyerOfferPeriodicAvailabilityQuery;
    }

    var getJobyerOfferPeriodicAvailabilityRequest = function(jobyerOfferId){

      var jobyerOfferAperiodicAvailabilityRequest = {
        method : 'POST',
        url : 'http://ns389914.ovh.net:8080/vit1job/api/sql',
        headers : {
          'Content-Type' : 'text/plain'
        },
        data : getJobyerOfferPeriodicAvailabilityQuery(jobyerOfferId)
      };

      return jobyerOfferAperiodicAvailabilityRequest;

    };

    var getJobyerOfferAperiodicAvailabilityQuery = function(jobyerOfferId){

      var jobyerOfferAperiodicAvailabilityQuery = "SELECT user_disponibilite_aperiodique.date_disponibilite AS date,";
      jobyerOfferAperiodicAvailabilityQuery += "user_disponibilite_aperiodique.heure_de_debut AS starthour,";
      jobyerOfferAperiodicAvailabilityQuery += "user_disponibilite_aperiodique.heure_de_fin AS endhour ";
      jobyerOfferAperiodicAvailabilityQuery += "FROM user_disponibilite_aperiodique ";
      jobyerOfferAperiodicAvailabilityQuery += "INNER JOIN user_offre_salarie ON user_disponibilite_aperiodique.fk_user_disponibilite_aperiodique__user_offre_salarie = user_offre_salarie.pk_user_offre_salarie ";
      jobyerOfferAperiodicAvailabilityQuery += "WHERE user_disponibilite_aperiodique.fk_user_disponibilite_aperiodique__user_offre_salarie = " + jobyerOfferId;
      jobyerOfferAperiodicAvailabilityQuery += " AND user_offre_salarie.disponible_du >= '" + ($scope.availability) ? getSqlDateFormat($scope.availability.startDate) : '' + "'";
      jobyerOfferAperiodicAvailabilityQuery += " AND user_offre_salarie.disponible_au <= '" + ($scope.availability) ? getSqlDateFormat($scope.availability.endDate) : '' + "'";

      return jobyerOfferAperiodicAvailabilityQuery;

    };

    var getJobyerOfferAperiodicAvailabilityRequest = function(jobyerOfferId){

      var jobyerOfferAperiodicAvailabilityRequest = {
        method : 'POST',
        url : 'http://ns389914.ovh.net:8080/vit1job/api/sql',
        headers : {
          'Content-Type' : 'text/plain'
        },
        data : getJobyerOfferAperiodicAvailabilityQuery(jobyerOfferId)
      };

      return jobyerOfferAperiodicAvailabilityRequest;

    };

    var getAperiodicAvailability = function(aperiodicAvailabilityData){

      var aperiodicAvailability = {
        'date' : (aperiodicAvailabilityData.date && aperiodicAvailabilityData.date.toUpperCase() != "NULL") ? aperiodicAvailabilityData.date : '',
        'startHour' : (aperiodicAvailabilityData.starthour && aperiodicAvailabilityData.starthour.toUpperCase() != "NULL") ? aperiodicAvailabilityData.starthour : '',
        'endHour' : (aperiodicAvailabilityData.endhour && aperiodicAvailabilityData.endhour.toUpperCase() != "NULL") ? aperiodicAvailabilityData.endhour : ''
      };

      return aperiodicAvailability;

    };

    var getAperiodicAvailabilities = function(aperiodicAvailabilitiesData){

      var aperiodicAvailabilities;

      if(aperiodicAvailabilitiesData && aperiodicAvailabilitiesData.lenght > 0){

        var dataLenght = aperiodicAvailabilitiesData.length;
        aperiodicAvailabilities = new Array(dataLenght);

        for(var i = 0; i < dataLenght; i++){
          aperiodicAvailabilities[i] = getAperiodicAvailability(aperiodicAvailabilitiesData[i]);
        }

      }

      return aperiodicAvailabilities;

    };

    var getPeriodicAvailability = function(periodicAvailabilityData){

      var periodicAvailability = {
        'day' : (periodicAvailabilityData.day && periodicAvailabilityData.day.toUpperCase() != "NULL") ? periodicAvailabilityData.day : '',
        'startHour' : (periodicAvailabilityData.starthour && periodicAvailabilityData.starthour.toUpperCase() != "NULL") ? periodicAvailabilityData.starthour : '',
        'endHour' : (periodicAvailabilityData.endhour && periodicAvailabilityData.endhour.toUpperCase() != "NULL") ? periodicAvailabilityData.endhour : ''
      };

      return periodicAvailability;

    };

    var getPeriodicAvailabilities = function(periodicAvailabilitiesData){

      var periodicAvailabilities;

      if(periodicAvailabilitiesData && periodicAvailabilitiesData.lenght > 0){

        var dataLenght = periodicAvailabilitiesData.length;
        periodicAvailabilities = new Array(dataLenght);

        for(var i = 0; i < dataLenght; i++){
          periodicAvailabilities[i] = getPeriodicAvailability(periodicAvailabilitiesData[i]);
        }

      }

      return periodicAvailabilities;

    };

    // days is an array of weekdays: 0 is Sunday, ..., 6 is Saturday
    // countCertainDays([1,3,5],new Date(2014,8,1),new Date(2014,8,1)) // 1
    // countCertainDays([1,3,5],new Date(2014,8,1),new Date(2014,8,2)) // 1
    // countCertainDays([1,3,5],new Date(2014,8,1),new Date(2014,8,3)) // 2
    var countCertainDays = function(days, d0, d1) {
      var ndays = 1 + Math.round((d1-d0)/(24*3600*1000));
      var sum = function(a,b) {
        return a + Math.floor( ( ndays + (d0.getDay()+6-b) % 7 ) / 7 );
      };
      return days.reduce(sum,0);
    };

    // Récupérer le numéro du jour de la semaine
    var getWeekDayNumber = function(weekDay){
      if (weekDay) {
        weekDay = weekDay.toUpperCase();
      }
      switch(weekDay) {
        case 'DIMANCHE': return 0;
        case 'LUNDI': return 1;
        case 'MARDI': return 2;
        case 'MERCREDI': return 3;
        case 'JEUDI': return 4;
        case 'VENDREDI': return 5;
        case 'SAMEDI': return 6;
        default: return -1;
      }
    };

    // Récupérer la disponibilité periodique par jour de la semaine
    var getPeriodicAvailabilitiesByWeekDay = function(periodicAvailabilities, weekDayNumer){

      var periodicAvailabilitiesByWeekDay = [];
      if(periodicAvailabilities && periodicAvailabilities.length > 0){
        for(var i = 0; i <periodicAvailabilities.length; i++){
          if((getWeekDayNumber(periodicAvailabilities[i].day) = weekDayNumer)){
            periodicAvailabilitiesByWeekDay.push(periodicAvailabilities[i]);
          }
        }
      }
      return periodicAvailabilitiesByWeekDay;

    };

    // Calculer la disponibilité périodique
    var calculatePeriodicAvailability = function(periodicAvailabilities){

      var availability = 0;

      if(periodicAvailabilities && periodicAvailabilities.length > 0){
        for(var i = 0; i < periodicAvailabilities.length; i++){
          hourDiff = periodicAvailabilities[i].endHour - periodicAvailabilities[i].startHour;
          availability += hourDiff * countCertainDays([getWeekDayNumber(periodicAvailabilities[i].day)],$scope.availability.startDate,$scope.availability.endDate);
        }
      }

      return availability;

    };

    // Traitement de la disponibilité apériodique
    var addAperiodicAvailability = function(availability, aperiodicAvailabilities, periodicAvailabilities){

      var hourDiff;
      var periodicAvailabilities;

      if(aperiodicAvailabilities && aperiodicAvailabilities.length > 0){

        for(var i = 0; i < aperiodicAvailabilities.length; i++){

          hourDiff = aperiodicAvailabilities[i].endHour - aperiodicAvailabilities[i].startHour;
          availability += hourDiff;

          periodicAvailabilitiesByWeekDay = getPeriodicAvailabilitiesByWeekDay(periodicAvailabilities,aperiodicAvailabilities[i].date.getDay());

          if(periodicAvailabilitiesByWeekDay && periodicAvailabilitiesByWeekDay.length > 0){
            for(var j = 0; j < periodicAvailabilitiesByWeekDay.length; j++){
              hourDiff = periodicAvailabilitiesByWeekDay[j].endHour - periodicAvailabilitiesByWeekDay[j].startHour;
              availability -= hourDiff;
            }
          }

        }

      }

      return availability;
    };

    // Calcule de la disponibilité
    var onJobyerOfferPeriodicAvailabilityRequestSuccess = function(aperiodicAvailabilities, index){
      return function(data){

        var periodicAvailabilities = (data) ? getPeriodicAvailabilities(data.data) : null;

        var availability = calculatePeriodicAvailability(periodicAvailabilities);

        availability = addAperiodicAvailability(availability, aperiodicAvailabilities, periodicAvailabilities);

        $scope.jobyersNextToMe[index].availability = {
          'text' : availability.toString().toHHMMSS(),
          'value' : availability
        };
      }
    };

    var onJobyerOfferPeriodicAvailabilityRequestError = function(data){
    };

    var onJobyerOfferAperiodicAvailabilityRequestSuccess = function(jobyerOfferId, index){
      return function(data){

        var aperiodicAvailabilities = (data) ? getAperiodicAvailabilities(data.data) : null;

        $http(getJobyerOfferPeriodicAvailabilityRequest(jobyerOfferId))
        .success(onJobyerOfferPeriodicAvailabilityRequestSuccess(aperiodicAvailabilities, index))
        .error(onJobyerOfferPeriodicAvailabilityRequestError);

      }
    };

    var onJobyerOfferAperiodicAvailabilityRequestError = function(data){
    };

    var retrieveLegFormGoogleDirectionResponse = function(response){
      var leg;
      if(response && response.routes && response.routes.length > 0 && response.routes[0].legs && response.routes[0].legs.length){
        leg = response.routes[0].legs[0];
      }
      return leg;
    };

    var retrieveDistanceFormGoogleDirectionResponse = function(response){

      var distance = {
        'text' : '',
        'value' : 0
      }

      var leg = retrieveLegFormGoogleDirectionResponse(response);
      if(leg && leg.distance){
        distance = leg.distance;
      }

      return distance;

    };

    var retrieveDurationFormGoogleDirectionResponse = function(response){

      var duration = {
        'text' : '',
        'value' : 0
      }

      var leg = retrieveLegFormGoogleDirectionResponse(response);
      if(leg && leg.duration){
        duration = leg.duration;
      }

      return duration;

    };

    var onGoogleGeocodingDirectionRequestSuccess = function(index){
      return function(data){
        $scope.jobyersNextToMe[index].distance = retrieveDistanceFormGoogleDirectionResponse(data);
        $scope.jobyersNextToMe[index].duration = retrieveDurationFormGoogleDirectionResponse(data);
      }
    };

    var getTravelMode = function(){
      switch($scope.position.transportationMode) {
        case 'driving': return google.maps.TravelMode.DRIVING;
        case 'walking': return google.maps.TravelMode.WALKING;
        case 'bicycling': return google.maps.TravelMode.BICYCLING;
        case 'transit': return google.maps.TravelMode.TRANSIT;
        default: return google.maps.TravelMode.DRIVING;
      }
    };

    var getdirectionsRequest = function(userGeo, address){

      var directionsRequest = {
        'origin' : new google.maps.LatLng(userGeo.latitude, userGeo.longitude),
        'destination' : address,
        'travelMode' : getTravelMode()
      }

      return directionsRequest;

    };

    var onGetUserGeoSuccess2 = function(jobyerData, index){
      return function(data){
        var userGeo = data;
        if(userGeo){
          var address = getAddress(jobyerData);
          if(address) {
            $scope.jobyersNextToMe[index].address = address;
            var directionsService = new google.maps.DirectionsService;
            var directionsRequest = getdirectionsRequest(userGeo, address);
            directionsService.route(directionsRequest, onGoogleGeocodingDirectionRequestSuccess(index));
          }
        }
      }
    };

    var onGetUserGeoSuccess3 = function(address, index){
      return function(data){
        var userGeo = data;
        if(userGeo){
          var directionsService = new google.maps.DirectionsService;
          var directionsRequest = getdirectionsRequest(userGeo, address);
          directionsService.route(directionsRequest, onGoogleGeocodingDirectionRequestSuccess(index));
        }
      }
    };

    var promiseCalculateDistanceAndDuration = function(jobyerData, index){
      GeoService.getUserGeo().then(onGetUserGeoSuccess2(jobyerData, index), onGetUserGeoError);
    };

    var promiseCalculateDistanceAndDuration2 = function(address, index){
      GeoService.getUserGeo().then(onGetUserGeoSuccess3(address, index), onGetUserGeoError);
    };

    var promiseCalculateDistance = function(jobyerData, index){

      var address = getAddress(jobyerData);

      if(address) {
        var googleGeocodingRequest = googleGeocodingRequestPrefix + address;
        $http.get(googleGeocodingRequest).success(onGoogleGeocodingRequestSuccess(index)).error(onGoogleGeocodingRequestError);
      }

    };

    var promiseCalculateAvailability = function(jobyerOfferId, index){

      if(jobyerOfferId){
        $http(getJobyerOfferAperiodicAvailabilityRequest(jobyerOfferId))
        .success(onJobyerOfferAperiodicAvailabilityRequestSuccess(jobyerOfferId, index))
        .error(onJobyerOfferAperiodicAvailabilityRequestError);
      }

    };

    var reCalculateDistanceAndDurations = function(){

      var jobyerOffersNextToMe = $scope.jobyersNextToMe;
      if(jobyerOffersNextToMe && jobyerOffersNextToMe.length > 0){
        for(var i =  0; i < jobyerOffersNextToMe.length; i++){
          if(jobyerOffersNextToMe[i].address){
            promiseCalculateDistanceAndDuration2(jobyerOffersNextToMe[i].address, i);
          }
        }
      }
    };

    var reCalculateAvailabilities = function(){

      var jobyerOffersNextToMe = $scope.jobyersNextToMe;

      if(jobyerOffersNextToMe && jobyerOffersNextToMe.length > 0){
        for(var i =  0; i < jobyerOffersNextToMe.length; i++){
          promiseCalculateAvailability(jobyerOffersNextToMe[i].jobyerOfferId, i);
        }
      }

    };

    // TEMPORAIRE POU LA PRESENTATION DEBUT //
    //                                      //
    //                                      //

    var loadJobyersFormPresentation = function(){
      var query = $rootScope.queryText;
      if(query){
        query = query.toLowerCase();
        var jobyersList = [];
        switch(query){
          case 'serveur' :
          jobyersList = [
          {
            'jobyerOfferId' : -1,
            'name': 'Alain',
            'distance': {
              'text' : '',
              'value' : 0
            },
            'duration' : {
              'text' : '',
              'value' : 0
            },
            'availability': {
              'text' : '',
              'value' : 3600 * 4
            },
            'address' : '2 Rue de la mairesse, st georges baillargeux, 86130, France'
          },
          {
            'jobyerOfferId' : -1,
            'name': 'Jérôme',
            'distance': {
              'text' : '',
              'value' : 0
            },
            'duration' : {
              'text' : '',
              'value' : 0
            },
            'availability': {
              'text' : '',
              'value' : 3600 * 7
            },
            'address' : '35 RUE GUY MOQUET, 4 ETAGE G, PARIS, 75017, France'
          },
          {
            'jobyerOfferId' : -1,
            'name': 'Phillipe',
            'distance': {
              'text' : '',
              'value' : 0
            },
            'duration' : {
              'text' : '',
              'value' : 0
            },
            'availability': {
              'text' : '',
              'value' : 3600 * 2
            },
            'address' : '12 ALLEE BERGERE, VERNEUIL SUR SEINE, 78480, France'
          },
          {
            'jobyerOfferId' : -1,
            'name': 'Renald',
            'distance': {
              'text' : '',
              'value' : 0
            },
            'duration' : {
              'text' : '',
              'value' : 0
            },
            'availability': {
              'text' : '',
              'value' : 3600 * 1
            },
            'address' : '54 RUE DE NEUILLY, CLICHY, 92110, France'
          },
          {
            'jobyerOfferId' : -1,
            'name': 'Jean-Michel',
            'distance': {
              'text' : '',
              'value' : 0
            },
            'duration' : {
              'text' : '',
              'value' : 0
            },
            'availability': {
              'text' : '',
              'value' : 3600 * 8
            },
            'address' : '54 RUE DE NEUILLY, CLICHY, 92110, France'
          },
          {
            'jobyerOfferId' : -1,
            'name': 'Mickael',
            'distance': {
              'text' : '',
              'value' : 0
            },
            'duration' : {
              'text' : '',
              'value' : 0
            },
            'availability': {
              'text' : '',
              'value' : 3600 * 4
            },
            'address' : '6 RUE CHRISTOPHE COLOMB, BOURGES, 18000, France'
          },
          {
            'jobyerOfferId' : -1,
            'name': 'Nicolas',
            'distance': {
              'text' : '',
              'value' : 0
            },
            'duration' : {
              'text' : '',
              'value' : 0
            },
            'availability': {
              'text' : '',
              'value' : 3600 * 3
            },
            'address' : '12  B RUE HUYENS CHRISTIAN, VITROLLES, 13127, France'
          },
          {
            'jobyerOfferId' : -1,
            'name': 'Wilfried',
            'distance': {
              'text' : '',
              'value' : 0
            },
            'duration' : {
              'text' : '',
              'value' : 0
            },
            'availability': {
              'text' : '',
              'value' : 3600 * 13
            },
            'address' : '20 RUE GUYNEMER, ANTONY, 92160, France'
          }
          ];
          break;
          case 'serveur' :

          break;
        }

        $scope.jobyersNextToMe = jobyersList;
      }
    };

    var loadOtherJobyers = function(){
      var jobyersList = [
      {
        'jobyerOfferId' : -1,
        'name': 'Francis',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 5
        },
        'address' : '8 RUE DE LA VIEILLE VIGNE, MASSY, 91300, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Albert',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 5
        },
        'address' : '17  CLOS NOLLET, ATHIS MONS, 91200, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Augustine',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 4
        },
        'address' : '12 ALLEE BERGERE, VERNEUIL SUR SEINE, 78480, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Coralie',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 2
        },
        'address' : '37 RUE DU HAMEAU DE SEINE, SAINTRY SUR SEINE, 91250, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Florence',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 4
        },
        'address' : '11 RUE HENRI BARBUSSE, NANTERRE, 92000, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Mickael',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 7
        },
        'address' : '7 RUE JEAN PASSEL, IGNY, 91430, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Tristan',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 5
        },
        'address' : '34 AVENUE DU VERT GALANT, VILLEPINTE , 93420, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Romuald',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 13
        },
        'address' : '34 ALLEE DE BELLEVUE, BAT A, LE PERREUX SUR MARNE, 94170, France'
      },{
        'jobyerOfferId' : -1,
        'name': 'Arthur',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 1.5
        },
        'address' : '2 RUE DE LA MAIRESSE, ST GEORGES BAILLARGEAUX, 86130, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Jacques',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 0.5
        },
        'address' : '35 RUE GUY MOQUET, PARIS, 75017, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Nelson',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 12
        },
        'address' : '12 ALLEE BERGERE, VERNEUIL SUR SEINE, 78480, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Aline',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 2
        },
        'address' : '6 ALLEE DE LA PLAINE HENRI, SANTEUIL, 95640, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Jacqueline',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 3.5
        },
        'address' : '9 RUE DE LA SOURCE, PELTRE, 57245, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Marie',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 24
        },
        'address' : '6 RUE CHRISTOPHE COLOMB, BOURGES, 18000, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Gisèle',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 6
        },
        'address' : '12 B RUE HUYENS CHRISTIAN, VITROLLES, 13127, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Solène',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 1
        },
        'address' : '3 RUE MARIA CHAPDELAINE, QUIMPER, 29000, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Georges',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 2.5
        },
        'address' : "5 RUE DE L\'HORLOGE, VOISINES, 89260, France"
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Maya',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 7
        },
        'address' : '13 RUE SANTOS DUMONT, BALMA, 31130, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Pierre',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 4
        },
        'address' : '55 LES JARDINS DU CENTRE, LA MURETTE, 38140, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Astrid',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 3.5
        },
        'address' : '2 B RUELLE DE LA RAVINE, PONTOISE, 95300, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Laeticia',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 9
        },
        'address' : '7 RUE CHAPTAL, LEVALLOIS PERRET, 92300, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Xavier',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 1
        },
        'address' : '7 RUE CHAPTAL, LEVALLOIS PERRET, NANTES, 44200, France'
      },
      {
        'jobyerOfferId' : -1,
        'name': 'Jean-Pierre',
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 3600 * 1.5
        },
        'address' : '78 RUE DES LACS, LESPINASSE, 31150, France'
      }
      ];

      return jobyersList;
    };



    var reCalculateAvailabilities2 = function(){
      if($scope.jobyersNextToMe && $scope.jobyersNextToMe.length > 0){
        var dateDiff = $scope.availability.endDate - $scope.availability.startDate
        if(dateDiff > 0) dateDiff = dateDiff / 86400000;
        dateDiff += 1;
        var value = 0;
        for(var i = 0; i < $scope.jobyersNextToMe.length; i++)
        {
          value = (dateDiff > 0) ? dateDiff * $scope.jobyersNextToMe[i].availability.value : 0;
          $scope.jobyersNextToMe[i].availability.text = value.toString().toHHMMSS();
        }
      }
    }

    //                                     //
    //                                    //
    // TEMPORAIRE POU LA PRESENTATION FIN //

    String.prototype.toHHMMSS = function () {
      var sec_num = parseInt(this, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      var time    = ((hours > 0) ? hours + ' h ' : '') + ((minutes > 0) ? minutes +' min ' :  '') + ((seconds > 0) ? seconds + ' s' : '');
      return time;
    };

    // Récupèrer les informations d'un jobyer depuis un élement resultat JSON
    var getJobyerOffer = function(jobyerData, index){

      var jobyerOffer = {
        'jobyerOfferId' : jobyerData.jobyerofferid,
        'name': jobyerData.jobyername,
        'distance': {
          'text' : '',
          'value' : 0
        },
        'duration' : {
          'text' : '',
          'value' : 0
        },
        'availability': {
          'text' : '',
          'value' : 0
        },
        'address' : null
      };

      //promiseCalculateDistance(jobyerData, index);

      promiseCalculateDistanceAndDuration(jobyerData, index);

      promiseCalculateAvailability(jobyerData.jobyerofferid, index);

      return jobyerOffer;
    };

    // Remplir la liste des jobyers depuis le resultat JSON
    var fillJobyerOffersList = function(jobyersData){

      var dataLenght = jobyersData.length
      var jobyerArray = new Array(dataLenght);

      for(var i = 0; i < dataLenght; i++){
        jobyerArray[i] = getJobyerOffer(jobyersData[i], i);
      }

      $scope.jobyersNextToMe = jobyerArray;
    };

    // Si succès de la requète http qui récupère la liste des jobyers par competence
    var onJobyerOffersBySkillRequestSuccess = function (data) {

      if(data.status = 'success'){
        if(data.error){
          alert(data.error);
        }
        else{
          if(data && data.data && (data.data.length > 0)){
            fillJobyerOffersList(data.data);
          }
        }
      }
      else if(data.status = 'failure'){
        alert(data.error);
      }

    };

    // Si echec de la requète http qui récupère la liste des offres jobyers par competence
    var onJobyerOffersBySkillRequestError = function (data) {
    };

    // Requète http qui récupère la liste des offres jobyers par competence
    //$http(jobyerOffersBySkillRequest).success(onJobyerOffersBySkillRequestSuccess).error(onJobyerOffersBySkillRequestError);

    // Trier la liste des jobyers
    $scope.sort = function () {

      if ($scope.position.checked) {
        if($scope.position.sortingMethod == 'byDistance'){
          $scope.SortOrder = '+distance.value';
        } else if($scope.position.sortingMethod == 'byDuration'){
          $scope.SortOrder = '+duration.value';
        }
      }

      if ($scope.matching.checked) {

      }

      if ($scope.availability.checked) {
        $scope.SortOrder = '+availability.value';
      }

    };

    var index = 0;
    var otherJobyers = null;

    $scope.loadMoreData = function () {

      if(!otherJobyers)
      {
        otherJobyers = loadOtherJobyers();
      }

      if(otherJobyers){
        $scope.jobyersNextToMe.push(otherJobyers[index]);
        index++;
        $scope.jobyersNextToMe.push(otherJobyers[index]);
        index++;
      }

      reCalculateDistanceAndDurations();
      reCalculateAvailabilities2();

      if ($scope.jobyersNextToMe.length == 31) {
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
      if($scope.modal) $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      reCalculateDistanceAndDurations();
      //reCalculateAvailabilities();
      reCalculateAvailabilities2();
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    $scope.showMenuForContract = function(jobber){
      var hideSheet = $ionicActionSheet.show({
        buttons: [
			{ text: '<i class="ion-android-textsms"> Contacter par SMS</i>' }, //Index = 0
			{ text: '<i class="ion-android-mail"> Contacter par Mail</i>' }, //Index = 1
			{ text: '<i class="ion-ios-telephone"> Contacter par Téléphone</i>' }, //Index = 2
			{ text: '<i class="ion-ios-paper-outline"> Créer un contrat</i>' } //Index = 3
        ],
        titleText: 'Actions',
        cancelText: 'Annuler',
        buttonClicked: function(index) {
          //branchement de la page de contrat ou infos clients
          if(index==3){
            /*
              recuperation des données de l'emplyeur et calcule dans une variable boolean
              si toutes les informations sont présentes

            var isAuth = UserService.isAuthenticated();
            if(isAuth){
              console.log("check and then redirect to contract page");
              var employer = localStorageService.get('employeur');
              var redirectToStep1 = (typeof (employer) == "undefined");
              var redirectToStep1 = (typeof (employer.civilite) == "undefined") || (typeof (employer.entreprise) == "undefined");
              var redirectToStep2 = (employer) ? (typeof (employer.adressePersonel) == "undefined") : true;
              var redirectToStep3 = (employer) ? (typeof (employer.adresseTravail) == "undefined") : true;
              if(employer && !redirectToStep1){
                for (var key in employer){
                  redirectToStep1 = (employer[key])=="";
                  if(redirectToStep1) break;
                }
                if(!redirectToStep1){
                  for (var key in employer.adressePersonel){
                    redirectToStep2 = (employer.adressePersonel[key])=="";
                    if(redirectToStep2) break;
                  }
                }
                if(!redirectToStep2){
                  for (var key in employer.adresseTravail){
                    redirectToStep3 = (employer.adresseTravail[key])=="";
                    if(redirectToStep3) break;
                  }
                }
              }
              var dataInformed = ((!redirectToStep1) && (!redirectToStep2) && (!redirectToStep3));
              var objRedirect = {"step1":redirectToStep1,"step2":redirectToStep2,"step3":redirectToStep3};
              if(dataInformed){
                //show contract page //TODO
                $state.go("contract", { jobyer: jobber });
                console.log(jobber);
                console.log("redirect to contract pages");
              }
              else{
                console.log(employer);
                if(redirectToStep1) $state.go("saisieCiviliteEmployeur",{ "steps": JSON.stringify(objRedirect)});
                else if(redirectToStep2) $state.go("adressePersonel",{ "steps": JSON.stringify(objRedirect)});
                else if(redirectToStep3) $state.go("adresseTravail",{ "steps": JSON.stringify(objRedirect)});
              }
            }else{
              $state.go("connection");
            }
          }

          if (index == 1){
            window.plugins.webintent.hasExtra(window.plugins.webintent.EXTRA_TEXT,
              function (has) {
                // has is true iff it has the extra
                window.plugins.webintent.startActivity({
                    action: window.plugins.webintent.ACTION_VIEW,
                    url: 'smsto:' + ''
                  },
                  function () {
                  },
                  function () {
                    alert('Erreur système - Plugin Webintent')
                  });
              }, function () {
                // Something really bad happened.
                alert('Erreur système - Plugin Webintent');
              }
            );
          }
          return true;
        }
      });
    }
  })
;
 */
