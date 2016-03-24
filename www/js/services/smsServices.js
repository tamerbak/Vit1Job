/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('SmsServices', ['ionic'])

    .service('smsService', function ($http){

        var serviceURi = "http://localhost:8080/VitOnJob/rest/public/";

        this.sendPassword = function(phone,password){

            var phone = "00"+phone;
            var sms = password;

            var soapMessage=
            '<fr.protogen.connector.model.SmsModel>'+
                '<telephone>'+phone+'</telephone>'+
                '<text>'+password+'</text>'+
            '</fr.protogen.connector.model.SmsModel>';


            var request = {
                method: 'POST',
                url: 'http://vps259989.ovh.net:8080/vitonjobv1/api/envoisms' ,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: soapMessage
            };

            return $http(request);;
        }
    })


