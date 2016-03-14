'use strict';

starter.controller('jobyersMapCtrl', ['$scope', '$ionicLoading', '$compile', 'Global', 'GeoService', '$http', 'localStorageService', function ($scope, $ionicLoading, $compile, Global, GeoService, $http, localStorageService) {

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
  $scope.placesOptions = {
    types: [],
    componentRestrictions: {country: 'FR'}
  };
  var adressTravailMarker, myMarker;
  $scope.jobyersOffers = [{
    jobyerName: 'Jérôme',
    availability: {
      value: 210,
      text: '8h 30min'
    },
    matching: 60,
    contacted: false,
    //latitude : pos.coords.latitude+0.1,
    //longitude : pos.coords.longitude+0.1,
    address: "190 Rue de Copenhague, 93290 Tremblay-en-France"
  },
    {
      jobyerName: 'Alain',
      availability: {
        value: 20,
        text: '3h 30min'
      },
      matching: 20,
      contacted: true,
      //latitude : pos.coords.latitude+0.2,
      //longitude : pos.coords.longitude+0.2,
      address: "18 pl Honoré Combe, 45320 COURTENAY"
    },
    {
      jobyerName: 'Philippe',
      availability: {
        value: 1000,
        text: '17h 30min'
      },
      matching: 10,
      contacted: false,
      //latitude : pos.coords.latitude+0.3,
      //longitude : pos.coords.longitude+0.3,
      address: "31 rue Croix des Petits-Champs 75001 PARIS"
    }];

  $scope.inputMapchange = function (addressMap) {


    var myLatlng = new google.maps.LatLng(addressMap.lat, addressMap.lng);
    displayMap(myLatlng);

  };

  $scope.$on('$ionicView.beforeEnter', function () {
    if (!$scope.loaded) initialize();
    $scope.loaded = true;
  });
  $scope.markerFilter = "duration";

  var getAddress = function (empl) {
    var address;

    /*
     var number = (empl.adresseTravail.num && empl.adresseTravail.num.toUpperCase() != "NULL") ? empl.adresseTravail.num : '';
     var street = (empl.adresseTravail.adresse1 && empl.adresseTravail.adresse1.toUpperCase() != "NULL") ? '+' + empl.adresseTravail.adresse1 : '';
     var complement = (empl.adresseTravail.adresse2 && empl.adresseTravail.adresse2.toUpperCase() != "NULL") ? '+' +  empl.adresseTravail.adresse2 : '';
     var zipCode = (empl.adresseTravail.codePostal && empl.adresseTravail.codePostal.toUpperCase() != "NULL") ? '+' + empl.adresseTravail.codePostal : '';
     var city = (empl.adresseTravail.ville && empl.adresseTravail.ville.toUpperCase() != "NULL") ? '+' + empl.adresseTravail.ville : '';
     var country = (empl.adresseTravail.country && empl.adresseTravail.country.toUpperCase() != "NULL") ? '+' + empl.adresseTravail.country : '';
     */

    var address = empl.adresseTravail.fullAddress;
    if (address) {
      address = address.replace(/\+/g, ' ');
      //address = address.replace(new RegExp(' ', 'g'), '+');
      /*if(address.startsWith('+')){
       address = address.replace('+','');
       }
       */
    }

    return address;
  };

  function displayMap(myLatlng) {
    $scope.map.setCenter(myLatlng);
    myMarker.setVisible(false);
    myMarker.setPosition(myLatlng);
    myMarker.setVisible(true);

    loopThroughJobyers(0, myLatlng);

    //autoComplete search end

  }

  var infos = [];
  $scope.infos = infos;
  function closeLastInfo(infos, info) {
    if (infos.length >= 1) {
      infos[infos.length - 1].close();
      infos.splice(infos.length - 1, 1);
    }
    infos[infos.length] = info;
  }

  $scope.InfoMarkers = [];
  $scope.markers = [];

  $scope.displayMarkers = function () {

    var jobyers = localStorageService.get("jobyersOffers"); //$scope.jobyersOffers;
    if (!jobyers || jobyers.length == 0)
      return;

    if ($scope.InfoMarkers.length != jobyers.length) {

      return;
    }
    console.log("$scope.InfoMarkers.length==jobyers.length");
    //initialize markers
    for (var i = 0; i < $scope.markers.length; i++) {
      $scope.markers[i].setMap(null);
    }
    $scope.markers = [];
    //
    var sortedMarkers;

    var prevCode1 = 0;
    var prevCode2 = 0;
    var prevCode3 = 255;
    if ($scope.markerFilter == "distance") {
      sortedMarkers = $scope.InfoMarkers.sort(function (a, b) {
        return parseFloat(a.distance) - parseFloat(b.distance);
      });
    } else if ($scope.markerFilter == "duration") {
      sortedMarkers = $scope.InfoMarkers.sort(function (a, b) {
        return parseFloat(a.availability.value) - parseFloat(b.availability.value);
      });
    }

    var prevCode1 = 0;
    var prevCode2 = 0;
    var prevCode3 = 255;

    for (var j = 0; j < sortedMarkers.length; j++) {

      //var code1=255+(((parseFloat(sortedMarkers[j].distance) - parseFloat(sortedMarkers[0].distance))/(4 *(parseFloat(sortedMarkers[sortedMarkers.length-1].distance)-parseFloat(sortedMarkers[0].distance))));
      var code1 = ((255 - prevCode1) * 0.25) + prevCode1;
      var code2 = ((255 - prevCode2) * 0.25) + prevCode2;
      var code3 = ((255 - prevCode3) * 0.25) + prevCode3;
      prevCode1 = code1;
      prevCode2 = code2;
      prevCode3 = code3;


      var hexaCode1 = parseInt(code1).toString(16);
      var hexaCode2 = parseInt(code2).toString(16);
      var hexaCode3 = parseInt(code3).toString(16);

      var marker2 = new google.maps.Marker({
        position: sortedMarkers[j].position,
        icon: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + hexaCode1 + "" + hexaCode2 + "" + hexaCode3),
        map: $scope.map,
        info: sortedMarkers[j].info
        //label: labels[labelIndex++ % labels.length]
      });
      $scope.markers.push(marker2);
      var infowindowj = new google.maps.InfoWindow();
      google.maps.event.addListener(marker2, 'click', function () {
        infowindowj.setContent(this.info);
        infowindowj.open(this.map, this);
      });
    }
  }

  function loopThroughJobyers(i, myLatLng) {
    var marker2;
    var jobyers = localStorageService.get("jobyersOffers"); //$scope.jobyersOffers;
    if (!jobyers || jobyers.length == 0)
      return;
    if ($scope.InfoMarkers.length == jobyers.length) {
      $scope.InfoMarkers = [];
    }
    if (jobyers[i].latitude && jobyers[i].longitude) {
      var myLatLng2 = new google.maps.LatLng(jobyers[i].latitude, jobyers[i].longitude);
      var content = "<h3>" + jobyers[i].jobyerName + "</h3>" + "<p>Disponibilité : " + jobyers[i].availability.text + "</p><p>Correspondance : " + jobyers[i].matching + "%</p>";
      $scope.InfoMarkers.push({
        availability: jobyers[i].availability,
        key: i,
        position: myLatLng2,
        info: content,
        distance: google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2)
      });
      $scope.displayMarkers();
      if (i != jobyers.length - 1) {
        i += 1;
        loopThroughJobyers(i, myLatLng);
      }
    } else {
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + jobyers[i].address).
        success(function (data) {
          var location = (data.results && data.results.length > 0) ? data.results[0].geometry.location : NULL;


          var myLatLng2 = new google.maps.LatLng(location.lat, location.lng);
          //var myLatLng2 = {lat: jobyersOffers[i].latitude, lng: jobyersOffers[i].longitude};
          var content = "<h3>" + jobyers[i].jobyerName + "</h3>" + "<p>Disponibilité : " + jobyers[i].availability.text + "</p><p>Correspondance : " + jobyers[i].matching + "%</p>";
          $scope.InfoMarkers.push({
            availability: jobyers[i].availability,
            key: i,
            position: myLatLng2,
            info: content,
            distance: google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2)
          });
          $scope.displayMarkers();
          if (i != jobyers.length - 1) {
            i += 1;
            loopThroughJobyers(i, myLatLng);
          }
        })
        .error(function () {
          Global.showAlertValidation("IUne erreur est survenue. Veuillez réssayer plus tard.");
        });
    }
  }

  function initialize() {

    //document.getElementsByClassName("scroll").className.replace(/\scroll\b/,'');

    $scope.addresses = [{libelle: "18 pl Honoré Combe, 45320 COURTENAY"}, {libelle: "31 rue Croix des Petits-Champs 75001 PARIS"}, {libelle: "5 Rue de Copenhague, 93290 Tremblay-en-France"}];

    var myLatlng, address;
    var employeur = localStorageService.get('employeur');

    if (employeur != null && employeur != undefined)
      address = getAddress(employeur);
    if (!address)
      address = "5 Rue de Copenhague, 93290 Tremblay-en-France";

    $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address).
      success(function (data) {

        var location = (data.results && data.results.length > 0) ? data.results[0].geometry.location : NULL;


        myLatlng = new google.maps.LatLng(location.lat, location.lng);

        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        myMarker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          //icon:pinImage
        });
        adressTravailMarker = myMarker;
        google.maps.event.addListener(myMarker, 'click', function () {
          infowindow.open(map, myMarker);
        });
        $scope.map = map;
        displayMap(myLatlng);
        myMarker.setVisible(false);
      })
      .error(function () {
        Global.showAlertValidation("IUne erreur est survenue. Veuillez réssayer plus tard.");
      });
    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickTest()'>Vous êtes ici</a></div>";
    var compiled = $compile(contentString)($scope);

    var infowindow = new google.maps.InfoWindow({
      content: compiled[0]
    });


  }

  //google.maps.event.addDomListener(window, 'load', initialize);

  $scope.centerOnMe = function () {
    if (!$scope.map) {
      return;
    }
    //adressTravailMarker.setMap(null);
    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });
    var success = false;
    navigator.geolocation.getCurrentPosition(function (pos) {

      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      var myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      myMarker.setVisible(false);
      myMarker.setPosition(myLatLng);
      myMarker.setVisible(true);
      loopThroughJobyers(0, myLatLng);
      success = true;
      $ionicLoading.hide();
    }, function (error) {
      success = false;
      Global.showAlertValidation("Impossible de vous localiser, veuillez vérifier vos paramètres de localisation");
      $ionicLoading.hide();

    }, {
      timeout: 15000
    });

    //if(success==false)
    //Global.showAlertValidation("Impossible de vous localiser, veuillez vérifier vos paramétres de localisation");
  };

  $scope.clickTest = function () {
    alert('Example of infowindow with ng-click')
  };

  $scope.addressSelected = function (selected) {

    $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + selected.originalObject.libelle).
      success(function (data) {

        var location = (data.results && data.results.length > 0) ? data.results[0].geometry.location : null;
        if (location) {
          var myLatlng = new google.maps.LatLng(location.lat, location.lng);

          displayMap(myLatlng);
        } else {
          Global.showAlertValidation("Cette adresse n'existe pas.");
        }
      })
      .error(function () {
        Global.showAlertValidation("Une erreur est survenue. Veuillez réssayer plus tard.");
      });

  };
}]);
