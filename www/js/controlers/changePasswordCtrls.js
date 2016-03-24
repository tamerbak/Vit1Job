/**
 * Created by Tamer on 14/10/2015.
 */

'use strict';

starter
    .controller('ChangePasswordCtrl', function ( $scope, $rootScope, localStorageService, $state, $http,
                                                x2js, passwordService, smsService, PullDataFromServer, formatString,
                                                 LoadList, Global, DataProvider, Validator) {


        $scope.formData = {};
        $scope.isIOS = ionic.Platform.isIOS();
        $scope.isAndroid = ionic.Platform.isAndroid();


        var OnUpdatePasswordError = function(data){
             Global.showAlertValidation("Une erreur est survenue lors de changement du mot de passe");
        };

        var OnUpdatePasswordSuccesss = function(data){
            if(data.status != "success"){
                Global.showAlertValidation("Une erreur est survenue lors de changement du mot de passe");
            }else{
                localStorageService.remove('connexion');
                $state.go("menu.connection")
            }

        };

        $scope.ChangePassword = function () {

            var oldPassword = $scope.formData.oldPassword;
            var password = $scope.formData.password;
            var password2 = $scope.formData.password2;


            var connexion =  localStorageService.get('connexion');

            if(connexion != null && connexion.smsPassword ){
                if(oldPassword != connexion.smsPassword){
                    Global.showAlertValidation("le mot de passe envoyé par SMS est incorrect");
                }else{
                    if(Number($scope.formData.password.length)>=6 && password === password2){

                        //>Service : Update Password
                        passwordService.updatePassword(connexion.email, connexion.phone, password)
                            .success(OnUpdatePasswordSuccesss)
                            .error(OnUpdatePasswordError);

                    }else{
                        Global.showAlertValidation("le nouveau mot de passe est incorrect");
                    }
                }
            }else{
                Global.showAlertValidation("Veuillez saisir vos données d'authentification pour réinitialiser votre mot de passe");
                $state.go("resetPassword")
            }

        };





        $scope.displayPwdTooltip = function() {
            $scope.showPwdTooltip = true;
        };

        $scope.passwordIsValid= function(){
            if($scope.formData.password!=undefined) {
                if (Number($scope.formData.password.length) >= 6) {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                 return false;
            }

        };

        $scope.displayPwd2Tooltip = function() {
            $scope.showPwd2Tooltip = true;
        };

        $scope.password2IsValid= function(){
            if($scope.formData.password2!=undefined && $scope.formData.password!=undefined) {
                if (Number($scope.formData.password2.length) >= 6 && $scope.formData.password2 === $scope.formData.password ) {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                 return false;
            }

        };

        $scope.displayOldPwdTooltip = function() {
            $scope.showOldPwdTooltip = true;
        };

        $scope.oldPasswordIsValid= function(){
            if($scope.formData.oldPassword !=undefined) {
                if (Number($scope.formData.oldPassword.length) >= 6 ) {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                 return false;
            }

        };

		$scope.initForm=function(){

            if(!$scope.formData){
                $scope.formData={};
            }


        };

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

  });
