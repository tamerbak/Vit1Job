/**
 * Created by Omar on 16/10/2015.
 */

angular.module('globalServices', ['ionic', 'cb.x2js','ngCookies'])

  .service('Global', function ($http, $ionicPopup, localStorageService) {

	  this.showAlert=function(temp){

		  var myPopup = $ionicPopup.show({

			  template: temp+" <br>",
			  title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
			  //subTitle: 'Aucun Jobyer ne correspond à votre recherche',
			  //scope: $scope,
			  buttons: [
				{
					text: '<b>Non</b>',
					type: 'button-dark',
					onTap: function(e){

					}
				},{
					text: '<b>Oui</b>',
					type: 'button-calm',
					onTap: function(e){

					}
				}
			 ]
		 });
	  };

	    this.showAlertValidation=function(temp){

		  var myPopup = $ionicPopup.show({

			  template: temp+" <br>",
			  title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
			  buttons: [
				{
					text: '<b>OK</b>',
					type: 'button-dark',
					onTap: function(e){

					}
				}]
		 });
	  };

	  this.showAlertPassword=function(temp){

		  var myPopup = $ionicPopup.show({

			  template: temp+" <br>",
			  title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
			  //scope: $scope,
			  buttons: [{
							text: '<b>OK</b>',
							type: 'button-dark',
							onTap: function(e){}
						}]
		  });
	   };

		this.showCopyAddress=function(temp){

			return $ionicPopup.confirm({
				title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
				template: temp+"<br>",
				cancelText: "Non",
				cancelType: 'button-dark',
				okText: "Oui",
				okType: 'button-calm'
			});
		};

		this.showAlertAdress=function(temp){

		  var myPopup = $ionicPopup.show({

			  template: temp+" <br>",
			  title: "<div class='vimgBar'><img src='img/vit1job-mini2.png'></div>",
			  buttons: [
				{
					text: '<b>Non</b>',
					type: 'button-dark',
					onTap: function(e){

					}
				},{
					text: '<b>Oui</b>',
					type: 'button-calm',
					onTap: function(e){

					}
				}
			 ]
		 });
	  };

    this.missedFieldsAlert = function (fieldList){

      var message = "Veuillez saisir votre <br> <ul>";
      if (fieldList == "undefined"){
        return;
      }
      if (Array.isArray(fieldList)){ //liste des champs
        for (var i = 0; i< fieldList.length;i++){
          message = message + "<li>" +fieldList[i]+ "<li>" ;
        }
      } else { // un seul champs ?
        message = message + "<li>" +fieldList+ "<li>" ;
      }
      message = message + "</ul>";
      this.showAlertValidation(message);

    }

  });
