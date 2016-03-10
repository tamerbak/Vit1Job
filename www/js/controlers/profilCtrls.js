'use strict';

// this control will be deleted because there will be no Profile page ..
starter
  .controller('ProfileCtrl', function ($scope, ngFB,$stateParams) {
    /*ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        $scope.user = user;
      },
      function (error) {
        alert('Facebook error: ' + error.error_description);
      });*/



    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
      $scope.link = $stateParams.link;
    });

  })
;
