/**
 * Created by abenaicha on 04/11/15.
 */

services
  .factory('GeoService', function(localStorageService, $q) {

    /**
     * @use plugin cordova geolocation
     *
     * @type {{getUserGeo: Function, getDistance: Function, getUserAddress: Function}}
     */
    var factory = {
        getUserGeo : function() {
           var deferred = $q.defer();

           var userGeo = localStorageService.get('user_geo');

           if (userGeo) {
             deferred.resolve(userGeo);
             return deferred.promise;
           }

           // onSuccess Callback
           // This method accepts a Position object, which contains the
           // current GPS coordinates
           //
           var onSuccess = function (position) {

             userGeo = {
               'latitude': position.coords.latitude,
               'longitude': position.coords.longitude,
               'altitude': position.coords.altitude
             };

             localStorageService.set('user_geo', userGeo);

             deferred.resolve(userGeo);
           };

           // onError Callback receives a PositionError object
           //
           var onError = function (error) {
             console.log('GeoService getUserGeo error : code: ' + error.code + '\n' +
               'message: ' + error.message + '\n');

             deferred.reject(error);
           };

           navigator.geolocation.getCurrentPosition(onSuccess, onError);

          return deferred.promise;
        },

      /**
       * Calculate distance
       *
       * @param lat1
       * @param lon1
       * @returns int
       */
      getDistance : function(lat1, lon1) {

        var deferred = $q.defer();

        this.getUserGeo()
          .then(function(userGeo) {

            var lat2 = userGeo.latitude;
            var lon2 = userGeo.longitude;

            var R = 6371; // km
            //has a problem with the .toRad() method below.
            var x1 = lat2-lat1;

            var dLat = toRad(x1);
            var x2 = lon2-lon1;
            var dLon = toRad(x2);
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;

            deferred.resolve(d);

          }, function(error) {
            console.log('GeoService getDistance error : ', error);
            deferred.reject(error);
          });

        return deferred.promise;
      },

      /**
       * Get user address from current geolocation
       * @returns {*}
       */
      getUserAddress : function() {
        var deferred = $q.defer();

        var userAddress = localStorageService.get('user_address');

        if(userAddress) {
          deferred.resolve(userAddress);
          return deferred.promise;
        }

        this.getUserGeo()
          .then(function(userGeo) {

            var lat = userGeo.latitude;
            var long = userGeo.longitude;

            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, long);
            geocoder.geocode({'latLng': latlng}, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {

                  var address_components = results[0].address_components;

                  var postalCode = address_components[6] ? address_components[6].long_name : '';
                  var city = address_components[2].long_name;
                  var num = address_components[0] ? address_components[0].long_name : '';
                  var street = address_components[1]? address_components[1].long_name : '';
                  var complement = address_components[3].long_name+', '+
                    address_components[4].long_name+', '+
                    (address_components[5] ? address_components[5].long_name : '');
                  var fullAddress = results[0].formatted_address;

                  userAddress = {
                    'postalCode': postalCode,
                    'city': city,
                    'num': num,
                    'street': street,
                    'complement': complement,
                    'fullAddress': fullAddress
                  };

                  localStorageService.set('user_address', userAddress);
                  deferred.resolve(userAddress);
                } else {
                  deferred.reject('Location not found');
                }
              } else {
                deferred.reject('Geocoder failed due to: ' + status);
              }
            });

          },
          function(error) {
          console.log('GeoService getUserAddress error : ', error);
          deferred.reject(error);
        });

        return deferred.promise;
      },

getAddressByPosition : function(latitude, longitude) {

      var deferred = $q.defer();

      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(latitude, longitude);

      geocoder.geocode({'latLng': latlng}, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var address_components = results[0].address_components;
            var postalCode = address_components[6] ? address_components[6].long_name : '';
            var city = address_components[2].long_name;
            var num = address_components[0] ? address_components[0].long_name : '';
            var street = address_components[1]? address_components[1].long_name : '';
            var complement = address_components[3].long_name+', '+ 
            address_components[4].long_name+', '+
            (address_components[5] ? address_components[5].long_name : '');
            var fullAddress = results[0].formatted_address;

            var address = {
              'postalCode': postalCode,
              'city': city,
              'num': num,
              'street': street,
              'complement': complement,
              'fullAddress': fullAddress
            };

            deferred.resolve(address);

          } else {

            deferred.reject('Location not found');

          }
        } else {

          deferred.reject('Geocoder failed due to: ' + status);

        }
      });

      return deferred.promise;
    
    },

    getDistanceBetween : function(latitude1, longitude1, latitude2, longitude2) {

        var deferred = $q.defer();

        var R = 6371; // km
        //has a problem with the .toRad() method below.
        var x1 = latitude2-latitude1;

        var dLat = toRad(x1);
        var x2 = longitude2-longitude1;
        var dLon = toRad(x2);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(latitude1)) * Math.cos(toRad(latitude2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        deferred.resolve(d);

        return deferred.promise;

      }

    };

    /**
     * Converts numeric degrees to radians
     */
    var toRad = function(value) {
      return value * Math.PI / 180;
    };

    return factory;
  });
