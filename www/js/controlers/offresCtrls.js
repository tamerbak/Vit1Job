/**
 * Created by Tamer on 15/10/2015.
 */

'use strict';
starter

	.controller('offresCtrl', function ($scope,Global){
		// FORMULAIRE

		$scope.initAll = function(){

			// GET LIST
      $scope.formData={'offresPublies':[],'offresNonPublies':[]};
      $scope.formData.offre={};
      $scope.formData.offres=[{"titre":"Serveur",selected:false, etat:"publie"},{titre:"java",selected:false,etat:"publie"},{titre:"Chef cuisinier",etat:"noPublie"},{titre:"Serveur debutant",etat:"noPublie"},{titre:"Caissier",etat:"noPublie"}];

      var offres=$scope.formData.offres;
      for(var i=0; i<offres.length;i++){
        if(offres[i].etat=="publie")
        $scope.formData.offresPublies.push(offres[i]);
        else
          $scope.formData.offresNonPublies.push(offres[i]);
      }

    };

    $scope.offreChange=function(item){
      console.log(item);
      if(item.selected)
        item.selected=false;
      else
        item.selected=true;
      console.log(item.selected);
    };
    $scope.supprimerOffre= function(){
      var offre=$scope.formData.offre;
      if(offre.selected){
        var offres=$scope.formData.offres;
        var indexOffres=offres.indexOf(offre);
        $scope.formData.offres.splice(indexOffres, 1);
        if(offre.etat=="publie")
          $scope.formData.offresPublies.splice($scope.formData.offresPublies.indexOf(offre), 1);
        else
          $scope.formData.offresNonPublies.splice($scope.formData.offresNonPublies.indexOf(offre), 1);
        $scope.formData.offre={selected:false};
      }else{
        Global.showAlertValidation("Veuillez séléctionner une offre.");
      }
    };
		$scope.$on("$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "competence" ){
				console.log("Initialisation : beforeEnter(competence)");
				$scope.formData['currentFeuille']=1;
				$scope.formData['allFeuilles']=1;

				// FEUILLE N°1
				$rootScope.jobyerCurrent={};
				$rootScope.jobyerCurrent['indice']=1;
				$rootScope.jobyers=[];
				$rootScope.jobyers.push($rootScope.jobyerCurrent);
			}
		});
  });
