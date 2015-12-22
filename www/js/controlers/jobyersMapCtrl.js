
'use strict';

starter.controller('jobyersMapCtrl', ['$scope','$ionicLoading', '$compile','Global', function($scope, $ionicLoading, $compile,Global) {

  $scope.$on('$ionicView.beforeEnter', function(){
    if(!$scope.loaded) initialize();
    $scope.loaded = true;
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
        var success=false;
        navigator.geolocation.getCurrentPosition(function(pos) {
          console.log(pos);
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          var myLatLng = {lat: pos.coords.latitude, lng: pos.coords.longitude};
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
            longitude : pos.coords.longitude+0.1
          },
            {
              jobyerName : 'Alain',
              availability : {
                value : 20,
                text : '3h 30min'
              },
              matching : 20,
              contacted : true,
              latitude : pos.coords.latitude+0.2,
              longitude : pos.coords.longitude+0.2
            },
            {
              jobyerName : 'Philippe',
              availability : {
                value : 1000,
                text : '17h 30min'
              },
              matching : 10,
              contacted : false,
              latitude : pos.coords.latitude+0.3,
              longitude : pos.coords.longitude+0.3
            }];
          for( var i=0;i<jobyersOffers.length;i++){
            var myLatLng2 = {lat: jobyersOffers[i].latitude, lng: jobyersOffers[i].longitude};
            var marker2 = new google.maps.Marker({
              position: myLatLng2,
              map: $scope.map
              //label: labels[labelIndex++ % labels.length]
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
