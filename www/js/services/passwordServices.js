/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('passwordServices', ['ionic'])

    .service('passwordService', function ($http){

        this.generatePassword = function(size){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for ( var i=0 ; i < size ; i++ ){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
        
        this.updatePassword = function(email, phone,newPassword){
            var role = 'employeur';
            var sql = "UPDATE user_account SET ";
            sql = sql + " mot_de_passe='"+newPassword+"'  ";
            sql = sql + " WHERE ";
            sql = sql + " email='"+email+"' ";
            sql = sql + "AND telephone='"+phone+"' ";
            sql = sql + "AND role='"+role+"'; ";
            


            return $http({
                method: 'POST',
                url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql',
                headers: {
                "Content-Type": "text/plain"
                },
                data: sql
            });
        };
    })
    
    

    
    
    



