/**
 * Created by Tamer on 09/10/2015.
 */
'use strict';

starter
  .controller('searchCtrl', function ($scope, $rootScope,$state, $http, x2js, Global, UserService, GeoService) {

    $scope.mfbMenuState = 'open';
    $scope.search = $rootScope.queryText;

    /**
     *
     */
    $scope.checkGeoLocalisation = function() {
      if(!UserService.isAuthenticated()) {
        var confirmPopup = Global.showCopyAddress("Votre géolocalisation pour trouver des jobyers à proximité?")
              .then(function (res) {
                if (res) {
                    GeoService.getDistance(33.572046, -7.596710).then(function(result){
                      console.log('Distance ==>', result);
                    }, function(error) {
                      console.log(error);
                    });

                  GeoService.getUserAddress().then(function(result){
                    console.log('UserAddress ==>', result);
                  }, function(error) {
                    console.log(error);
                  });
                }
              });
      }
    };

    $scope.checkGeoLocalisation();

    /**
     *
     * @param search
     */
    $scope.onSearchChange = function (search) {

      /*$scope.mfbMenuState = 'closed';*/
      var jobyersForMe = [];
      var jobyersNextToMe = [];

      if ( search == ''){
        $rootScope.jobyersForMe = [];
        $rootScope.nbJobyersForMe = 0;
        $rootScope.nbJobyersNextToMe = 0;
        $rootScope.jobyersNextToMe = [];
        $scope.mfbMenuState = 'open';
        return;
      }


      if (sessionId != '') {
        var soapMessage = 'user_salarie;' + search; //'C# sur paris';
        $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/recherche',
          headers: {
            "Content-Type": "text/plain"
          },
          data: soapMessage
        }).then(
          function(response) {
            var jsonResp = x2js.xml_str2json(response.data);
            var jsonText = JSON.stringify (jsonResp);
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataModel/g,"dataModel");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataRow/g,"dataRow");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataEntry/g,"dataEntry");
            jsonText = jsonText.replace(/fr.protogen.connector.model.DataCouple/g, "dataCouple");
            jsonText = jsonText.replace(/<!\[CDATA\[/g, '').replace(/\]\]\>/g,'');
            jsonResp = JSON.parse(jsonText);

            //Check if there are rows!
            if (jsonResp.dataModel.rows.dataRow instanceof Array){
              for (var i = 0; i < jsonResp.dataModel.rows.dataRow.length; i++) {
                jsonText = JSON.stringify(jsonResp);
                jsonText = jsonText.replace("fr.protogen.connector.model.DataModel", "dataModel");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataRow", "dataRow");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataEntry", "dataEntry");
                jsonText = jsonText.replace("fr.protogen.connector.model.DataCouple", "dataCouple");
                jsonResp = JSON.parse(jsonText);

                //jsonResp.dataModel.rows.dataRow[0].dataRow.dataEntry[1].value
                var prenom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[1].value;
                var nom = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[2].value;
                var coordLambert = jsonResp.dataModel.rows.dataRow[i].dataRow.dataEntry[5].value;

                prenom = prenom.replace("<![CDATA[",'');
                prenom = prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                coordLambert = coordLambert.replace("<![CDATA[",'');
                coordLambert = coordLambert.replace("]]>",'');

                var jobyerLat = '';
                var jobyerLong = '';
                if (coordLambert.indexOf(",") > -1){
                  jobyerLat = coordLambert.split (',')[0];
                  jobyerLong = coordLambert.split (',')[1];
                }

                jobyersForMe.push({
                    'firstName': prenom,
                    'lastName': nom,
                    'lat': 48.717132, //jobyerLat,
                    'long': 2.245816 //jobyerLong
                  });
              }
            } else {
              //One Instance returned or null!
              if (jsonResp.dataModel.rows!=""){
                prenom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[1].value;
                nom = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[2].value;
                coordLambert = jsonResp.dataModel.rows.dataRow.dataRow.dataEntry[5].value;

                prenom = prenom.replace("<![CDATA[",'');
                prenom= prenom.replace("]]>",'');
                nom = nom.replace("<![CDATA[",'');
                nom = nom.replace("]]>",'');
                coordLambert = coordLambert.replace("<![CDATA[",'');
                coordLambert = coordLambert.replace("]]>",'');

                if (coordLambert.indexOf(",") > -1){
                  jobyerLat = coordLambert.split (',')[0];
                  jobyerLong = coordLambert.split (',')[1];
                }

                jobyersForMe[0] = {
                  'firstName': prenom,
                  'lastName': nom,
                  'lat': jobyerLat,
                  'long': jobyerLong
                };
              } else {
                $rootScope.jobyersForMe = [];
                $rootScope.nbJobyersForMe = 0;
                $rootScope.nbJobyersNextToMe = 0;
                $rootScope.jobyersNextToMe = [];
                $scope.mfbMenuState = 'open';
                return;
              }
            }

            //sessionId = jsonResp.amanToken.sessionId;*/
            //console.log($scope.firstName + " " + $scope.secondName);

            $rootScope.jobyersForMe = jobyersForMe;
            $rootScope.nbJobyersForMe = jobyersForMe.length;

            // Send Http search to get jobbers with same competencies and same city as mine
            for (i=0; i < jobyersForMe.length ; i++){
              var proximity = GeoService.getDistance(jobyersForMe[i].lat, jobyersForMe[i].long);
              proximity = proximity.toFixedDown(2);
              console.log(proximity);
              if (proximity <= 10) { // à proximité de 10Km
                jobyersNextToMe.push({
                  'firstName': jobyersForMe[i].firstName,
                  'lastName': jobyersForMe[i].lastName,
                  'proximity': proximity
                });
              }
            }
            $rootScope.jobyersNextToMe = jobyersNextToMe;
            $rootScope.nbJobyersNextToMe= jobyersNextToMe.length;
            $scope.mfbMenuState = 'open';
          },
          function(response){
            $rootScope.jobyersForMe = [];
            $rootScope.nbJobyersForMe = 0;
            $rootScope.nbJobyersNextToMe = 0;
            $rootScope.jobyersNextToMe = [];
            $scope.mfbMenuState = 'open';
            alert("Error : "+response.data);
          }
        );
      }
    };

    $scope.isNoJobyerForMe = function() {
      if ($scope.nbJobyersForMe != 0){
        $state.go('list');
      }
    };

    $scope.isNoJobyerNextToMe = function() {
      if ($scope.nbJobyersNextToMe != 0){
        $state.go('listNext');
      }
    };

    Number.prototype.toFixedDown = function(digits) {
      var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
      return m ? parseFloat(m[1]) : this.valueOf();
    };
  })
;
