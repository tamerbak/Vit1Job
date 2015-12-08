/**
 * Created by Tamer on 14/10/2015.
 */
'use strict';
var requestToken = "";
var accessToken = "";
var clientId = "715296704477-gt8soaf11ftbncgbadj59pvjbq2fv7f0.apps.googleusercontent.com";
var clientSecret = "x14txRHh2arUKVfNS7eZ8I-v";

starter
		.controller('connectCtrl', function($scope, $cookieStore, $state, ngFB, Global, $cordovaOauth, $http, formatString, AuthentificatInServer, x2js, LoadList ) {

					// FORMULAIRE
					$scope.formData = {};

					// PROPRE AU GMAIL
					$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

					$scope.fbLogin = function(){

						Global.showAlertValidation("En cours de construction.");
						return;


						ngFB.login({
							scope : 'email'
						}).then(function(response) {
							if (response.status === 'connected') {
								console.log('Facebook login succeeded');
								$state.go('profile');
							} else {
								alert('Facebook login failed');
							}
						});
					};

					$scope.showAlert = function(){
						Global.showAlert();
					};

			$scope.linkedinLogin = function(){
				Global.showAlertValidation("En cours de construction.");
			};



					$scope.loginGmail = function(){

						Global.showAlertValidation("En cours de construction.");
						return;
						var ref = window
								.open(
										'https://accounts.google.com/o/oauth2/auth?client_id='
												+ clientId
												+ '&redirect_uri=http://localhost&scope=https://www.googleapis.com/auth/urlshortener&approval_prompt=force&response_type=code&access_type=offline',
										'_blank', 'location=no');
						ref
								.addEventListener(
										'loadstart',
										function(event) {
											if ((event.url)
													.startsWith("http://localhost/callback")) {
												requestToken = (event.url)
														.split("code=")[1];
												$http(
														{
															method : "post",
															url : "https://accounts.google.com/o/oauth2/token",
															data : "client_id="
																	+ clientId
																	+ "&client_secret="
																	+ clientSecret
																	+ "&redirect_uri=http://localhost"
																	+ "&grant_type=authorization_code"
																	+ "&code="
																	+ requestToken
														})
														.success(
																function(data) {
																	accessToken = data.access_token;
																	console
																			.log("accessToken : "
																					+ accessToken);
																	console
																			.log('Gmail login succeeded');
																	$state
																			.go('profile');
																})
														.error(
																function(data,
																		status) {
																	alert("ERROR: "
																			+ data);
																});
												ref.close();
											}
										});
					};

					$scope.digitalOceanLogin = function() {
						$cordovaOauth.digitalOcean("CLIENT_ID_HERE",
								"CLIENT_SECRET_HERE").then(
								function(result) {
									window.localStorage.setItem("access_token",
											result.access_token);
								}, function(error) {
									console.log(error);
								});
					};

					$scope.getDroplets = function() {
						$http.defaults.headers.common.Authorization = "Bearer "
								+ window.localStorage.getItem("access_token");
						$http.get("https://api.digitalocean.com/v2/droplets")
								.success(function(data) {
									console.log(JSON.stringify(data.droplets));
								}).error(function(error) {
									console.log(error);
								});
					};

					$scope.loadAllVilles = function(){

						sessionId=$cookieStore.get('sessionID');
						//if(!sessionId){
							// CONNEXION AU SERVEUR
							AuthentificatInServer.getSessionId()
								.success(function (response){

									var jsonResp = x2js.xml_str2json(response);
          							var jsonText = JSON.stringify (jsonResp);
          							jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
          							jsonResp = JSON.parse(jsonText);

									// PUT SESSION ID
									sessionId = jsonResp.amanToken.sessionId;
									console.log("New sessionId : "+sessionId);
									$cookieStore.put('sessionID', sessionId);

									/*** LOAD LIST VILLES ***/
									var villes=$cookieStore.get('villes');
									//if(!villes){
										LoadList.loadList("user_offre", sessionId)
											.success(function(response){
														console.log("response "+response);
														var resp = formatString.formatServerResult(response);
														// DONNEES ONT ETE CHARGES
														console.log("les villes ont été bien chargé");
														var villeObjects = resp.dataModel.rows.dataRow;

														// GET VILLES
														villes = [];
														var ville = {}; // ville.libelle | ville.id

														var villesList = [].concat(villeObjects);
														for (var i = 0; i < villesList.length; i++) {
															var object = villesList[i].dataRow.dataEntry;

															// PARCOURIR LIST PROPERTIES
															ville[object[0].attributeReference] = object[0].value;
															ville[object[1].attributeReference] = object[1].value;
															//ville[object[2].attributeReference] = object[2].value;

															if (ville)
																villes.push(ville);
															ville = {}
														}

														console.log("villes.length : "+ villes.length);
														// PUT IN SESSION
														console.log("villes : "+JSON.stringify(villes));
														$cookieStore.put('villes', villes);
											})
											.error(function(err) {
														console.log("error : LOAD DATA");
														console.log("error in loadListVilles : "+ err);
											});
									//}
								})
								.error(function (data){
									console.log("error : récuperation JSessionId");
								});

						// REDIRECTION
						$state.go("cPhone");
					};

					$scope.$on( "$ionicView.beforeEnter", function( scopes, states ){
						if(states.fromCache && states.stateName == "connection" ){
							// VERIFICATION S'IL EST CONNECTE OU PAS

							// RECUPERATION CONNEXION
						var 	connexion=$cookieStore.get('connexion');
							if(connexion){
								if(connexion.etat)	// REDIRECTION
									$state.go("search");
							}
						}
					});
				})
;
