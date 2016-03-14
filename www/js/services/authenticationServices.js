/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('wsConnectors', ['ionic'])

  .service('AuthentificatInServer', function ($http) {

    var srvURi = "http://localhost:8080/VitOnJob/rest/public/";

    this.AuthenticateUser = function (user) {
      /*return $http({
       method: 'POST',
       url: srvURi+"/account/login",
       headers: {
       "Content-Type": "application/json",
       "login": JSON.stringify(user),
       }
       });*/
      var wsRs = {
        "email": "rachid@test.com", "employerId": 1, isNew: true,
        "entreprises": [{
          "entrepriseId": 1, "name": "entreprise1",
          "offers": [{
            "offerId": 1, "title": "titre offer 1",
            "pricticesJob": [{"pricticeJobId": 1, "job": "job 1", "level": "Bien"}],
            "pricticesLanguage": [{"pricticeLanguageId": 1, "language": "Français", "level": "Bien"}]
          },
            {
              "offerId": 2, "title": "titre offer 2",
              "pricticesJob": [{"pricticeJobId": 3, "job": "job 2", "level": "Excellent"},
                {"pricticeJobId": 2, "job": "job 1", "level": "Excellent"}],
              "pricticesLanguage": [{"pricticeLanguageId": 2, "language": "Anglais", "level": "Bien"}]
            }]
        }]
      };
      return wsRs;
    };
    this.Authenticate = function (email, phone, password, role) {

      /*var login = '{"email":"' + btoa(email) +
       '","telephone":"' + btoa(phone) + '","password":"' +
       btoa(password) + '","role":"' + btoa(role) + '"}';*/

      var login =
      {
        'class': 'com.vitonjob.callouts.auth.AuthToken',
        'email': email,
        'telephone': "+" + phone,
        'password': password,
        'role': role
      };

      login = JSON.stringify(login);

      var encodedLogin = btoa(login);

      var data = {
        'class': 'fr.protogen.masterdata.model.CCallout',
        'id': 49,
        'args': [{
          'class': 'fr.protogen.masterdata.model.CCalloutArguments',
          label: 'requete authentification',
          value: encodedLogin
        }]
      };

      var stringData = JSON.stringify(data);

      var request = {
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
        headers: {
          'Content-Type': 'application/json'
        },
        data: stringData
      };

      return $http(request);

    };


    this.yousignService = function (employeur, jobyer) {

      var jsonData = {
        "titre": employeur.titre,
        "prenom": employeur.prenom,
        "nom": employeur.nom,
        "entreprise": employeur.entreprises[0].name,
        "adresseEntreprise": "Paris",
        "jobyerPrenom": jobyer.prenom,
        "jobyerNom": jobyer.nom,
        "nss": "1 99 99 99 999 999 99",
        "dateNaissance": "09/08/1975",
        "lieuNaissance": "Villepinte",
        "nationalite": "Français",
        "dateDebutMission": "01/04/2016",
        "dateFinMission": "01/05/2016",
        "periodeEssai": "3 jours",
        "dateDebutTerme": "01/04/2016",
        "dateFinTerme": "01/04/2016",
        "motifRecours": "Remplacement Maladie",
        "justificationRecours": "Mme Martin Monique",
        "qualification": "Magasinier confirmé",
        "caracteristiquePoste": "Gestion du stock pièces",
        "tempsTravail": {
          "nombreHeures": "35H Hebdo",
          "variables": "Oui"
        },
        "horaireHabituel": {
          "debut": "8H00",
          "fin": "18H00",
          "variables": "Oui"
        },
        "posteARisque": "Non",
        "surveillanceMedicale": "Non",
        "epi": "chaussures de sécurité",
        "salaireBase": "15,00€ B/H",
        "dureeMoyenneMensuelle": "35H Hebdo",
        "salaireHN": "115,00€ B/H",
        "salaireHS": {
          "35h": "+25%",
          "43h": "+50%"
        },
        "droitRepos": "> 41H 50%",
        "adresseInterim": "",
        "client": "",
        "primeDiverses": "néant"

      };


      var dataSign =
      {
        'class': 'com.vitonjob.yousign.callouts.YousignConfig',
        'employerFirstName': employeur.prenom,
        'employerLastName': employeur.nom,
        'employerEmail': employeur.email,
        'employerPhone': employeur.tel,
        'jobyerFirstName': jobyer.prenom,
        'jobyerLastName': jobyer.nom,
        'jobyerEmail': jobyer.email,
        'jobyerPhone': jobyer.tel,
        'data': btoa(unescape(encodeURIComponent(JSON.stringify(jsonData))))
      };
      //employeur.entreprises[0].name
      dataSign = JSON.stringify(dataSign);
//unescape(encodeURIComponent(str))
      var encoDataSign = btoa(dataSign);

      var data = {
        'class': 'fr.protogen.masterdata.model.CCallout',
        'id': 65,//59,//58,//57, //56,//55,//54, //53,//52,// 51, //47,
        'args': [{
          'class': 'fr.protogen.masterdata.model.CCalloutArguments',
          label: 'Signature electronique',
          value: encoDataSign
        }]
      };

      var stringData = JSON.stringify(data);

      var request = {
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
        headers: {
          'Content-Type': 'application/json'
        },
        data: stringData
      };

      return $http(request);

    };

  })

  .service('PullDataFromServer', function ($http) {




  })

  .service('UpdateInServer', function ($http) {
    this.updateCiviliteInEmployeur = function (user, civilite, nom, prenom, raisonSocial, siret, codeAPE, numUrssaf, sessionID, employerId, enterpriseId) {
      var sql = "update user_employeur set ";
      sql = sql + " titre='" + civilite + "', ";
      sql = sql + " nom='" + nom + "', prenom='" + prenom + "' where pk_user_employeur=" + employerId + ";";
      sql = sql + " update user_entreprise set nom_ou_raison_sociale='" + raisonSocial + "', ";
      sql = sql + "siret='" + siret + "', ";
      sql = sql + "urssaf='" + numUrssaf + "', ";
      sql = sql + "ape_ou_naf='" + codeAPE + "' where  pk_user_entreprise=" + enterpriseId;


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql',
        headers: {
          "Content-Type": "text/plain"
        },
        data: sql
      });
    };

    /*this.updateCiviliteInEmployeur = function (user, civilite, nom, prenom, raisonSocial, siret, codeAPE, numUrssaf, sessionID, employerId, enterpriseId) {
      var sql = "update user_employeur set ";
      sql = sql + " titre='" + civilite + "', ";
      sql = sql + " nom='" + nom + "', prenom='" + prenom + "' where pk_user_employeur=" + employerId + ";";
      sql = sql + " update user_entreprise set nom_ou_raison_sociale='" + raisonSocial + "', ";
      sql = sql + "siret='" + siret + "', ";
      sql = sql + "urssaf='" + numUrssaf + "', ";
      sql = sql + "ape_ou_naf='" + codeAPE + "' where  pk_user_entreprise=" + enterpriseId;


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql',
        headers: {
          "Content-Type": "text/plain"
        },
        data: sql
      });
    };*/

    this.updateAdressePersEmployeur = function (entrepriseId, adresse) {
      //  I will start by formating the adress
      //  Street adress
      var streetIndex = adresse.indexOf("street-address");
      var street = '';
      if (streetIndex > 0) {
        streetIndex = streetIndex + 16;
        var sub = adresse.substring(streetIndex, adresse.length - 1);
        var endStreetIndex = sub.indexOf('</');
        street = sub.substring(0, endStreetIndex);
      }

      //  Code postal
      var cpIndex = adresse.indexOf("postal-code");
      var cp = '';
      if (cpIndex > 0) {
        cpIndex = cpIndex + 13;
        var subcp = adresse.substring(cpIndex, adresse.length - 1);
        var endCpIndex = subcp.indexOf('</');
        cp = subcp.substring(0, endCpIndex);
      }

      //  Ville
      var villeIndex = adresse.indexOf("locality");
      var ville = '';
      if (villeIndex > 0) {
        villeIndex = villeIndex + 10;
        var subville = adresse.substring(villeIndex, adresse.length - 1);
        var endvilleIndex = subville.indexOf('</');
        ville = subville.substring(0, endvilleIndex);
      }

      //  Pays
      var paysIndex = adresse.indexOf("country-name");
      var pays = '';
      if (paysIndex > 0) {
        paysIndex = paysIndex + 14;
        var subpays = adresse.substring(paysIndex, adresse.length - 1);
        var endpaysIndex = subpays.indexOf('</');
        pays = subpays.substring(0, endpaysIndex);
      }

      //  Now we need to save the adresse
      var adresseData = {
        'class': 'com.vitonjob.localisation.AdressToken',
        'street': street,
        'cp': cp,
        'ville': ville,
        'pays': pays,
        'role': 'employeur',
        'id': entrepriseId,
        'type': 'personnelle'
      };

      adresseData = JSON.stringify(adresseData);

      var encodedAdresse = btoa(adresseData);

      var data = {
        'class': 'fr.protogen.masterdata.model.CCallout',
        'id': 29,
        'args': [{
          'class': 'fr.protogen.masterdata.model.CCalloutArguments',
          label: 'Adresse',
          value: encodedAdresse
        }]
      };

      var stringData = JSON.stringify(data);

      var request = {
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
        headers: {
          'Content-Type': 'application/json'
        },
        data: stringData
      };

      return $http(request);
    };

    this.updateAdresseTravEmployeur = function (entrepriseId, adresse) {
      //  I will start by formating the adress
      //  Street adress
      var streetIndex = adresse.indexOf("street-address");
      var street = '';
      if (streetIndex > 0) {
        streetIndex = streetIndex + 16;
        var sub = adresse.substring(streetIndex, adresse.length - 1);
        var endStreetIndex = sub.indexOf('</');
        street = sub.substring(0, endStreetIndex);
      }

      //  Code postal
      var cpIndex = adresse.indexOf("postal-code");
      var cp = '';
      if (cpIndex > 0) {
        cpIndex = cpIndex + 13;
        var subcp = adresse.substring(cpIndex, adresse.length - 1);
        var endCpIndex = subcp.indexOf('</');
        cp = subcp.substring(0, endCpIndex);
      }

      //  Ville
      var villeIndex = adresse.indexOf("locality");
      var ville = '';
      if (villeIndex > 0) {
        villeIndex = villeIndex + 10;
        var subville = adresse.substring(villeIndex, adresse.length - 1);
        var endvilleIndex = subville.indexOf('</');
        ville = subville.substring(0, endvilleIndex);
      }

      //  Pays
      var paysIndex = adresse.indexOf("country-name");
      var pays = '';
      if (paysIndex > 0) {
        paysIndex = paysIndex + 14;
        var subpays = adresse.substring(paysIndex, adresse.length - 1);
        var endpaysIndex = subpays.indexOf('</');
        pays = subpays.substring(0, endpaysIndex);
      }

      //  Now we need to save the adresse
      var adresseData = {
        'class': 'com.vitonjob.localisation.AdressToken',
        'street': street,
        'cp': cp,
        'ville': ville,
        'pays': pays,
        'role': 'employeur',
        'id': entrepriseId,
        'type': 'travaille'
      };

      adresseData = JSON.stringify(adresseData);

      var encodedAdresse = btoa(adresseData);

      var data = {
        'class': 'fr.protogen.masterdata.model.CCallout',
        'id': 29,
        'args': [{
          'class': 'fr.protogen.masterdata.model.CCalloutArguments',
          label: 'Adresse',
          value: encodedAdresse
        }]
      };

      var stringData = JSON.stringify(data);

      var request = {
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
        headers: {
          'Content-Type': 'application/json'
        },
        data: stringData
      };

      return $http(request);

    };
  })


  .service('LoadList', function ($http) {

    this.loadCountries = function () {
      var sql = "SELECT nom, indicatif_telephonique FROM user_pays ORDER BY nom";

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

  .service('GlobalService', function () {
    //this.employeId=0;
    var employeId = window.employeId;

    return {
      getEmployeId: function () {
        return employeId;
      },
      setEmployeId: function (id) {
        employeId = id;
      }
      /**,isConnected: function() {
            return !!user;
        }**/
    };
    /** SETTERS
     this.setEmployeId=function(id){
		  this.employeId=id;
	  }

     // GETTERS
     this.getEmployeId=function(){
		  return this.employeId;
	  }**/
  })

  .factory('LocalStorageService', function () {

    return {
      setItem: function (key, obj) {
        var objToString = JSON.stringify(obj);
        window.localStorage.setItem(key, objToString);
      },
      getItem: function (key) {
        var str = window.localStorage.getItem(key);
        var stringToJSON = JSON.parse(str);
        return stringToJSON;
      }
    }
  });
