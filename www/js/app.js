// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

'use strict';

//var sessionId = 'nn';
//var myCity = 'Paris';

var starter = angular.module('starter', ['ionic','wsConnectors', 'parsingServices', 'fileServices', 'globalServices','ng-mfb',
  'cb.x2js', 'ngOpenFB', 'base64', 'ngCordova','validationDataServices','providerServices',
  'LocalStorageModule','connexionPhoneServices', 'Services', 'ngCookies', 'angucomplete-alt','ion-google-place'])

.run(function($ionicPlatform, $rootScope, $http, x2js, ngFB) {
  ngFB.init({appId: '426767167530378'});
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
if(window.cordova && window.cordova.plugins.Keyboard) {
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  cordova.plugins.Keyboard.disableScroll(true);
}
if(window.StatusBar) {
  StatusBar.styleDefault();
}

/*$rootScope.jobyersForMe = [];
$rootScope.jobyersNextToMe = [];
$rootScope.nbJobyersForMe = 0;
$rootScope.nbJobyersNextToMe = 0;
$rootScope.queryText = '';*/

$rootScope.AppLogo = '<div class="vimgBar"><img src="img/vit1job-mini.png"></div>';
$rootScope.previousView = '';

    //connecting to WS
    /*var soapMessage='<fr.protogen.connector.model.AmanToken>'+
      '<username>administrateur</username>'+
      '<password>1234</password>'+
      '<nom></nom>'+
      '<appId>FRZ48GAR4561FGD456T4E</appId>'+
      '<sessionId></sessionId>'+
      '<status></status>'+
      '<id>0</id>'+
      '<beanId>0</beanId>'+
      '</fr.protogen.connector.model.AmanToken>';

    $http({
      method: 'POST',
      url: 'http://ns389914.ovh.net:8080/vit1job/api/aman',
      headers: {
        "Content-Type": "text/xml"
      },
      data: soapMessage
    }).then(
      function(response){
        var jsonResp = x2js.xml_str2json(response.data);
        var jsonText = JSON.stringify (jsonResp);
        jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
        jsonResp = JSON.parse(jsonText);

        //console.log(jsonResp.amanToken.sessionId);
        sessionId = jsonResp.amanToken.sessionId;

        //isConnected = true;
        //$state.go('search');
      },
      function(response){
        alert("Error : "+response.data);
        jobbers = 'requete echoué !';
      }
      );*/

});
})
//Remove text from back button and add icon
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
})

//Add ionic loading
    .config(function($httpProvider) {
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

  .run(function($rootScope, $ionicLoading) {
      $rootScope.$on('loading:show', function() {
          console.log("$ionicLoading.show");
          $ionicLoading.show({template: 'Chargement'});
        });

        $rootScope.$on('loading:hide', function() {
            console.log("$ionicLoading.hide");
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

starter.directive('googleplace', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
      var options = {
        types: [],
        componentRestrictions: {
          country : 'FR'
        }
      };
      scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

      google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
        var container = document.getElementsByClassName('pac-container');
    
          angular.element(container).attr('data-tap-disabled', 'true');
          
          angular.element(container).on("click", function(){
            console.log('called place_changed')
            model.$setViewValue(element.val());
          });
        scope.$apply(function() {
          model.$setViewValue(element.val());
        });
      });
    }
  };
});

starter.directive('groupedRadio', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function(e) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal) {
        element.removeClass('button-green');
        if (newVal === scope.value) {
          element.addClass('button-green');
        }
      });
    }
  };
})
