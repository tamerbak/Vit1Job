/**
 * Created by Tamer on 14/10/2015.
 */

'use strict';
starter
  .controller('cMailCtrl', function ($scope, $rootScope, localStorageService, $state, x2js, AuthentificatInServer, PullDataFromServer,
                                     formatString, PersistInServer, Global, Validator) {

    // FORMULAIRE
    $scope.formData = {};
    $rootScope.employeur = {};
    $scope.isIOS = ionic.Platform.isIOS();
    $scope.isAndroid = ionic.Platform.isAndroid();
    localStorageService.remove("steps");
    /*********************New code*********************/
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
      Global.showAlertPassword("Nom d'utilisateur ou mot de passe incorrect");
    };

    $scope.Authenticate = function () {
      var phone = $scope.formData.phone;
      var index=$scope.formData.index;
      var email = $scope.formData.email;
      var password = $scope.formData.password;

      phone = index + phone;

      AuthentificatInServer.Authenticate(email, phone, password, 'employeur')
      .success(OnAuthenticateSuccesss)
      .error(OnAuthenticateError);
    };

    $scope.displayEmailTooltip = function() {
      $scope.emailToolTip = 'Veuillez saisir un email valide.';
      $scope.showEmailTooltip = true;
    };

    $scope.displayPwdTooltip = function() {
      $scope.showPwdTooltip = true;
    };

    $scope.validatEmail = function (id) {
      Validator.checkEmail(id);
    };
    $scope.emailIsValid = function() {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (!re.test($scope.formData.email)) {
        return false;
      } else {
        return true;
      }
    };

    //TEL 23/022016 : Phone control part

    $scope.displayPwdTooltip = function() {
      $scope.showPwdTooltip = true;
    };
    $scope.displayPhoneTooltip = function() {
      $scope.showPhoneTooltip = true;
    };
    $scope.phoneIsValid= function(){
      console.log($scope.formData.phone);
      if($scope.formData.phone!=undefined) {
        var phone_REGEXP = /^0/;
        var isMatchRegex = phone_REGEXP.test($scope.formData.phone);
        console.log("isMatchRegex = "+isMatchRegex);
        if (Number($scope.formData.phone.length) >= 9 && !isMatchRegex) {
          console.log('test phone');
          return true;
        }
        else
          return false;
      }else
        return false;
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
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $scope.formData.phone = "";
    $scope.formData.email = "";
    $scope.formData.password = "";
  });
  });
