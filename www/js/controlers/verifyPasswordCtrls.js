/**
 * Created by Tamer on 14/10/2015.
 */

'use strict';

starter
    .controller('VerifyPasswordCtrl', function ( $scope, $rootScope, localStorageService, $state, $http, 
                                                x2js, passwordService, smsService, PullDataFromServer, formatString,
                                                PersistInServer, LoadList, Global, DataProvider, Validator) {

        
        $scope.formData = {};
        $scope.isIOS = ionic.Platform.isIOS();
        $scope.isAndroid = ionic.Platform.isAndroid();
        
        
//         var onSendPasswordError = function(data){
//              Global.showAlertPassword("Une erreur est survenue lors de l'envoi du mot de passe");
//         };
//         
//         var onSendPasswordSuccess = function(data){
//             if(!newPassword || !phoneNumber){
//                 onSendPasswordError(data);
//                 return;
//             }
// 
//  
//             localStorageService.remove('connexion');
//             
//             var connexion = {
//                 'phone': phoneNumber,
//                 'email': usermail,
//                 'password': newPassword,
//             };
// 
//             localStorageService.set('connexion', connexion);
// 
//             $state.go("verifyNewPassword")
//         };

        $scope.VerifyPassword = function () {
            var password = $scope.formData.password;
            
      
            
            var connexion =  localStorageService.get('connexion');
            
            if(connexion.password == password){
                Global.showAlertPassword("OK");
            }else{
                Global.showAlertPassword("Erreur");
            }

        };
         
        //Email Validator
        
        
        //Phone Validator
        $scope.displayPwdTooltip = function() {
            $scope.showPwdTooltip = true;
            };
            $scope.passwordIsValid= function(){
            if($scope.formData.password!=undefined) {
                if (Number($scope.formData.password.length) >= 6) {
                return true;
                }
                else
                return false;
            }else
                return false;


            };
        

		$scope.initForm=function(){
			// GET LIST
            if(!$scope.formData){
                $scope.formData={};
            }
                
            
        };	

        $scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
            if(states.stateName == "cPhone" ){
                $scope.initForm();
            }
        });
        
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
  
  });
