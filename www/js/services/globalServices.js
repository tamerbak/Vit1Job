/**
 * Created by Omar on 16/10/2015.
 */

angular.module('globalServices', ['ionic', 'cb.x2js'])

  .service('Global', function ($http, $ionicPopup) {
	  
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
	  }
  })
