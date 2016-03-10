/**
 * Created by Tamer on 14/10/2015.
 */
'use strict';
var requestToken = "";
var accessToken = "";
var clientId = "715296704477-gt8soaf11ftbncgbadj59pvjbq2fv7f0.apps.googleusercontent.com";
var clientSecret = "x14txRHh2arUKVfNS7eZ8I-v";

starter
  .controller('connectCtrl', function ($scope, localStorageService, $state, ngFB, Global, $cordovaOauth, $http, formatString, AuthentificatInServer, x2js, LoadList) {

    // FORMULAIRE
    $scope.formData = {};

    // PROPRE AU GMAIL
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    $scope.fbLogin = function () {

      Global.showAlertValidation("En cours de construction.");

    };

    $scope.showAlert = function () {
      Global.showAlert();
    };

    $scope.linkedinLogin = function () {
      Global.showAlertValidation("En cours de construction.");
    };

    $scope.loginGmail = function () {

      Global.showAlertValidation("En cours de construction.");
      return;
      var ref = window
        .open(
        'https://accounts.google.com/o/oauth2/auth?client_id='
        + clientId
        + '&redirect_uri=http://localhost&scope=https://www.googleapis.com/auth/urlshortener&approval_prompt=force&response_type=code&access_type=offline',
        '_blank', 'location=no');
      ref
        .addEventListener(
        'loadstart',
        function (event) {
          if ((event.url)
              .startsWith("http://localhost/callback")) {
            requestToken = (event.url)
              .split("code=")[1];
            $http(
              {
                method: "post",
                url: "https://accounts.google.com/o/oauth2/token",
                data: "client_id="
                + clientId
                + "&client_secret="
                + clientSecret
                + "&redirect_uri=http://localhost"
                + "&grant_type=authorization_code"
                + "&code="
                + requestToken
              })
              .success(
              function (data) {
                accessToken = data.access_token;
                console
                  .log("accessToken : "
                  + accessToken);
                console
                  .log('Gmail login succeeded');
                $state
                  .go('profile');
              })
              .error(
              function (data,
                        status) {
                alert("ERROR: "
                  + data);
              });
            ref.close();
          }
        });
    };

    $scope.digitalOceanLogin = function () {
      $cordovaOauth.digitalOcean("CLIENT_ID_HERE",
        "CLIENT_SECRET_HERE").then(
        function (result) {
          window.localStorage.setItem("access_token",
            result.access_token);
        }, function (error) {
          console.log(error);
        });
    };

    $scope.getDroplets = function () {
      $http.defaults.headers.common.Authorization = "Bearer "
        + window.localStorage.getItem("access_token");
      $http.get("https://api.digitalocean.com/v2/droplets")
        .success(function (data) {
          console.log(JSON.stringify(data.droplets));
        }).error(function (error) {
          console.log(error);
        });
    };

  })
;
