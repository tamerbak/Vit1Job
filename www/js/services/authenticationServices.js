/**
 * Created by Tamer on 14/10/2015.
 */

angular.module('wsConnectors', ['ionic'])

  .service('AuthentificatInServer', function ($http){

    var srvURi = "http://localhost:8080/VitOnJob/rest/public/";

    this.AuthenticateUser = function(user){
      /*return $http({
        method: 'POST',
        url: srvURi+"/account/login",
        headers: {
          "Content-Type": "application/json",
          "login": JSON.stringify(user),
        }
      });*/
      var wsRs= {"email":"rachid@test.com","employerId":1,isNew : true,
        "entreprises":[{"entrepriseId":1,"name":"entreprise1",
          "offers":[{"offerId":1,"title":"titre offer 1",
            "pricticesJob":[{"pricticeJobId":1,"job":"job 1","level":"Bien"}],
            "pricticesLanguage":[{"pricticeLanguageId":1,"language":"Français","level":"Bien"}]},
            {"offerId":2,"title":"titre offer 2",
              "pricticesJob":[{"pricticeJobId":3,"job":"job 2","level":"Excellent"},
                {"pricticeJobId":2,"job":"job 1","level":"Excellent"}],
              "pricticesLanguage":[{"pricticeLanguageId":2,"language":"Anglais","level":"Bien"}]}]}]};
      return wsRs;
    }
    this.Authenticate = function(email, phone, password, role){

      /*var login = '{"email":"' + btoa(email) + 
      '","telephone":"' + btoa(phone) + '","password":"' + 
      btoa(password) + '","role":"' + btoa(role) + '"}';*/

      var login = 
      {
        'class' : 'com.vitonjob.callouts.auth.AuthToken',
        'email' : email,
        'telephone' : phone,
        'password' : password,
        'role' : role
      };

      login = JSON.stringify(login);

      var encodedLogin = btoa(login);

      var data = {
        'class' : 'fr.protogen.masterdata.model.CCallout',
        'id' : 5,
        'args' : [{
            'class' : 'fr.protogen.masterdata.model.CCalloutArguments',
            label : 'requete authentification',
            value : encodedLogin
          }]
      };

      var stringData = JSON.stringify(data);

      var request = {
        method : 'POST',
        url : 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
        headers : {
        'Content-Type' : 'application/json'
        },
        data : stringData
      };

      return $http(request);

    };
    /*************************OLD***************************/
    this.getSessionId=function(){

      var soapMessage=
        '<fr.protogen.connector.model.AmanToken>'+
        '<username>administrateur</username>'+
        '<password>1234</password>'+
        '<nom></nom>'+
        '<appId>FRZ48GAR4561FGD456T4E</appId>'+
        '<sessionId></sessionId>'+
        '<status></status>'+
        '<id>0</id>'+
        '<beanId>0</beanId>'+
        '</fr.protogen.connector.model.AmanToken>';
      //console.log(soapMessage);

      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/aman',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };
  })

  .service('PullDataFromServer', function ($http){
      this.pullDATA=function(entity, sessionId, field, gt, lt){
        sopMessage = '<fr.protogen.connector.model.DataModel>'+
          '<entity>'+entity+'</entity>'+
          '<dataMap/><rows />'+
          '<token>'+
          '<username/>'+
          '<password/>'+
          '<nom>Jakjoud Abdeslam</nom>'+
          '<appId>FRZ48GAR4561FGD456T4E</appId>'+
          '<sessionId>'+sessionId+'</sessionId>'+
          '<status>SUCCES</status>'+
          '<id>206</id>'+
          '<beanId>0</beanId>'+
          '</token>'+
          '<expired></expired>'+
          '<unrecognized></unrecognized>'+
          '<status></status>'+
          '<operation>GET</operation>'+
          '<clauses>'+
			'<fr.protogen.connector.model.SearchClause>'+
				'<field>'+field+'</field>'+
				'<clause></clause>'+
				'<gt>'+gt+'</gt>'+
				'<lt>'+lt+'</lt>'+
				'<type>TEXT</type>'+
			'</fr.protogen.connector.model.SearchClause>'+
          '</clauses>'+
          '<page>1</page>'+
          '<pages>5</pages>'+
          '<nbpages>0</nbpages>'+
          '<iddriver>0</iddriver>'+
          '<ignoreList></ignoreList>'+
          '</fr.protogen.connector.model.DataModel>';

        // ENVOI AU SERVEUR
        return $http({
          method: 'POST',
          url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
          headers: {
            "Content-Type": "text/xml"
          },
          data: sopMessage
        });
      }
    })

  .service('PersistInServer', function ($http){
    this.persistInSalarie=function(
		nom, prenom, cin, description, lambert, ville, zipCode, num, adress1, adress2,
		civilite, birthDate, numSS, nationalite, phone, email, password, sessionID){

      soapMessage=
		'<fr.protogen.connector.model.DataModel>'+
			'<entity>user_employeur</entity>'+
			'<dataMap/>'+
			'<rows>'+
    			'<fr.protogen.connector.model.DataRow>'+
					'<dataRow>'+
						'<fr.protogen.connector.model.DataEntry>'+	// ID Salarié
							'<label>&lt;![CDATA[ID Salarié]]&gt;</label>'+
          					'<attributeReference>pk_user_salarie</attributeReference>'+
          					'<type>PK</type>'+
          					'<value>&lt;![CDATA[]]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Nom
          					'<label>&lt;![CDATA[Nom]]&gt;</label>'+
          					'<attributeReference>nom</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+nom+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Prénom
          					'<label>&lt;![CDATA[Prénom]]&gt;</label>'+
          					'<attributeReference>prenom</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+prenom+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// CIN
          					'<label>&lt;![CDATA[CIN]]&gt;</label>'+
          					'<attributeReference>cin</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+cin+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Description profil
          					'<label>&lt;![CDATA[Description profil]]&gt;</label>'+
          					'<attributeReference>description_profil</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+description+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Coordonnées Lambert
          					'<label>&lt;![CDATA[Coordonnées Lambert]]&gt;</label>'+
          					'<attributeReference>coordonnees_lambert</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+lambert+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Ville
          					'<label>&lt;![CDATA[Ville]]&gt;</label>'+
          					'<attributeReference>fk_user_ville</attributeReference>'+
          					'<type>fk_user_ville</type>'+
							'<list/>'+
          					'<value>&lt;![CDATA['+ville+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Code postal
          					'<label>&lt;![CDATA[Code postal]]&gt;</label>'+
          					'<attributeReference>fk_user_code_postal</attributeReference>'+
          					'<type>fk_user_code_postal</type>'+
          					'<list/>'+
          					'<value>&lt;![CDATA['+zipCode+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Numéro de la rue
						'<label>&lt;![CDATA[Num]]&gt;</label>'+
						'<attributeReference>num</attributeReference>'+
						'<type>TEXT</type>'+
						'<value>&lt;![CDATA['+num+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Rue
          					'<label>&lt;![CDATA[Rue]]&gt;</label>'+
          					'<attributeReference>rue</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+adress1+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Complément d'adresse.
          					'<label>&lt;![CDATA[Complément]]&gt;</label>'+
          					'<attributeReference>complement</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+adress2+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Civilité
          					'<label>&lt;![CDATA[Civilité]]&gt;</label>'+
          					'<attributeReference>fk_user_civilite</attributeReference>'+
          					'<type>fk_user_civilite</type>'+
          					'<list/>'+
          					'<value>&lt;![CDATA['+civilite+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Date de naissance
          					'<label>&lt;![CDATA[Date de naissance]]&gt;</label>'+
          					'<attributeReference>date_de_naissance</attributeReference>'+
          					'<type>DATE</type>'+
          					'<value>&lt;![CDATA['+birthDate+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Numéro SS
          					'<label>&lt;![CDATA[Numéro SS]]&gt;</label>'+
          					'<attributeReference>numero_ss</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+numSS+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Nationalité
          					'<label>&lt;![CDATA[Nationalité]]&gt;</label>'+
          					'<attributeReference>fk_user_nationalite</attributeReference>'+
          					'<type>fk_user_nationalite</type>'+
          					'<list/>'+
          					'<value>&lt;![CDATA['+nationalite+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Téléphone
          					'<label>&lt;![CDATA[Téléphone]]&gt;</label>'+
          					'<attributeReference>telephone</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+phone+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Email
          					'<label>&lt;![CDATA[Email]]&gt;</label>'+
          					'<attributeReference>email</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+email+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Mot de passe
          					'<label>&lt;![CDATA[Mot de passe]]&gt;</label>'+
          					'<attributeReference>mot_de_passe</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+password+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
					'</dataRow>'+
    			'</fr.protogen.connector.model.DataRow>'+
  			'</rows>'+
			'<token>'+
				'<username></username>'+
				'<password></password>'+
				'<nom>Jakjoud Abdeslam</nom>'+
				'<appId>FRZ48GAR4561FGD456T4E</appId>'+
				'<sessionId>'+sessionID+'</sessionId>'+
				'<status>SUCCES</status>'+
				'<id>206</id>'+
				'<beanId>0</beanId>'+
			'</token>'+
			'<expired></expired>'+
			'<unrecognized></unrecognized>'+
			'<status></status>'+
			'<operation>PUT</operation>'+		// INSERTION IN BD
			'<clauses/>'+
			'<page>1</page>'+
			'<pages>0</pages>'+
			'<nbpages>0</nbpages>'+
			'<iddriver>0</iddriver>'+
			'<ignoreList></ignoreList>'+
		'</fr.protogen.connector.model.DataModel>';


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };

	this.persistInEmployeur=function(
			nom, prenom, ville, zipCode, civilite, num, adress1, adress2, phone,
			email, password, raisonSocial, siret, codeAPE, numUrssaf, cni_ou_rc, sessionID){

      soapMessage=
		'<fr.protogen.connector.model.DataModel>'+
			'<entity>user_employeur</entity>'+
			'<dataMap/>'+
			'<rows>'+
    			'<fr.protogen.connector.model.DataRow>'+
					'<dataRow>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Nom ou raison sociale
          					'<label>&lt;![CDATA[Nom ou raison sociale]]&gt;</label>'+
          					'<attributeReference>nom_ou_raison_sociale</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+raisonSocial+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Identifiant fiscal
          					'<label>&lt;![CDATA[Identifiant fiscal]]&gt;</label>'+
          					'<attributeReference>identifiant_fiscal</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA[]]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// CNI ou RC
          					'<label>&lt;![CDATA[CNI ou RC]]&gt;</label>'+
          					'<attributeReference>cni_ou_rc</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+cni_ou_rc+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Ville
          					'<label>&lt;![CDATA[Ville]]&gt;</label>'+
          					'<attributeReference>fk_user_ville</attributeReference>'+
          					'<type>fk_user_ville</type>'+
          					'<list/>'+
          					'<value>&lt;![CDATA['+ville+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Code postal
          					'<label>&lt;![CDATA[Code postal]]&gt;</label>'+
          					'<attributeReference>fk_user_code_postal</attributeReference>'+
          					'<type>fk_user_code_postal</type>'+
          					'<list/>'+
          					'<value>&lt;![CDATA['+zipCode+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+	// Numéro
						'<label>&lt;![CDATA[Num]]&gt;</label>'+
						'<attributeReference>num</attributeReference>'+
						'<type>TEXT</type>'+
						'<value>&lt;![CDATA['+num+']]&gt;</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Rue
          					'<label>&lt;![CDATA[Rue]]&gt;</label>'+
          					'<attributeReference>rue</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+adress1+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Complément
          					'<label>&lt;![CDATA[Complément]]&gt;</label>'+
          					'<attributeReference>complement</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+adress2+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Titre CIVILITE
          					'<label>&lt;![CDATA[Titre]]&gt;</label>'+
          					'<attributeReference>fk_user_civilite</attributeReference>'+
          					'<type>fk_user_civilite</type>'+
          					'<list/>'+
          					'<value>&lt;![CDATA['+civilite+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Nom du dirigeant
          					'<label>&lt;![CDATA[Nom du dirigeant]]&gt;</label>'+
          					'<attributeReference>nom_du_dirigeant</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+nom+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Prénom du dirigeant
          					'<label>&lt;![CDATA[Prénom du dirigeant]]&gt;</label>'+
          					'<attributeReference>prenom_du_dirigeant</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+prenom+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// SIRET
          					'<label>&lt;![CDATA[SIRET]]&gt;</label>'+
          					'<attributeReference>siret</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+siret+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Code APE
          					'<label>&lt;![CDATA[Code APE]]&gt;</label>'+
          					'<attributeReference>code_ape</attributeReference>'+
          					'<type>TEXT</type>'+
         					'<value>&lt;![CDATA['+codeAPE+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Numéro URSSAF
          					'<label>&lt;![CDATA[Numéro URSSAF]]&gt;</label>'+
          					'<attributeReference>numero_urssaf</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+numUrssaf+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Téléphone
          					'<label>&lt;![CDATA[Téléphone]]&gt;</label>'+
          					'<attributeReference>telephone</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+phone+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Email
          					'<label>&lt;![CDATA[Email]]&gt;</label>'+
          					'<attributeReference>email</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+email+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+	// Mot de passe
          					'<label>&lt;![CDATA[Mot de passe]]&gt;</label>'+
          					'<attributeReference>mot_de_passe</attributeReference>'+
          					'<type>TEXT</type>'+
          					'<value>&lt;![CDATA['+password+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
					'</dataRow>'+
    			'</fr.protogen.connector.model.DataRow>'+
  			'</rows>'+
			'<token>'+
			'<username></username>'+
			'<password></password>'+
			'<nom>Jakjoud Abdeslam</nom>'+
			'<appId>FRZ48GAR4561FGD456T4E</appId>'+
			'<sessionId>'+sessionID+'</sessionId>'+
			'<status>SUCCES</status>'+
			'<id>206</id>'+
			'<beanId>0</beanId>'+
			'</token>'+
			'<expired></expired>'+
			'<unrecognized></unrecognized>'+
			'<status></status>'+
			'<operation>PUT</operation>'+
			'<clauses>'+
			'<fr.protogen.connector.model.SearchClause>'+
			'<field></field>'+
			'<clause></clause>'+
			'<gt></gt>'+
			'<lt></lt>'+
			'<type>TEXT</type>'+
			'</fr.protogen.connector.model.SearchClause>'+
			'</clauses>'+
			'<page>1</page>'+
			'<pages>5</pages>'+
			'<nbpages>0</nbpages>'+
			'<iddriver>0</iddriver>'+
			'<ignoreList></ignoreList>'+
		'</fr.protogen.connector.model.DataModel>';


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
	};
    this.persistInDisponibilite=function(jourId, heure_debut, heure_fin, sessionID, offreId){
      soapMessage=
        '<fr.protogen.connector.model.DataModel>'+
        '<entity>user_disponibilite_offre_employeur</entity>'+
        '<dataMap/>'+
        '<rows>'+
        '<fr.protogen.connector.model.DataRow>'+
        '<dataRow>'+
        '<fr.protogen.connector.model.DataEntry>'+		// disponible_du
        '<label>&lt;![CDATA[heure_debut]]&gt;</label>'+
        ' <attributeReference>heure_debut</attributeReference>'+
        '<type>TEXT</type>'+
        '<value>'+heure_debut+'</value>'+
        '</fr.protogen.connector.model.DataEntry>'+
        '<fr.protogen.connector.model.DataEntry>'+		// disponible_du
        '<label>&lt;![CDATA[heure_fin]]&gt;</label>'+
        ' <attributeReference>heure_fin</attributeReference>'+
        '<type>TEXT</type>'+
        '<value>'+heure_fin+'</value>'+
        '</fr.protogen.connector.model.DataEntry>'+
          /*
        '<fr.protogen.connector.model.DataEntry>'+		//
        '<label>&lt;![CDATA[fk_user_disponibilite_offre_employeur_user_offre]]&gt;</label>'+
        ' <attributeReference>fk_user_disponibilite_offre_employeur_user_offre</attributeReference>'+
        '<type>TEXT</type>'+
        '<value>'+offreId+'</value>'+
        '</fr.protogen.connector.model.DataEntry>'+
        */
        '<fr.protogen.connector.model.DataEntry>'+
        '<label>&lt;![CDATA[JOUR DE SEMAINE]]&gt;</label>'+
        '<attributeReference>fk_user_jour_de_la_semaine</attributeReference>'+
        '<type>fk_user_jour_de_la_semaine</type>'+
        '<list/>'+
        '<value>'+jourId+'</value>'+
        '</fr.protogen.connector.model.DataEntry>'+
        '</dataRow>'+
        '</fr.protogen.connector.model.DataRow>'+
        '</rows>'+
        '<token>'+
        '<username></username>'+
        '<password></password>'+
        '<nom>Jakjoud Abdeslam</nom>'+
        '<appId>FRZ48GAR4561FGD456T4E</appId>'+
        '<sessionId>'+sessionID+'</sessionId>'+
        '<status>SUCCES</status>'+
        '<id>206</id>'+
        '<beanId>0</beanId>'+
        '</token>'+
        '<expired></expired>'+
        '<unrecognized></unrecognized>'+
        '<status></status>'+
        '<operation>PUT</operation>'+
        '<clauses/>'+
        '<page>1</page>'+
        '<pages>5</pages>'+
        '<nbpages>0</nbpages>'+
        '<iddriver>0</iddriver>'+
        '<ignoreList></ignoreList>'+
        '</fr.protogen.connector.model.DataModel>';


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };

	this.persistInOffres=function(identifiant, titre, description, disponible_du, disponible_au, sessionID, employeurID, niveauID){

      soapMessage=
		'<fr.protogen.connector.model.DataModel>'+
			'<entity>user_offre</entity>'+
			'<dataMap/>'+
			'<rows>'+
    			'<fr.protogen.connector.model.DataRow>'+
					'<dataRow>'+
        				'<fr.protogen.connector.model.DataEntry>'+		// IDENTIFIANT
							'<label>&lt;![CDATA[Identifiant]]&gt;</label>'+
							'<attributeReference>identifiant</attributeReference>'+
							'<type>DOUBLE</type>'+
							'<value>'+identifiant+'</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+		// titre
							'<label>&lt;![CDATA[Titre]]&gt;</label>'+
							'<attributeReference>titre</attributeReference>'+
							'<type>TEXT</type>'+
							'<value>&lt;![CDATA['+titre+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+		// description
							'<label>&lt;![CDATA[Description]]&gt;</label>'+
							'<attributeReference>description</attributeReference>'+
							'<type>TEXT</type>'+
							'<value>&lt;![CDATA['+description+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+		// disponible_du
          					'<label>&lt;![CDATA[Disponible du]]&gt;</label>'+
         					' <attributeReference>disponible_du</attributeReference>'+
          					'<type>DATE</type>'+
          					'<value>&lt;![CDATA['+disponible_du+']&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+		// disponible_au
          					'<label>&lt;![CDATA[Disponible au]]&gt;</label>'+
          					'<attributeReference>disponible_au</attributeReference>'+
          					'<type>DATE</type>'+
          					'<value>&lt;![CDATA['+disponible_au+']]&gt;</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+		// ID EMPLOYEUR
						'<fr.protogen.connector.model.DataEntry>'+
							'<label>&lt;![CDATA[Employeur]]&gt;</label>'+
							'<attributeReference>fk_user_employeur</attributeReference>'+
							'<type>fk_user_employeur</type>'+
							'<list/>'+
							'<value>'+employeurID+'</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+
							'<label>&lt;![CDATA[Niveau de maitrise]]&gt;</label>'+
          					'<attributeReference>fk_user_niveau_de_maitrise</attributeReference>'+
          					'<type>fk_user_niveau_de_maitrise</type>'+
          					'<list/>'+
          					'<value>'+niveauID+'</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
					'</dataRow>'+
    			'</fr.protogen.connector.model.DataRow>'+
  			'</rows>'+
			'<token>'+
				'<username></username>'+
				'<password></password>'+
				'<nom>Jakjoud Abdeslam</nom>'+
				'<appId>FRZ48GAR4561FGD456T4E</appId>'+
				'<sessionId>'+sessionID+'</sessionId>'+
				'<status>SUCCES</status>'+
				'<id>206</id>'+
				'<beanId>0</beanId>'+
			'</token>'+
			'<expired></expired>'+
			'<unrecognized></unrecognized>'+
			'<status></status>'+
			'<operation>PUT</operation>'+
			'<clauses/>'+
			'<page>1</page>'+
			'<pages>5</pages>'+
			'<nbpages>0</nbpages>'+
			'<iddriver>0</iddriver>'+
			'<ignoreList></ignoreList>'+
		'</fr.protogen.connector.model.DataModel>';


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };

	this.persistInOffres_Competences=function(sessionID, competenceID, offreID){

      soapMessage=
		'<fr.protogen.connector.model.DataModel>'+
			'<entity>user_competence_offre</entity>'+
			'<dataMap/>'+
			'<rows>'+
    			'<fr.protogen.connector.model.DataRow>'+
					'<dataRow>'+
						'<fr.protogen.connector.model.DataEntry>'+
							'<label>&lt;![CDATA[Offre]]&gt;</label>'+
							'<attributeReference>fk_user_offre</attributeReference>'+
							'<type>fk_user_offre</type>'+
							'<list/>'+
							'<value>'+offreID+'</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
						'<fr.protogen.connector.model.DataEntry>'+
							'<label>&lt;![CDATA[Compétence]]&gt;</label>'+
							'<attributeReference>fk_user_competence</attributeReference>'+
							'<type>fk_user_competence</type>'+
							'<list/>'+
							'<value>'+competenceID+'</value>'+
						'</fr.protogen.connector.model.DataEntry>'+
					'</dataRow>'+
    			'</fr.protogen.connector.model.DataRow>'+
  			'</rows>'+
			'<token>'+
				'<username></username>'+
				'<password></password>'+
				'<nom>Jakjoud Abdeslam</nom>'+
				'<appId>FRZ48GAR4561FGD456T4E</appId>'+
				'<sessionId>'+sessionID+'</sessionId>'+
				'<status>SUCCES</status>'+
				'<id>206</id>'+
				'<beanId>0</beanId>'+
			'</token>'+
			'<expired></expired>'+
			'<unrecognized></unrecognized>'+
			'<status></status>'+
			'<operation>PUT</operation>'+
			'<clauses/>'+
			'<page>1</page>'+
			'<pages>5</pages>'+
			'<nbpages>0</nbpages>'+
			'<iddriver>0</iddriver>'+
			'<ignoreList></ignoreList>'+
		'</fr.protogen.connector.model.DataModel>';


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };

	this.persistInOffres_Transvers=function(sessionID, transversID, offreID){

      soapMessage=
		'<fr.protogen.connector.model.DataModel>'+
			'<entity>user_competence_transverse_offre</entity>'+
			'<dataMap/>'+
			'<rows>'+
    			'<fr.protogen.connector.model.DataRow>'+
					'<dataRow>'+
        				'<fr.protogen.connector.model.DataEntry>'+
							'<label>&lt;![CDATA[Offre]]&gt;</label>'+
							'<attributeReference>fk_user_offre</attributeReference>'+
							'<type>fk_user_offre</type>'+
							'<list/>'+
							'<value>'+offreID+'</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+
							'<label>&lt;![CDATA[Compétence transverse]]&gt;</label>'+
							'<attributeReference>fk_user_competence_transverse</attributeReference>'+
							'<type>fk_user_competence_transverse</type>'+
							'<list/>'+
							'<value>'+transversID+'</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
					'</dataRow>'+
    			'</fr.protogen.connector.model.DataRow>'+
  			'</rows>'+
			'<token>'+
				'<username></username>'+
				'<password></password>'+
				'<nom>Jakjoud Abdeslam</nom>'+
				'<appId>FRZ48GAR4561FGD456T4E</appId>'+
				'<sessionId>'+sessionID+'</sessionId>'+
				'<status>SUCCES</status>'+
				'<id>206</id>'+
				'<beanId>0</beanId>'+
			'</token>'+
			'<expired></expired>'+
			'<unrecognized></unrecognized>'+
			'<status></status>'+
			'<operation>PUT</operation>'+
			'<clauses/>'+
			'<page>1</page>'+
			'<pages>5</pages>'+
			'<nbpages>0</nbpages>'+
			'<iddriver>0</iddriver>'+
			'<ignoreList></ignoreList>'+
		'</fr.protogen.connector.model.DataModel>';


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };

	this.persistInOffres_Langues=function(sessionID, langueID, offreID){

      soapMessage=
		'<fr.protogen.connector.model.DataModel>'+
			'<entity>user_maitrise_langue_offre</entity>'+
			'<dataMap/>'+
			'<rows>'+
    			'<fr.protogen.connector.model.DataRow>'+
					'<dataRow>'+
        				'<fr.protogen.connector.model.DataEntry>'+
							'<label>&lt;![CDATA[Offre]]&gt;</label>'+
							'<attributeReference>fk_user_offre</attributeReference>'+
							'<type>fk_user_offre</type>'+
							'<list/>'+
							'<value>'+offreID+'</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
        				'<fr.protogen.connector.model.DataEntry>'+
							'<label>&lt;![CDATA[Langue]]&gt;</label>'+
							'<attributeReference>fk_user_langue</attributeReference>'+
							'<type>fk_user_langue</type>'+
							'<list/>'+
							'<value>'+langueID+'</value>'+
        				'</fr.protogen.connector.model.DataEntry>'+
					'</dataRow>'+
    			'</fr.protogen.connector.model.DataRow>'+
  			'</rows>'+
			'<token>'+
				'<username></username>'+
				'<password></password>'+
				'<nom>Jakjoud Abdeslam</nom>'+
				'<appId>FRZ48GAR4561FGD456T4E</appId>'+
				'<sessionId>'+sessionID+'</sessionId>'+
				'<status>SUCCES</status>'+
				'<id>206</id>'+
				'<beanId>0</beanId>'+
			'</token>'+
			'<expired></expired>'+
			'<unrecognized></unrecognized>'+
			'<status></status>'+
			'<operation>PUT</operation>'+
			'<clauses/>'+
			'<page>1</page>'+
			'<pages>5</pages>'+
			'<nbpages>0</nbpages>'+
			'<iddriver>0</iddriver>'+
			'<ignoreList></ignoreList>'+
		'</fr.protogen.connector.model.DataModel>';


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };


    this.persistInOffres_Niveaux_Langue=function(sessionID, langueID, offreID){

      soapMessage=
		'<fr.protogen.connector.model.DataModel>'+
			'<entity>user_maitrise_langue_offre</entity>'+
			'<dataMap/>'+
			'<rows>'+
    			'<fr.protogen.connector.model.DataRow>'+
					'<dataRow>'+
            '<fr.protogen.connector.model.DataEntry>'+
              '<label>&lt;![CDATA[LANGUE]]&gt;</label>'+
              '<attributeReference>fk_user_langue</attributeReference>'+
              '<type>fk_user_langue</type>'+
              '<list/>'+
              '<value>'+langueID+'</value>'+
              '</fr.protogen.connector.model.DataEntry>'+
              '<fr.protogen.connector.model.DataEntry>'+
              '<label>&lt;![CDATA[OFFRE]]&gt;</label>'+
              '<attributeReference>fk_user_offre</attributeReference>'+
              '<type>fk_user_offre</type>'+
              '<list/>'+
              '<value>'+offreID+'</value>'+
            '</fr.protogen.connector.model.DataEntry>'+
					'</dataRow>'+
    			'</fr.protogen.connector.model.DataRow>'+
  			'</rows>'+
			'<token>'+
				'<username></username>'+
				'<password></password>'+
				'<nom>Jakjoud Abdeslam</nom>'+
				'<appId>FRZ48GAR4561FGD456T4E</appId>'+
				'<sessionId>'+sessionID+'</sessionId>'+
				'<status>SUCCES</status>'+
				'<id>206</id>'+
				'<beanId>0</beanId>'+
			'</token>'+
			'<expired></expired>'+
			'<unrecognized></unrecognized>'+
			'<status></status>'+
			'<operation>PUT</operation>'+
			'<clauses/>'+
			'<page>1</page>'+
			'<pages>5</pages>'+
			'<nbpages>0</nbpages>'+
			'<iddriver>0</iddriver>'+
			'<ignoreList></ignoreList>'+
		'</fr.protogen.connector.model.DataModel>';


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
        headers: {
          "Content-Type": "text/xml"
        },
        data: soapMessage
      });
    };
  })

  .service('UpdateInServer', function ($http){
	this.updateCiviliteInEmployeur = function(user, civilite, nom, prenom, raisonSocial, siret, codeAPE, numUrssaf, sessionID, employerId, enterpriseId){
      var sql = "update user_employeur set ";
      sql = sql+" titre='"+civilite+"', ";
      sql = sql + " nom='"+nom+"', prenom='"+prenom+"' where pk_user_employeur="+employerId+";";
      sql = sql + " update user_entreprise set nom_ou_raison_sociale='"+raisonSocial+"', ";
      sql = sql + "siret='"+siret+"', ";
      sql = sql + "urssaf='"+numUrssaf+"', ";
      sql = sql + "ape_ou_naf='"+codeAPE+"' where  pk_user_entreprise="+enterpriseId;


      return $http({
        method: 'POST',
        url: 'http://ns389914.ovh.net:8080/vitonjobv1/api/sql',
        headers: {
          "Content-Type": "text/plain"
        },
        data: sql
      });
    };

	this.updateAdressePersEmployeur=function(entrepriseId, adresse){
		//  I will start by formating the adress
    //  Street adress
    var streetIndex = adresse.indexOf("street-address");
    var street = ''; 
    if(streetIndex >0){
      streetIndex = streetIndex+16;
      var sub = adresse.substring(streetIndex, adresse.length-1);
      var endStreetIndex = sub.indexOf('</');
      street = sub.substring(0,endStreetIndex);
    }

    //  Code postal
    var cpIndex = adresse.indexOf("postal-code");
    var cp = '';
    if(cpIndex>0){
      cpIndex = cpIndex+13;
      var subcp= adresse.substring(cpIndex, adresse.length-1);
      var endCpIndex = subcp.indexOf('</');
      cp = subcp.substring(0,endCpIndex);
    }

    //  Ville
    var villeIndex = adresse.indexOf("locality");
    var ville = '';
    if(villeIndex>0){
      villeIndex = villeIndex+10;
      var subville= adresse.substring(villeIndex, adresse.length-1);
      var endvilleIndex = subville.indexOf('</');
      ville = subville.substring(0,endvilleIndex);
    }

    //  Pays
    var paysIndex = adresse.indexOf("country-name");
    var pays = '';
    if(paysIndex>0){
      paysIndex = paysIndex+14;
      var subpays= adresse.substring(paysIndex, adresse.length-1);
      var endpaysIndex = subpays.indexOf('</');
      pays = subpays.substring(0,endpaysIndex);
    }

    //  Now we need to save the adresse
    var adresseData = {
      'class' :  'com.vitonjob.localisation.AdressToken',
      'street':  street,
      'cp': cp,
      'ville': ville,
      'pays': pays,
      'role':'employeur',
      'id': entrepriseId,
      'type': 'personnelle'
    };

    adresseData = JSON.stringify(adresseData);

    var encodedAdresse = btoa(adresseData);

    var data = {
      'class' : 'fr.protogen.masterdata.model.CCallout',
      'id' : 29,
      'args' : [{
          'class' : 'fr.protogen.masterdata.model.CCalloutArguments',
          label : 'Adresse',
          value : encodedAdresse
        }]
    };

    var stringData = JSON.stringify(data);

    var request = {
      method : 'POST',
      url : 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
      headers : {
      'Content-Type' : 'application/json'
      },
      data : stringData
    };

    return $http(request);
  };

	this.updateAdresseTravEmployeur=function(entrepriseId, adresse){
		//  I will start by formating the adress
    //  Street adress
    var streetIndex = adresse.indexOf("street-address");
    var street = ''; 
    if(streetIndex >0){
      streetIndex = streetIndex+16;
      var sub = adresse.substring(streetIndex, adresse.length-1);
      var endStreetIndex = sub.indexOf('</');
      street = sub.substring(0,endStreetIndex);
    }

    //  Code postal
    var cpIndex = adresse.indexOf("postal-code");
    var cp = '';
    if(cpIndex>0){
      cpIndex = cpIndex+13;
      var subcp= adresse.substring(cpIndex, adresse.length-1);
      var endCpIndex = subcp.indexOf('</');
      cp = subcp.substring(0,endCpIndex);
    }

    //  Ville
    var villeIndex = adresse.indexOf("locality");
    var ville = '';
    if(villeIndex>0){
      villeIndex = villeIndex+10;
      var subville= adresse.substring(villeIndex, adresse.length-1);
      var endvilleIndex = subville.indexOf('</');
      ville = subville.substring(0,endvilleIndex);
    }

    //  Pays
    var paysIndex = adresse.indexOf("country-name");
    var pays = '';
    if(paysIndex>0){
      paysIndex = paysIndex+14;
      var subpays= adresse.substring(paysIndex, adresse.length-1);
      var endpaysIndex = subpays.indexOf('</');
      pays = subpays.substring(0,endpaysIndex);
    }

    //  Now we need to save the adresse
    var adresseData = {
      'class' :  'com.vitonjob.localisation.AdressToken',
      'street':  street,
      'cp': cp,
      'ville': ville,
      'pays': pays,
      'role':'employeur',
      'id': entrepriseId,
      'type': 'travaille'
    };

    adresseData = JSON.stringify(adresseData);

    var encodedAdresse = btoa(adresseData);

    var data = {
      'class' : 'fr.protogen.masterdata.model.CCallout',
      'id' : 29,
      'args' : [{
          'class' : 'fr.protogen.masterdata.model.CCalloutArguments',
          label : 'Adresse',
          value : encodedAdresse
        }]
    };

    var stringData = JSON.stringify(data);

    var request = {
      method : 'POST',
      url : 'http://ns389914.ovh.net:8080/vitonjobv1/api/callout',
      headers : {
      'Content-Type' : 'application/json'
      },
      data : stringData
    };

    return $http(request);

  };
})
  .service('LoadList', function ($http){
	  this.loadList = function(table, sessionID){
		  soapMessage=
			'<fr.protogen.connector.model.DataModel>'+
				'<entity>'+table+'</entity>'+
				'<dataMap/>'+
				'<rows/>'+
				'<token>'+
					'<username></username>'+
					'<password></password>'+
					'<nom>Jakjoud Abdeslam</nom>'+
					'<appId>FRZ48GAR4561FGD456T4E</appId>'+
					'<sessionId>'+sessionID+'</sessionId>'+
					'<status>SUCCES</status>'+
					'<id>206</id>'+
					'<beanId>0</beanId>'+
				'</token>'+
				'<expired></expired>'+
				'<unrecognized></unrecognized>'+
				'<status></status>'+
				'<operation>GET</operation>'+
				'<clauses/>'+
				'<page>0</page>'+	// PAGE D'INTERROGATION
				'<pages>0</pages>'+ // NB DE LIGNES
				'<nbpages>0</nbpages>'+
				'<iddriver>0</iddriver>'+
				'<ignoreList></ignoreList>'+
			'</fr.protogen.connector.model.DataModel>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  };

	  this.loadListMetiers = function(sessionID){
		  soapMessage=
			'<fr.protogen.connector.model.DataModel>'+
				'<entity>user_metier</entity>'+
				'<dataMap/>'+
				'<rows/>'+
				'<token>'+
					'<username></username>'+
					'<password></password>'+
					'<nom>Jakjoud Abdeslam</nom>'+
					'<appId>FRZ48GAR4561FGD456T4E</appId>'+
					'<sessionId>'+sessionID+'</sessionId>'+
					'<status>SUCCES</status>'+
					'<id>206</id>'+
					'<beanId>0</beanId>'+
				'</token>'+
				'<expired></expired>'+
				'<unrecognized></unrecognized>'+
				'<status></status>'+
				'<operation>GET</operation>'+
				'<clauses/>'+
				'<page>0</page>'+
				'<pages>0</pages>'+
				'<nbpages>0</nbpages>'+
				'<iddriver>0</iddriver>'+
				'<ignoreList></ignoreList>'+
			'</fr.protogen.connector.model.DataModel>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  };

	 this.loadListLangues = function(sessionID){
		  soapMessage=
			'<fr.protogen.connector.model.DataModel>'+
				'<entity>user_maitrise_langue_offre</entity>'+
				'<dataMap/>'+
				'<rows/>'+
				'<token>'+
					'<username></username>'+
					'<password></password>'+
					'<nom>Jakjoud Abdeslam</nom>'+
					'<appId>FRZ48GAR4561FGD456T4E</appId>'+
					'<sessionId>'+sessionID+'</sessionId>'+
					'<status>SUCCES</status>'+
					'<id>206</id>'+
					'<beanId>0</beanId>'+
				'</token>'+
				'<expired></expired>'+
				'<unrecognized></unrecognized>'+
				'<status></status>'+
				'<operation>GET</operation>'+
				'<clauses/>'+
				'<page>1</page>'+
				'<pages>0</pages>'+
				'<nbpages>0</nbpages>'+
				'<iddriver>0</iddriver>'+
				'<ignoreList></ignoreList>'+
			'</fr.protogen.connector.model.DataModel>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  };

	  this.loadListJobs = function(sessionID){
		soapMessage=
			'<fr.protogen.connector.model.DataModel>'+
				'<entity>user_competence</entity>'+
				'<dataMap/>'+
				'<rows/>'+
				'<token>'+
					'<username></username>'+
					'<password></password>'+
					'<nom>Jakjoud Abdeslam</nom>'+
					'<appId>FRZ48GAR4561FGD456T4E</appId>'+
					'<sessionId>'+sessionID+'</sessionId>'+
					'<status>SUCCES</status>'+
					'<id>206</id>'+
					'<beanId>0</beanId>'+
				'</token>'+
				'<expired></expired>'+
				'<unrecognized></unrecognized>'+
				'<status></status>'+
				'<operation>GET</operation>'+
				'<clauses/>'+
				'<page>0</page>'+
				'<pages>0/pages>'+
				'<nbpages>0</nbpages>'+
				'<iddriver>0</iddriver>'+
				'<ignoreList></ignoreList>'+
			'</fr.protogen.connector.model.DataModel>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  };

	 this.loadListIndespensables = function(sessionID){
		soapMessage=
			'<fr.protogen.connector.model.DataModel>'+
				'<entity>user_competence_transverse</entity>'+
				'<dataMap/>'+
				'<rows/>'+
				'<token>'+
					'<username></username>'+
					'<password></password>'+
					'<nom>Jakjoud Abdeslam</nom>'+
					'<appId>FRZ48GAR4561FGD456T4E</appId>'+
					'<sessionId>'+sessionID+'</sessionId>'+
					'<status>SUCCES</status>'+
					'<id>206</id>'+
					'<beanId>0</beanId>'+
				'</token>'+
				'<expired></expired>'+
				'<unrecognized></unrecognized>'+
				'<status></status>'+
				'<operation>GET</operation>'+
				'<clauses/>'+
				'<page>0</page>'+
				'<pages>0</pages>'+
				'<nbpages>0</nbpages>'+
				'<iddriver>0</iddriver>'+
				'<ignoreList></ignoreList>'+
			'</fr.protogen.connector.model.DataModel>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  };

	  this.loadListVilles = function(sessionID){
		soapMessage=
			'<fr.protogen.connector.model.DataModel>'+
				'<entity>user_nationalite</entity>'+
				'<dataMap/>'+
				'<rows/>'+
				'<token>'+
					'<username></username>'+
					'<password></password>'+
					'<nom>Jakjoud Abdeslam</nom>'+
					'<appId>FRZ48GAR4561FGD456T4E</appId>'+
					'<sessionId>'+sessionID+'</sessionId>'+
					'<status>SUCCES</status>'+
					'<id>206</id>'+
					'<beanId>0</beanId>'+
				'</token>'+
				'<expired></expired>'+
				'<unrecognized></unrecognized>'+
				'<status></status>'+
				'<operation>GET</operation>'+
				'<clauses/>'+
				'<page>1</page>'+
				'<pages>0</pages>'+
				'<nbpages>0</nbpages>'+
				'<iddriver>0</iddriver>'+
				'<ignoreList></ignoreList>'+
			'</fr.protogen.connector.model.DataModel>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  };

	  this.loadZipCodes = function(sessionID){
		soapMessage=
			'<fr.protogen.connector.model.DataModel>'+
				'<entity>user_code_postal</entity>'+
				'<dataMap/>'+
				'<rows/>'+
				'<token>'+
					'<username></username>'+
					'<password></password>'+
					'<nom>Jakjoud Abdeslam</nom>'+
					'<appId>FRZ48GAR4561FGD456T4E</appId>'+
					'<sessionId>'+sessionID+'</sessionId>'+
					'<status>SUCCES</status>'+
					'<id>206</id>'+
					'<beanId>0</beanId>'+
				'</token>'+
				'<expired></expired>'+
				'<unrecognized></unrecognized>'+
				'<status></status>'+
				'<operation>GET</operation>'+
				'<clauses/>'+
				'<page>0</page>'+
				'<pages>0</pages>'+
				'<nbpages>0</nbpages>'+
				'<iddriver>0</iddriver>'+
				'<ignoreList></ignoreList>'+
			'</fr.protogen.connector.model.DataModel>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  };

	  this.loadListCivilites = function(sessionID){
		soapMessage=
			'<fr.protogen.connector.model.DataModel>'+
				'<entity>user_civilite</entity>'+
				'<dataMap/>'+
				'<rows/>'+
				'<token>'+
					'<username></username>'+
					'<password></password>'+
					'<nom>Jakjoud Abdeslam</nom>'+
					'<appId>FRZ48GAR4561FGD456T4E</appId>'+
					'<sessionId>'+sessionID+'</sessionId>'+
					'<status>SUCCES</status>'+
					'<id>206</id>'+
					'<beanId>0</beanId>'+
				'</token>'+
				'<expired></expired>'+
				'<unrecognized></unrecognized>'+
				'<status></status>'+
				'<operation>GET</operation>'+
				'<clauses/>'+
				'<page>0</page>'+
				'<pages>0</pages>'+
				'<nbpages>0</nbpages>'+
				'<iddriver>0</iddriver>'+
				'<ignoreList></ignoreList>'+
			'</fr.protogen.connector.model.DataModel>';

		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/vit1job/api/das',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  };
	})

  .service('GlobalService', function(){
	  //this.employeId=0;
	  var employeId = window.employeId;

	  return {
		  getEmployeId: function(){
			  return employeId;
		  },
		  setEmployeId: function(id){
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

  .factory('LocalStorageService', function(){

	  return{
		  setItem: function(key, obj){
			  var objToString = JSON.stringify(obj);
			  window.localStorage.setItem(key, objToString);
		  },
		  getItem: function(key){
			  var str = window.localStorage.getItem(key);
			  var stringToJSON = JSON.parse(str);
			  return stringToJSON;
		 }
	  }
	})
