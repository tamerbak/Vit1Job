/**
 * Created by abenaicha on 04/11/15.
 */

services
  .factory('UserService', function(localStorageService) {

      var user = {
        getUserInfos : function() {
            return localStorageService.get('connexion');
          },

        isAuthenticated : function() {
          var cnx = this.getUserInfos();
          if (cnx && cnx.etat) {
            return true;
          }
          return false;
        }
      };

    return user;
  });
