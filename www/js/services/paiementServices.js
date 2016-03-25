/**
 * Created by Omar on 16/10/2015.
 */

angular.module('paiementServices', ['ionic', 'cb.x2js'])

  .service('payLine', function ($http) {

	  this.getToken=function(data, accessKeyRef, cardNumber, cardExpirationDate,CardCvx){

          var url = "https://homologation-webpayment.payline.com/webpayment/getToken";
          var data = "data="+data+"&accessKeyRef="+accessKeyRef+"&cardNumber="+cardNumber+"&cardExpirationDate="+cardExpirationDate+"&cardCvx="+CardCvx

		//   jQuery.ajax({
        //       url: "http://example.appspot.com/rest/app",
        //       type: "POST", data: JSON.stringify({"foo":"bar"}),
        //       dataType: "json",
        //       contentType: "application/json; charset=utf-8",
        //       success: function (response) { console.log("success"); },
        //       error: function (response) { console.log("failed"); } });

		return $http({
			method: 'POST',
			url: url,
			// headers: {
			// 	"Content-Type": "text/xml"
			// },
			data:data
		});
	  }


  })
  .service('slimPay', function ($http) {

	  this.getToken0=function(){

          var appID = "hbtib1xl1g9s39ui";
          var appSecret = "1SjZ1g~FM9HinLc%Xs8jAFJes5V#zy~$q0gS";

          var authdata = btoa(appID + ':' + appSecret);

          var url = "https://api-sandbox.slimpay.net/oauth/token?grant_type=client_credentials&scope=api";
          //var data = "data="+data+"&accessKeyRef="+accessKeyRef+"&cardNumber="+cardNumber+"&cardExpirationDate="+cardExpirationDate+"&cardCvx="+CardCvx

          //var data = {"grant_type":"client_credentials","&scope":"api"}

		//   jQuery.ajax({
        //       url: "http://example.appspot.com/rest/app",
        //       type: "POST", data: JSON.stringify({"foo":"bar"}),
        //       dataType: "json",
        //       contentType: "application/json; charset=utf-8",
        //       success: function (response) { console.log("success"); },
        //       error: function (response) { console.log("failed"); } });

		return $http({
			method: 'POST',
			url: url,
			headers: {
                "Access-Control-Allow-Origin" : '*',
				"Authorization": authdata,
                'Content-Type' : 'application/json'
			},

			//data:data
		});
	  }

      this.getToken=function(){

          var url = "http://ns389914.ovh.net:8080/vitonjobv1/api/callout";


          var data = {
            	class : 'fr.protogen.masterdata.model.CCallout',
                id : 69,
	           args : []
          }



		return $http({
			method: 'POST',
			url: url,
			headers: {
                'Content-Type' : 'application/json'
			},

			data:data
		});
	  }

      this.getPoint=function(){


          var bearer = "ddaad87a-68fc-4c03-b796-231d043193cc";

          var url = "https://api-sandbox.slimpay.net/";
          //var data = "data="+data+"&accessKeyRef="+accessKeyRef+"&cardNumber="+cardNumber+"&cardExpirationDate="+cardExpirationDate+"&cardCvx="+CardCvx

          //var data = {"grant_type":"client_credentials","&scope":"api"}

		//   jQuery.ajax({
        //       url: "http://example.appspot.com/rest/app",
        //       type: "POST", data: JSON.stringify({"foo":"bar"}),
        //       dataType: "json",
        //       contentType: "application/json; charset=utf-8",
        //       success: function (response) { console.log("success"); },
        //       error: function (response) { console.log("failed"); } });

		return $http({
			method: 'GET',
			url: url,
			headers: {
                "Accept": 'application/hal+json; profile="https://api.slimpay.net/alps/v1"',
				"Authorization": 'Bearer '+bearer,
                'Content-Type' : 'application/json'
			},

			//data:data
		});
	  }

  });
