
 'use strict';
 var requestToken = "";
 var accessToken = "";
 var clientId = "715296704477-gt8soaf11ftbncgbadj59pvjbq2fv7f0.apps.googleusercontent.com";
 var clientSecret = "x14txRHh2arUKVfNS7eZ8I-v";

 starter
    .controller('PaiementOptionsCtrl', function($scope, localStorageService, $state, ngFB, Global, $cordovaOauth, $http, formatString, AuthentificatInServer, x2js, LoadList ) {

       
        
        $scope.paiementModeList = [
            { text: "slimPay", value: "slimPay" },
            { text: "payLine", value: "payLine" }
        ];
        
        $scope.data = {
            mode: 'slimPay'
        };
        
        $scope.Redirect = function(){

            if($scope.data.mode == "slimPay"){
                $state.go("slimPay");
            }else if($scope.data.mode == "payLine"){
                $state.go("payLine");
            }
        };
        
        
         $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

    });

