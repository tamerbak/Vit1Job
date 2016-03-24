/**
 * Created by tim on 16/03/16.
 */

starter.controller('MenuCtrl', function ($scope, localStorageService, $state, $ionicSideMenuDelegate) {

  //Control variables

  //Before enter to menu ..
  $scope.$on('$ionicView.beforeEnter', function () {
    var cnx = localStorageService.get('connexion');
    if (cnx) {
      $scope.isConnected = cnx.etat;
    } else {
      $scope.isConnected = false;
    }
  });

  $scope.$watch($ionicSideMenuDelegate.getOpenRatio(), function() {
    //do something
    console.log($ionicSideMenuDelegate.getOpenRatio()+"");

    var cnx = localStorageService.get('connexion');
    if (cnx) {
      $scope.isConnected = cnx.etat;
    } else {
      $scope.isConnected = false;
    }
  });

  //Test if user connected before showing connection page
  $scope.goToConnection = function () {
    if (!$scope.isConnected) {
      $state.go('menu.connection');
    }
  };

  //Test if user connected before showing personal information
  $scope.goToFiche = function () {
    if ($scope.isConnected) {
      $state.go('menu.infoTabs.saisieCiviliteEmployeur');
    } else {
      $state.go('menu.connection');
    }
  };

  //Test if user connected before showing offers
  $scope.goToOffers = function () {
    if ($scope.isConnected) {
      $state.go('menu.offres');
    } else $state.go('menu.connection');
  };

  //Test if user connected before showing check
  $scope.goToCoffre = function () {
    var cnx = localStorageService.get('connexion');
    if (cnx) {
      if (cnx.etat) {
        $state.go('menu.coffre');
      } else {
        $state.go('menu.connection');
      }
    } else $state.go('menu.connection');
  };

});
