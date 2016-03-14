

'use strict';

starter
  .controller('PayLineCtrl', function ($scope, $rootScope, localStorageService, $state,$http, x2js, AuthentificatInServer, PullDataFromServer,
				formatString, LoadList, Global, DataProvider, Validator,payLine){

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
      var dateExpiration=0915;//$scope.formData.dateExpiration;
      var cardCvx = "123";//$scope.formData.cardcvx;
      var data = "ddd";
      var accessKeyRef = "accessKeyRefHHH";
    //   payLine.getToken("1","2",numCard,dateExpiration,cardCvx)
    //         .success(OnAuthenticateSuccesss)
    //         .error(OnAuthenticateError);

            var url = "https://homologation-webpayment.payline.com/webpayment/getToken";
            var data = {"data":data,"accessKeyRef":accessKeyRef,"cardNumber":numCard,"cardExpirationDate":dateExpiration,"cardCvx":cardCvx};

		  jQuery.ajax({
              url: url,
              type: "POST",
              data: JSON.stringify({"foo":"bar"}),
            //   dataType: "json",
            //   contentType: "application/json; charset=utf-8",
              success: function (response) { console.log("success"); },
              error: function (response) { console.log("failed"); }
            }).done(function( data ) {
                if ( console && console.log ) {
                    console.log( data );
                }
            });
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
