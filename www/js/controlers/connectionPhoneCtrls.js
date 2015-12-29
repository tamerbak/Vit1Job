/**
 * Created by Tamer on 14/10/2015.
 */

'use strict';

starter
  .controller('cPhoneCtrl', function ($scope, $rootScope, localStorageService, $state, x2js, AuthentificatInServer, PullDataFromServer,
				formatString, PersistInServer, LoadList, Global, DataProvider, Validator){

    $scope.formData = {};
    $rootScope.employeur = {};
    localStorageService.remove("steps");
    /*********************New code*********************/
    $scope.Authenticate = function () {
      var phone=$scope.formData.phone;
      var index=$scope.formData.index;
      var password=$scope.formData.password;
      var msg = [];
      var isNew=0;

      if (isEmpty(index)){
        msg.push("Indicatif");
      }
      if (isEmpty(phone)){
        msg.push("Téléphone");
      }
      if (isEmpty(password)){
        msg.push("Mot de passe");
      }
      if (msg.length>0){
        Global.missedFieldsAlert(msg);
        return;
      }

      phone = index + phone;

      var jsonObj = {"email": "",
        "telephone": btoa(JSON.stringify(phone)), "password": btoa(JSON.stringify(password)),
        "role": btoa(JSON.stringify("employeur"))};
      var user = jsonObj;
      var userObj = AuthentificatInServer.AuthenticateUser(user);

      if (userObj == null) {
        Global.showAlertPassword("Nom d'utilisateur ou mot de passe incorrect");
      }
      else {
        localStorageService.remove('connexion');
        var connexion = {
          'etat': true,
          'libelle': 'Se déconnecter',
          'employeID': userObj.employerId
        };

        localStorageService.set('connexion', connexion);
        localStorageService.set('currentEmployer', userObj);
        var isNewUser = userObj.isNew;
        if (isNewUser) {
          Global.showAlertValidation("Bienvenue ! vous êtes rentré dans votre espace VitOnJob sécurisé.");
          $state.go("saisieCiviliteEmployeur");
        } else {
          $state.go("app");
        }
      }
    };
    $scope.displayPwdTooltip = function() {
      $scope.showPwdTooltip = true;
    };
    $scope.passwordIsValid= function(){
      if($scope.formData.password!=undefined) {
        if (Number($scope.formData.password.length) >= 6) {
          console.log('test');
          return true;
        }
        else
          return false;
      }else
        return false;


    };

		$scope.validatElement=function(id){
			Validator.checkField(id);
		};

		$scope.initForm=function(){
			// GET LIST
      $scope.formData={'pays': DataProvider.getPays(),'index':"0033"};
			//$scope.formData={ 'villes': $cookieStore.get('villes')};
		};

		$scope.loadCodeInter=function(){
			var code=$scope.formData.country;
			$scope.formData.phone="+"+code+" ";

			/**else if(code==2)
				$scope.formData.phone="+33 ";
			else if(code==3)
				$scope.formData.phone="+1 ";
			else
				$scope.formData.phone="+00 ";**/
		};

		$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "cPhone" ){
				$scope.initForm();
			}
		});

    $scope.$watch('formData.phone', function(){
      if ($scope.formData.phone){
        $scope.formData.phone = $scope.formData.phone.replace("-","").replace(".","").replace("+","").replace(" ","").
        replace("(","").replace(")","").replace("/","").replace(",","").
        replace("#","").replace("*","").replace(";","").replace("N","");
        if ($scope.formData.phone.length == 10){
          if ($scope.formData.phone.substring(0, 1) == '0'){
            $scope.formData.phone = $scope.formData.phone.substring(1,10);
          } else {
            $scope.formData.phone = $scope.formData.phone.substring(0,9);
          }
        } else if ($scope.formData.phone.length > 10) {
          $scope.formData.phone = $scope.formData.phone.substring(0,9);
        }
      }


    });

    $scope.validatePhone = function(tel){
      $scope.formData.phone = tel.replace("-","").replace(".","").replace("+","").replace(" ","").
      replace("(","").replace(")","").replace("/","").replace(",","").
      replace("#","").replace("*","").replace(";","").replace("N","");

    };
  });
