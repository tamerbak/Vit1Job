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

    /*********************New code*********************/
    $scope.Authenticate = function () {
      var email = $scope.formData.email;
      var password = $scope.formData.password;
      var msg = [];
      if (isEmpty(email)) {
        msg.push("Email");
      }
      if (isEmpty(password)) {
        msg.push("Mot de passe");
      }
      //email validation
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (!re.test(email)) {
        Global.showAlertValidation("Veuillez saisir un email valide.");
        return;
      }
      if (msg.length > 0) {
        Global.missedFieldsAlert(msg);
        return;
      }
      var jsonObj = {"email": btoa(JSON.stringify(email)),
                    "telephone": "", "password": btoa(JSON.stringify(password)),
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
          Global.showAlertValidation("Bienvenue! Merci de saisir vos informations avant de lancer votre recherche.");
          $state.go("saisieCiviliteEmployeur");
        } else {
          $state.go("search");
        }
      }
    }

    $scope.validatEmail = function (id) {
      Validator.checkEmail(id);
    }
  });
