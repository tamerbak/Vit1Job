
'use strict';

starter.controller('jobyersMapCtrl', ['$scope','$ionicLoading', '$compile','Global','GeoService','$http','localStorageService', function($scope, $ionicLoading, $compile,Global,GeoService,$http,localStorageService) {
  var adressTravailMarker;
  $scope.$on('$ionicView.beforeEnter', function(){
    if(!$scope.loaded) initialize();
    $scope.loaded = true;
  });

  var getAddress = function(empl){
    var address;
    /*
    var number = (empl.adresseTravail.num && empl.adresseTravail.num.toUpperCase() != "NULL") ? empl.adresseTravail.num : '';
    var street = (empl.adresseTravail.adresse1 && empl.adresseTravail.adresse1.toUpperCase() != "NULL") ? '+' + empl.adresseTravail.adresse1 : '';
    var complement = (empl.adresseTravail.adresse2 && empl.adresseTravail.adresse2.toUpperCase() != "NULL") ? '+' +  empl.adresseTravail.adresse2 : '';
    var zipCode = (empl.adresseTravail.codePostal && empl.adresseTravail.codePostal.toUpperCase() != "NULL") ? '+' + empl.adresseTravail.codePostal : '';
    var city = (empl.adresseTravail.ville && empl.adresseTravail.ville.toUpperCase() != "NULL") ? '+' + empl.adresseTravail.ville : '';
    var country = (empl.adresseTravail.country && empl.adresseTravail.country.toUpperCase() != "NULL") ? '+' + empl.adresseTravail.country : '';
*/
    console.log(empl);
    var address = empl.adresseTravail.fullAddress;
    if(address){
      address=address.replace(/\+/g, ' ');
      //address = address.replace(new RegExp(' ', 'g'), '+');
      /*if(address.startsWith('+')){
        address = address.replace('+','');
      }
      */
    }
    console.log("address : "+address);
    return address;
  };

  function displayMap(myLatlng){
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|009900");
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      icon:pinImage
    });
    adressTravailMarker=marker;
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });

    $scope.map = map;
  }
  var markers=[];
  function loopThroughJobyers(jobyers, img, i,myLatLng){
    var marker2;
    if (jobyers[i].latitude && jobyers[i].longitude) {
      var myLatLng2 = new google.maps.LatLng(jobyers[i].latitude, jobyers[i].longitude);
      var content = "<h3>"+jobyers[i].jobyerName+"</h3>"+"<p>Distance : "+jobyers[i].availability.text+"</p>";
      if (i != jobyers.length-1) {
        i+=1;
        markers.push({key:i,position:myLatLng2, distance:google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2),info:content});
        loopThroughJobyers(jobyers, img, i,myLatLng);
      }else markers.push({key:i,position:myLatLng2, distance:google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2),info:content});
    } else {
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + jobyers[i].address).
        success(function (data) {
          var location = (data.results && data.results.length > 0) ? data.results[0].geometry.location : NULL;
          var myLatLng2 = new google.maps.LatLng(location.lat, location.lng);
          var content = "<h3>"+jobyers[i].jobyerName+"</h3>"+"<p>Distance : "+jobyers[i].availability.text+"</p>";
          markers.push({key:i,position:myLatLng2, distance:google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2),info:content});
          if (i!=jobyers.length-1) {
            i+=1;
            markers.push({key:i,position:myLatLng2, distance:google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2),info:content});
            loopThroughJobyers(jobyers, img, i,myLatLng);
          }else markers.push({key:i,position:myLatLng2, distance:google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2),info:content});
        })
        .error(function () {
          Global.showAlertValidation("IUne erreur est survenue. Veuillez réssayer plus tard.");
        });
    }
  }

  function initialize() {

    var myLatlng,address;
    $scope.markers=[];
    var employeur=localStorageService.get('employeur');
    console.log(employeur);
    if(employeur!=null && employeur!=undefined)
      address = getAddress(employeur);
    if(!address)
      address="5 Rue de Copenhague, 93290 Tremblay-en-France";

    $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address).
      success(function(data) {
        console.log(data);
        var location = (data.results && data.results.length > 0) ? data.results[0].geometry.location : NULL;
        console.log(location.lat);
        console.log(location.lng);
        myLatlng=new google.maps.LatLng(location.lat,location.lng);
        console.log(myLatlng);
        displayMap(myLatlng);
      })
      .error(function(){
        Global.showAlertValidation("IUne erreur est survenue. Veuillez réssayer plus tard.");
      });
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });
      }

  google.maps.event.addDomListener(window, 'load', initialize);

  $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }
        adressTravailMarker.setMap(null);
        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });
        var success=false;
        navigator.geolocation.getCurrentPosition(function(pos) {
          console.log(pos);
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          var myLatLng=new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
          var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|009900");
          var marker = new google.maps.Marker({
            position: myLatLng,
            map: $scope.map,
            icon: pinImage
            //label: labels[labelIndex++ % labels.length]
          });
          var jobyersOffers= [{
            jobyerName : 'Jérôme',
            availability : {
              value : 210,
              text : '8h 30min'
            },
            matching : 60,
            contacted : false,
            latitude : pos.coords.latitude+0.1,
            longitude : pos.coords.longitude+0.1,
            address:"190 Rue de Copenhague, 93290 Tremblay-en-France"
          },
            {
              jobyerName : 'Alain',
              availability : {
                value : 20,
                text : '3h 30min'
              },
              matching : 20,
              contacted : true,
              //latitude : pos.coords.latitude+0.2,
              //longitude : pos.coords.longitude+0.2,
              address:"18 pl Honoré Combe, 45320 COURTENAY"
            },
            {
              jobyerName : 'Philippe',
              availability : {
                value : 1000,
                text : '17h 30min'
              },
              matching : 10,
              contacted : false,
              //latitude : pos.coords.latitude+0.3,
              //longitude : pos.coords.longitude+0.3,
              address:"31 rue Croix des Petits-Champs 75001 PARIS"
            }];
          var colors=[];
          var pinImage2 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|757575");
         /*
          for( var i=0;i<jobyersOffers.length;i++) {
            if (jobyersOffers[i].latitude && jobyersOffers[i].longitude) {
              var myLatLng2 = new google.maps.LatLng(jobyersOffers[i].latitude, jobyersOffers[i].longitude);
              //var myLatLng2 = {lat: jobyersOffers[i].latitude, lng: jobyersOffers[i].longitude};
              var marker2 = new google.maps.Marker({
                position: myLatLng2,
                icon: pinImage2,
                map: $scope.map
                //label: labels[labelIndex++ % labels.length]
              });
              markers[i]={key:i,position:myLatLng2, distance:google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2)};
              console.log("i = "+i+" markers[i] = "+markers[i]);
            } else {
              $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + jobyersOffers[i].address).
                success(function (data) {
                  var location = (data.results && data.results.length > 0) ? data.results[0].geometry.location : NULL;
                  var myLatLng2 = new google.maps.LatLng(location.lat, location.lng);
                  //var myLatLng2 = {lat: jobyersOffers[i].latitude, lng: jobyersOffers[i].longitude};
                  markers[i]={key:i,position:myLatLng2, distance:google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2)};
                  console.log("i = "+i+" markers[i] = "+markers[i]);
              })
                .error(function () {
                  Global.showAlertValidation("IUne erreur est survenue. Veuillez réssayer plus tard.");
                });
            }
            if(markers.length==jobyersOffers.length){
                console.log("if");
            }

          }
          */

          loopThroughJobyers(jobyersOffers, pinImage2, 0,myLatLng);
          console.log(markers.length);
          console.log(jobyersOffers.length);
          var sortedMarkers=markers.sort(function(a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
          });
          for(var j=0;j<sortedMarkers.length;j++){
            var marker2 = new google.maps.Marker({
              position: sortedMarkers[j].position,
              icon: pinImage2,
              map: $scope.map,
              info: sortedMarkers[j].info
              //label: labels[labelIndex++ % labels.length]
            });
            var infowindowj = new google.maps.InfoWindow();

            google.maps.event.addListener(marker2, 'click', function() {
              infowindowj.setContent(this.info);
              infowindowj.open(this.map, this);
            });

          }
          success=true;
          $ionicLoading.hide();
        }, function(error) {
          success=false;
          Global.showAlertValidation("Impossible de vous localiser, veuillez vérifier vos paramétres de localisation");
          $ionicLoading.hide();

        },{
          timeout : 5000
        });
        console.log(success);
        //if(success==false)
          //Global.showAlertValidation("Impossible de vous localiser, veuillez vérifier vos paramétres de localisation");
      };

  $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
    }]);
