/**
 * Created by abenaicha on 04/11/15.
 */

angular.module('Services')
  .service('OffresService', function ($http) {

    this.deleteOffreJobyer = function (offre) {

      var deleteOffreQuerys = '';

      if (offre && offre.offerId) {
        if (offre.disponibilite) {
          angular.forEach(offre.disponibilite, function (value, key) {
            var subDispoQuery = '(select pk_user_disponibilite from user_disponibilite where fk_user_disponibilite__user_offre_jobyer=' + offre.offerId + ');\n';
            deleteOffreQuerys += 'delete from user_plage_horaire where fk_user_disponibilite in ' + subDispoQuery;
            deleteOffreQuerys += 'delete from user_repetition where fk_user_disponibilite in ' + subDispoQuery;
            deleteOffreQuerys += 'delete from user_disponibilite where fk_user_disponibilite__user_offre_jobyer=' + offre.offerId + ';\n';
          });
        }

        deleteOffreQuerys += 'delete from user_offre_jobyer where pk_user_offre_jobyer=' + offre.offerId + ';\n';
      }

      console.log('>> Query : ' + deleteOffreQuerys);

      var deleteOffreRequest = {
        method: 'POST',
        url: 'http://vps259989.ovh.net:8080/vitonjobv1/api/sql',
        headers: {
          'Content-Type': 'text/plain'
        },
        data: deleteOffreQuerys
      };

      return $http(deleteOffreRequest);
    };
  });
