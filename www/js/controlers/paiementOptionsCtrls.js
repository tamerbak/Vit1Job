
 'use strict';
 var requestToken = "";
 var accessToken = "";
 var clientId = "715296704477-gt8soaf11ftbncgbadj59pvjbq2fv7f0.apps.googleusercontent.com";
 var clientSecret = "x14txRHh2arUKVfNS7eZ8I-v";

 starter
    .controller('PaiementOptionsCtrl', function($scope, localStorageService, $state, ngFB, Global, $cordovaOauth, $http, $rootScope, formatString, AuthentificatInServer, x2js, LoadList ) {



        $scope.paiementModeList = [
            { text: "SlimPay", value: "slimPay" },
            { text: "PayLine", value: "payLine" }
        ];

        $scope.data = {
            mode: 'slimPay'
        };

        $scope.Redirect = function(){

          var json = {
            "class" : 'com.vitonjob.callouts.pay.PayBean',
            "email": "DDupont@mail.com",
            "civility": "Mr",
            "familyName": "Dupont",
            "givenName": "David",
            "telephone": "+33612345678",
            "street": "27 rue At",
            "postalCode": "79008",
            "country": "FR",
            "city": "Paris",
            "amount" : "20"

          };

          json = JSON.stringify(json);

          var encodedJson = btoa(json);

          var data = {
            class : 'fr.protogen.masterdata.model.CCallout',
            id : 75,
            args : [{
                class : 'fr.protogen.masterdata.model.CCalloutArguments',
                label : 'Objet json',
                value : encodedJson
              }]
          };

          var stringData = JSON.stringify(data);

          var request = {
            method: 'POST',
            url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
            headers: {
              'Content-Type': 'application/json'
            },
            data: stringData
          };

          $http(request).success(function(response) {
            console.log(response);
            var link = JSON.parse(response[0].value);
            localStorageService.set('urlSlimPay',link.url);
            //$rootScope.urlSlimPay = response[0].value.url;
            $state.go('slimPay');


          }).error(function(error){
            console.log(error);
          });





         /*   if($scope.data.mode == "slimPay"){
                $state.go("slimPay");
            }else if($scope.data.mode == "payLine"){
                $state.go("payLine");
            }*/
        };


         $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

    });

