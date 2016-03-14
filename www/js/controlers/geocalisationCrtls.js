/**
 * Created by Hodaiky on 02/11/2015.
 */
'use strict';

starter
      .controller('MapCtrl', function($scope, $ionicLoading, $compile) {
    $scope.geolocation = {long : '', lat: ''};

    $scope.$watch('geolocation', function(oldVal, newVal) {
      $scope.geolocation = newVal;
      console.log(newVal);
    });

        function initialize() {

          var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

          var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

          //Marker + infowindow + angularjs compiled ng-click
          var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
          var compiled = $compile(contentString)($scope);

          var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
          });

          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Uluru (Ayers Rock)'
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });

          $scope.map = map;
        }


        google.maps.event.addDomListener(window, 'load', initialize);

        $scope.centerOnMe = function() {


          if(!$scope.map) {
            return;
          }

          $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
          });

          navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.geolocation.long = pos.coords.longitude;
            $scope.geolocation.lat = pos.coords.latitude;

            console.log($scope.geolocation.long  );
            console.log( $scope.geolocation.lat);
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
          }, function(error) {
            alert('Impossible de vous localiser, veuillez vérifier vos paramètres de localisation:');
            $scope.loading.hide();
          });
        };

        $scope.clickTest = function() {
          alert('Example of infowindow with ng-click')
        };

    $scope.showAddress =  function(lat,lng){
      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            console.log(results[0].formatted_address);
            return results[0].formatted_address;
          } else {
            return 'Location not found';
          }
        } else {
          return 'Geocoder failed due to: ' + status;
        }
      });

    };

      });
