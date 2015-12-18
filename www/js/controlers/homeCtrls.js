/**
 * Created by Tamer on 09/10/2015.
 */
 'use strict';

 starter

 .controller('homeCtrl', function ($scope, $rootScope, $http, $state, x2js, $ionicPopup, $cookieStore, 
  $timeout, $cookies, localStorageService, jobyerService) {
		// FORMULAIRE
		$scope.formData = {};
		//$scope.formData.connexion= {};

    $scope.getJobbers = function (query) {

      var jobyersForMe = [];
      var jobyersNextToMe = [];

      $rootScope.jobyersForMe = [];
      $rootScope.jobyersNextToMe = [];
      $rootScope.nbJobyersForMe = 0;
      $rootScope.nbJobyersNextToMe = 0;

      $rootScope.queryText = query;

      if (sessionId!=''){
        var soapMessage = 'user_salarie;' + query; //'C# sur paris';
        $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/recherche',
          headers: {
            "Content-Type": "text/plain"
          },
          data: soapMessage
        }).then(
        function(response){
          var jsonResp = x2js.xml_str2json(response.data);
          var jsonText = JSON.stringify (jsonResp);
          jsonText = jsonText.replace(/fr.protogen.connector.model.DataModel/g,"dataModel");
          jsonText = jsonText.replace(/fr.protogen.connector.model.DataRow/g,"dataRow");
          jsonText = jsonText.replace(/fr.protogen.connector.model.DataEntry/g,"dataEntry");
          jsonText = jsonText.replace(/fr.protogen.connector.model.DataCouple/g, "dataCouple");
          jsonText = jsonText.replace(/<!\[CDATA\[/g, '').replace(/\]\]\>/g,'');
          jsonResp = JSON.parse(jsonText);

           // var jsonResp = parsingService.formatString.formatServerResult(response.data);

            //Check if there are rows!

            //var rowsCount = jsonResp.dataModel.rows.dataRow.length;
            //if (typeof (jsonResp.dataModel.rows.dataRow.dataRow) == 'undefined') {
            //if (Array.isArray(jsonResp.dataModel.rows.dataRow)){
              if (jsonResp.dataModel.rows.dataRow instanceof Array){
              //if (jsonResp.dataModel.rows.dataRow.length > 0){
              //if (rowsCount > 0){

                for (var i = 0; i < jsonResp.dataModel.rows.dataRow.length; i++) {

                //jsonResp = parsingService.formatString.formatServerResult(response.data);

                //jsonResp.dataModel.rows.dataRow[0].dataRow.dataEntry[1].value
                var prenom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[1].value;
                var nom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[2].value;
                var idVille = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].value;


                prenom = prenom.replace("<![CDATA[",'');
                prenom = prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                idVille = idVille.replace("<![CDATA[",'');
                idVille = idVille.replace("]]>",'');

                for (var j=0; j < jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple.length;j++){
                  jsonText = JSON.stringify (jsonResp);
                  jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
                  jsonResp = JSON.parse(jsonText);
                  if (jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple[j].id == idVille)
                    break;
                }

                var ville = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[6].list.dataCouple[j].label;
                jobyersForMe.push(
                {
                  'firstName': prenom,
                  'lastName': nom,
                  'city': ville
                });
              }
            } else {
              //One Instance returned or null!
              if (jsonResp.dataModel.rows!=""){
                prenom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[1].value;
                nom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[2].value;
                idVille = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].value;

                prenom = prenom.replace("<![CDATA[",'');
                prenom= prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                idVille = idVille.replace("<![CDATA[",'');
                idVille = idVille.replace("]]>",'');

                for (j=0; j < jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple.length;j++){
                  if (jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple[j].id == idVille)
                    break;
                }

                ville = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[6].list.dataCouple[j].label;

                jobyersForMe[0] = {
                  'firstName': prenom,
                  'lastName': nom,
                  'city': ville
                };
              } else {
                // An elaborate, custom popup
                /*var myPopup = $ionicPopup.show({
                 template: '',
                 title: 'Résultat',
                 subTitle: 'Aucun Jobyer ne correspond à votre recherche',
                 scope: $scope
                 buttons: [
                 { text: 'Cancel' },
                 {
                 text: '<b>Save</b>',
                 type: 'button-positive',
                 onTap: function(e) {
                 if (!$scope.data.wifi) {
                 //don't allow the user to close unless he enters wifi password
                 e.preventDefault();
                 } else {
                 return $scope.data.wifi;
                 }
                 }
                 },
                 ]
                 });
                 myPopup.then(function(res) {
                 console.log('Tapped!', res);
                 });
                 $timeout(function() {
                 myPopup.close(); //close the popup after 3 seconds for some reason
                 }, 3000);
return;*/
}
}

            //sessionId = jsonResp.amanToken.sessionId;*/
            //console.log($scope.firstName + " " + $scope.secondName);

            $rootScope.jobyersForMe = jobyersForMe;
            $rootScope.nbJobyersForMe = jobyersForMe.length;

            // Send Http query to get jobbers with same competencies and same city as mine
            for (i=0; i < jobyersForMe.length ; i++){
              if (jobyersForMe[i].city == myCity) {
                jobyersNextToMe.push({
                  'firstName': jobyersForMe[i].firstName,
                  'lastName': jobyersForMe[i].lastName,
                  'city': jobyersForMe[i].city
                });
              }
            }
            $rootScope.nbJobyersNextToMe= jobyersNextToMe.length;
            $rootScope.jobyersNextToMe = jobyersNextToMe;

            //isConnected = true;
            //if (jobyersForMe.length>0)
            if ($scope.nbJobyersForMe != 0){
              $state.go('list');
            }
            //$state.go('app');
          },
          function(response){
            alert("Error : "+response.data);
          }
          );
}
};

$scope.exitVit = function () {
  navigator.app.exitApp();
};

$scope.initConnexion= function(){

  $scope.formData.connexion={'etat': false, 'libelle': 'Se connecter', 'employeID': 0};
  var cnx = $cookieStore.get('connexion');
  if(cnx){
   $scope.formData.connexion = cnx;
   console.log("Employeur est connecté");
 }

 console.log("connexion[employeID] : "+$scope.formData.connexion.employeID);
 console.log("connexion[libelle] : "+$scope.formData.connexion.libelle);
 console.log("connexion[etat] : "+$scope.formData.connexion.etat);
};

$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
  if(states.fromCache && states.stateName == "app" ) {
   $scope.initConnexion();
 }
});

$scope.modeConnexion= function(){
  var estConnecte=0;
  var cnx=$cookieStore.get('connexion');
  if(cnx){
			if(cnx.etat){ // IL S'AGIT D'UNE DECONNEXION
				console.log("IL S'AGIT D'UNE DECONNEXION");

      $cookieStore.remove('connexion');
      $cookieStore.remove('sessionID');
      var connexion = {'etat': false, 'libelle': 'Se connecter', 'employeID': 0};
      $cookieStore.put('connexion', connexion);

      console.log("New Connexion : "+JSON.stringify($cookieStore.get('connexion')));
      $state.go("connection");
				/*** REMOVE ALL COOKIES
				var cookies = $cookies.getAll();
				angular.forEach(cookies, function (v, k) {
					$cookieStore.remove(k);
				});**/

}
			else{ // IL S'AGIT D'UNE CONNEXION
				console.log("IL S'AGIT D'UNE CONNEXION");
      $state.go("connection");
    }
  }
  else
   $state.go("connection");
};

  //****************************************** NEW **********************************//

  var checkIsLogged = function(){
    var currentEmployer = localStorageService.get('currentEmployer');
    var isLogged = (currentEmployer) ? true : false;
    return isLogged;
  };

  $scope.isLogged = checkIsLogged();

  $scope.logOut = function(){
    localStorageService.remove('currentEmployer');
    $scope.isLogged = false;
  };

  var showAddOfferConfirmPopup = function(job) {
   var confirmPopup = $ionicPopup.confirm({
     cancelText: 'Continuer',
     title: 'VitOnJob',
     template: 'Pour que la recherche soit plus précis, voulez vous créer une offre pour ' + job + '?'
   });
   confirmPopup.then(function(res) {
     if(res) {
         // redirection vers la page d'ajout des offres employeur
         $state.go("competence");
       } else {
         getJobyersOffersByJob(job);
       }
     });
 };

 var onGetJobyersOffersByJobSuccess = function(data){
  var jobyersOffers = data;
  localStorageService.set('jobyersOffers',jobyersOffers);
  $state.go("jobyersOffersTab.list");
 };

   var onError = function(data){
    console.log(data);
  };

  var getJobyersOffersByJob = function(job){
    jobyerService.getJobyersOffersByJob(job).success(onGetJobyersOffersByJobSuccess).error(onError);
  };

  var isEntrepriseOfferByJobExists = function(job){
    if(!job) return;
    var currentEmployer = localStorageService.get('currentEmployer');
    if(!currentEmployer) return;
    var entreprises = currentEmployer.entreprises;
    var found = false;
    if(entreprises && entreprises.length > 0){
      var i = 0;
      var offers = [];
      var pricticesJob = [];
      var j;
      var k;
      while(!found && i < entreprises.length){
        offers = entreprises[i].offers;
        if(offers && offers.length > 0){
          j = 0;
          while(!found && j < offers.length){
            pricticesJob = offers[j].pricticesJob;
            if(pricticesJob && pricticesJob.length > 0){
              while(!found && k < pricticesJob.length){
                found = (pricticesJob[k].job && pricticesJob[k].job.toLowerCase() == job.toLowerCase());
                if(found){
                  localStorageService.set('currentOffer',offers[j]);
                  localStorageService.set('currentEntreprise',offers[i]);
                }
                else{
                  k++;
                }
              }
            }
            if(!found) j++;
          }
        }
        if(!found) i++;
      }
    }
    return found;
  };

  $scope.launchSearchForJobyersOffers = function(job){
    localStorageService.set('lastSearchedJob',job);
    localStorageService.remove('currentOffer');
    localStorageService.remove('currentEntreprise');
    var isLogged = checkIsLogged();
    if(isLogged){
      if(isEntrepriseOfferByJobExists(job)){
        getJobyersOffersByJob(job);
      }else{
        showAddOfferConfirmPopup(job);
      }
    }
    else{
      getJobyersOffersByJob(job);
    }
  };

});
