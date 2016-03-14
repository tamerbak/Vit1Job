

'use strict';

starter
  .controller('SlimPayCtrl', function ($scope, $rootScope, localStorageService, $state,$http, x2js, AuthentificatInServer, PullDataFromServer,
				formatString, PersistInServer, LoadList, Global, DataProvider, Validator,slimPay){

    $scope.formData = {};
    $scope.isIOS = ionic.Platform.isIOS();
    $scope.isAndroid = ionic.Platform.isAndroid();
    
    
    
    var OnAuthenticateSuccesss = function(data){
      if(!data){
        OnAuthenticateError(data);
        return;
      }
      data = data[0]['value'];
      console.log(data);
      if(data.length ==0){
        OnAuthenticateError(data);
        return;
      }

      data = JSON.parse(data);

      if(data.id ==0){
        OnAuthenticateError(data);
        return;
      }

      localStorageService.remove('connexion');
      localStorageService.remove('currentEmployer');
      var connexion = {
        'etat': true,
        'libelle': 'Se déconnecter',
        'employeID': data.id
      };


      localStorageService.set('connexion', connexion);
      localStorageService.set('currentEmployer', data);
      var isNewUser = data.new;
      if (isNewUser == 'true') {
        Global.showAlertValidation("Bienvenue ! vous êtes rentré dans votre espace VitOnJob sécurisé.");
        $state.go("saisieCiviliteEmployeur");
      } else {
        $state.go("app");
      }
    };

    var OnAuthenticateError = function(data){
      console.log(data);
      Global.showAlertPassword("Le nom d'utilisateur ou le mot de passe est incorrect");
    };

    $scope.Validate = function () {
      var numCard="8000250000000004";//$scope.formData.ncard;
      var dateExpiration=0915;$scope.formData.dateExpiration;
      var cardCvx = "123";//$scope.formData.cardcvx;
      
        var appID = "hbtib1xl1g9s39ui";
         var appSecret = "1SjZ1g~FM9HinLc%Xs8jAFJes5V#zy~$q0gS";
          
        var authdata = 'Basic '+btoa(appID + ':' + appSecret);
   
            var url =  "https://api-sandbox.slimpay.net/oauth/token?grant_type=client_credentials&scope=api";
            
            slimPay.getToken()
                .success(OnAuthenticateSuccesss)
                .error(OnAuthenticateError);
            //var data = {"grant_type":"client_credentials","&scope":"api"};
            
		//   jQuery.ajax({ 
        //       url: url,
        //       type: "POST",
        //        headers: {
        //                 'Authorization': 'Basic aGJ0aWIxeGwxZzlzMzl1aToxU2paMWd+Rk05SGluTGMlWHM4akFGSmVzNVYjenl+JHEwZ1M=',
        //                 // 'contentType': "application/json"
        //             },
        //       //data: JSON.stringify(data),
        //     //   dataType: "json", 
        //         contentType: "application/json",
        //       success: function (response) { console.log("success"); }, 
        //       error: function (response) { console.log("failed"); } 
        //     }).done(function( data ) {
        //         if ( console && console.log ) {
        //             console.log( data );
        //         }
        //     });
            
            
         };
            
         
    
    
    $scope.displayPwdTooltip = function() {
      $scope.showPwdTooltip = true;
    };
   

		$scope.initForm=function(){
			// GET LIST
      if(!$scope.formData)
        $scope.formData={};
      
		};

		

    
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
  });
