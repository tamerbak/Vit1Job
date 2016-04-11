// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

'use strict';

//var sessionId = 'nn';
//var myCity = 'Paris';

var starter = angular.module('starter', ['ionic', 'wsConnectors', 'parsingServices', 'fileServices', 'globalServices', 'ng-mfb',
  'cb.x2js', 'ngOpenFB', 'base64', 'ngCordova', 'validationDataServices', 'providerServices',
  'LocalStorageModule', 'connexionPhoneServices', 'Services', 'ngCookies', 'angucomplete-alt', 'ion-google-autocomplete', 'ui.mask',
'ionic.service.core','passwordServices','SmsServices','paiementServices', 'ionic-multi-date-picker', 'ionic-timepicker', 'ion-gallery'])

  .run(function ($ionicPlatform, $rootScope, $cordovaSplashscreen) {

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      setTimeout(function() {
        $cordovaSplashscreen.hide()
      }, 10000);
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      $rootScope.AppLogo = '<div class="vimgBar"><img src="img/vit1job-mini.png"></div>';
      $rootScope.previousView = '';

      //Instabug integration :
      cordova.plugins.instabug.activate(
        {
          android: '8638bb86054b6354141c9a07d8317d26',
          ios: 'a79265adfebcc922588a989ab0a07557'
        },
        'shake',//button
        {
          commentRequired: true,
          colorTheme: 'dark',
          shakingThresholdAndroid: '0.01',
          shakingThresholdIPhone: '0.5',
          shakingThresholdIPad: '0.6',
          enableIntroDialog: true,
          setLocale : 'french'
        },
        function () {
          console.log('Instabug initialized.');
        },
        function (error) {
          console.log('Instabug could not be initialized - ' + error);
        }
      );

    });
  })
//Remove text from back button and add icon
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
  })

//Add ionic loading
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope) {
      return {
        request: function (request) {
          $rootScope.$broadcast('loading:show');
          return request;
        },
        response: function (response) {
          $rootScope.$broadcast('loading:hide');
          return response;
        }
      }
    });
  })

  .config(['$ionicAppProvider', function($ionicAppProvider) {

    // Identify app
    $ionicAppProvider.identify({
      // The App ID for the server
      app_id: 'b718e5fc',
      // The API key all services will use for this app
      api_key: 'e25f25053bc85add208fac4c8c42bf3eaf529467847f735b',
      dev_push : false
    });
    }])
//Add ionic loading
    .config(function($httpProvider) {
        // $httpProvider.defaults.withCredentials = true;
        // $httpProvider.defaults.useXDomain = true;
        // delete $httpProvider.defaults.headers.common['X-Requested-With'];

      $httpProvider.interceptors.push(function($rootScope) {
          return {
              request: function(request) {
                $rootScope.$broadcast('loading:show');
                return request;
              },
            response: function(response) {
                $rootScope.$broadcast('loading:hide');
                return response;
              }
          }
        });
    })

  .config(function (ionicTimePickerProvider) {
    var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 24,
      step: 1,
      setLabel: 'Ok',
      closeLabel: 'Fermer'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
  })

  .run(function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function () {
      $ionicLoading.show({template: 'Chargement'});
    });

    $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide();
    });
  });
//End ionic loadin

/*starter.config(function($httpProvider){
 delete $httpProvider.defaults.headers.common['X-Requested-With'];
 });*/

/**
 * Create module for services
 *
 * @type {module|*}
 */
var services = angular.module('Services', []);

/**
 .config(function($mdGestureProvider ){
	   $mdGestureProvider.skipClickHijack();
  })**/

/*document.addEventListener("exitButton", function(){
 navigator.notification.confirm(
 'Do you want to quit',
 onConfirmQuit,
 'QUIT TITLE',
 'OK,Cancel'
 );
 }, true);*/


function isEmpty(str) {
  return (!str || 0 === str.length || typeof str === 'undefined' || str === null);
}

starter.directive('googleplace', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, model) {
      var options = {
        types: [],
        componentRestrictions: {
          country: 'FR'
        }
      };
      scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

      google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
        var container = document.getElementsByClassName('pac-container');

        angular.element(container).attr('data-tap-disabled', 'true');

        angular.element(container).on("click", function () {
          model.$setViewValue(element.val());
        });
        scope.$apply(function () {
          model.$setViewValue(element.val());
        });
      });
    }
  };
});

starter.directive('groupedRadio', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function (scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function (e) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function (newVal) {
        element.removeClass('button-green');
        if (newVal === scope.value) {
          element.addClass('button-green');
        }
      });
    }
  };
})

/*starter.directive('uploadfile', function () {
 return {
 restrict: 'A',
 link: function(scope, element) {

 element.bind('click', function(e) {
 console.log("uploadfile clicked");
 angular.element(document.querySelector('#imgFile')).trigger('click');
 });
 }
 };
 });*/
