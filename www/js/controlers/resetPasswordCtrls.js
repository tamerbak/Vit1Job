/**
 * Created by Tamer on 14/10/2015.
 */

'use strict';

starter
    .controller('ResetPasswordCtrl', function ( $scope, $rootScope, localStorageService, $state, $http,
                                                x2js, passwordService, smsService, PullDataFromServer, formatString,
                                                 LoadList, Global, DataProvider, Validator,AuthentificatInServer) {

        var newPassword = null;
        var phoneNumber = null;
        var usermail = null;
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

            var isNewUser = data.new;
            if (isNewUser == 'true') {
                Global.showAlertValidation("Les données de votre compte sont incorrectes");
                //$state.go("saisieCiviliteEmployeur");
            } else {
                newPassword = passwordService.generatePassword(6);

                //>Service : Send SMS
                smsService.sendPassword(phoneNumber,newPassword)
                    .success(onSendPasswordSuccess)
                    .error(onSendPasswordError);

            }
        };

        var OnAuthenticateError = function(data){
            Global.showAlertValidation("Le nom d'utilisateur ou le mot de passe est incorrect");
        };

        var onSendPasswordError = function(data){
            Global.showAlertValidation("Une erreur est survenue lors de l'envoi du mot de passe");
        };

        var onSendPasswordSuccess = function(data){
            if(!newPassword || !phoneNumber){
                onSendPasswordError(data);
                return;
            }


            localStorageService.remove('connexion');

            var connexion = {
                'etat': false,
                'phone': phoneNumber,
                'email': usermail,
                'smsPassword': newPassword,
            };

            localStorageService.set('connexion', connexion);

            $state.go("changePassword")
        };

        $scope.ResetPassword = function () {
            var index = $scope.formData.index;
            var phone = $scope.formData.phone;
            var email = $scope.formData.email;

            phone = index + phone;

            phoneNumber = phone;
            usermail = email;

            //>Service : Verify User
            AuthentificatInServer.Authenticate(email, phone, "password", 'employeur')
                    .success(OnAuthenticateSuccesss)
                    .error(OnAuthenticateError);




        };

        //Email Validator
        $scope.displayEmailTooltip = function() {
            $scope.emailToolTip = 'Veuillez saisir un email valide.';
            $scope.showEmailTooltip = true;
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

        //Phone Validator
        $scope.displayPhoneTooltip = function() {
            $scope.showPhoneTooltip = true;
        };

        $scope.phoneIsValid= function(){
            //console.log($scope.formData.phone);
            if($scope.formData.phone!=undefined) {
                var phone_REGEXP = /^0/;
                var isMatchRegex = phone_REGEXP.test($scope.formData.phone);
                //console.log("isMatchRegex = "+isMatchRegex);
                if (Number($scope.formData.phone.length) >= 9 && !isMatchRegex) {
                    return true;
                }
                return false;
            }
            return false;
        };


		$scope.initForm=function(){
			// GET LIST
            if(!$scope.formData){
                $scope.formData={};
            }

            $scope.formData.index="33";
            //$scope.formData={ 'villes': $cookieStore.get('villes')};
            $http.get("http://ns389914.ovh.net:8080/VitOnJob/rest/common/pays/getAll")
                .success(function(data) {
                    console.log(data);
                    $scope.formData.pays=data;
                }).error(function(error) {
                    console.log(error);
                });
        };

        $scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
            if(states.stateName == "menu.cPhone" ){
                $scope.initForm();
            }
        });

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

  });
