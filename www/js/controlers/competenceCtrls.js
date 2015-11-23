/**
 * Created by Tamer on 15/10/2015.
 */

'use strict';
starter

	.controller('competenceCtrl', function ($scope, $rootScope, $cookieStore, $state,$ionicHistory, x2js, AuthentificatInServer,
						Global, DataProvider, PullDataFromServer, PersistInServer, LoadList, formatString, UploadFile){
		// FORMULAIRE
		$scope.formData={};

		$scope.formData.maitriseIcon = "img/tree1_small.png";
		$scope.formData.maitrise = "Débutant";
		$scope.formData.maitriseStyle = "display: inline;max-width: 33px;max-height: 50px;"

		// ALL JOBYERS
		$rootScope.jobyers=[];
		$rootScope.jobyerCurrent={};

		// NAVIGATION
		$scope.formData.showButtRight=true;
		$scope.formData.showButtLeft=true;

		$scope.updateAutoComplete= function(){
			console.log("metier : "+$scope.formData.metierSelected.pk);
			var metiers=$scope.formData.metiers;
			// RECHERCHE LIBELLE
			for(var i=0; i<metiers.length; i++){
				if(metiers[i]['pk_user_metier'] === $scope.formData.metierSelected.pk){
					$scope.formData.metierSelected.libelle=metiers[i]['libelle'];
					break;
				}
			}

			if(typeof $scope.formData.metier === 'undefined')
				$scope.formData.metier={};
			$scope.formData.metier.originalObject={'pk_user_metier': $scope.formData.metierSelected.pk, 'libelle': $scope.formData.metierSelected.libelle};
			console.log("formData.metier : "+JSON.stringify($scope.formData.metier));
			document.getElementById('metiers_value').value=$scope.formData.metierSelected['libelle'];

			// VIDER LIST - JOBS
			$scope.formData.jobs=[];
			var jobs=DataProvider.getJobs();
			for(var i=0; i<jobs.length; i++){
				if(jobs[i]['fk_user_metier'] === $scope.formData.metierSelected.pk)
					$scope.formData.jobs.push(jobs[i]);
			}

			// RE-INITIALISE INPUT JOB
			document.getElementById('jobs_value').value='Jobs';
			$scope.formData.job={};
		};

		$scope.updateAutoJob= function(){
			console.log("job : "+$scope.formData.jobSelected.pk);
			var jobs=$scope.formData.jobs;
			// RECHERCHE LIBELLE
			for(var i=0; i<jobs.length; i++){
				if(jobs[i]['pk_user_competence'] === $scope.formData.jobSelected.pk){
					$scope.formData.jobSelected.libelle=jobs[i]['libelle'];
					break;
				}
			}

			if(typeof $scope.formData.job === 'undefined')
				$scope.formData.job={};
			$scope.formData.job.originalObject={'pk_user_competence': $scope.formData.jobSelected.pk, 'libelle': $scope.formData.jobSelected.libelle};
			console.log("formData.job : "+JSON.stringify($scope.formData.job));
			document.getElementById('jobs_value').value=$scope.formData.jobSelected['libelle'];
		};

		$scope.initAll = function(){

			// GET LIST
			$scope.formData={
				'currentFeuille': 1,
				'allFeuilles': 1,
				'maitrise': 'Débutant',
				'maitriseIcon': 'tree1_small.png',
				'metiers': DataProvider.getMetiers(),
				'langues': DataProvider.getLangues(),
				'jobs': DataProvider.getJobs(),
				'transvers': DataProvider.getTransvers()
				};

			// FEUILLE N°0
			$rootScope.jobyerCurrent['indice']=1;
			$rootScope.jobyers.push($rootScope.jobyerCurrent); // AJOUTE MAIS C'EST UNDIFINED

			$scope.refrechNavigation();
		};

		$scope.rangeChange = function(){
			var rangeModel=$scope.formData.degre;
			console.log("rangeModel : "+rangeModel);
			if (rangeModel <= 25 ){
        		$scope.formData.maitrise = "Débutant";
        		$scope.formData.maitriseIcon = "tree1_small.png";
            $scope.formData.maitriseWidth = "33px";
            $scope.formData.maitriseHeight = "50px";
      		}

      		else if (rangeModel > 25 && rangeModel <= 50 ) {
        		$scope.formData.maitrise = 'Habitué';
        		$scope.formData.maitriseIcon = "tree2_small.png";
            //$scope.formData.maitriseStyle = "display: inline;max-width: 33px;max-height: 50px;";
      		}

      		else if (rangeModel > 50 && rangeModel <= 75 ){
        		$scope.formData.maitrise = 'Confirmé';
        		$scope.formData.maitriseIcon = "tree3_small.png";
            //$scope.formData.maitriseStyle = "display: inline;max-width: 59px;max-height: 77px;";
      		}
      		else if (rangeModel > 75 && rangeModel <= 100 ){
        		$scope.formData.maitrise = 'Waouh!';
        		$scope.formData.maitriseIcon = "tree4_small.png";
            //$scope.formData.maitriseStyle = "display: inline;max-width: 60px;max-height: 80px;";
      		}
		};

		$scope.afficheList = function(){
			//console.log("Formulaire : "+JSON.stringify($scope.formData));
			//AFFICHAGE
			console.log("All Jobyers : "+JSON.stringify($rootScope.jobyers));
		};

		$scope.addJobyer = function(){
			// VALIDATION DES CHAMPS
			var metier=null, job=null;
			if(typeof $scope.formData.metier !== 'undefined')
				//if(typeof $scope.formData.metier.originalObject !== 'undefined'){
					metier=$scope.formData.metier;
				//}
			if(typeof $scope.formData.job !== 'undefined')
				//if(typeof $scope.formData.job.originalObject !== 'undefined'){
					job=$scope.formData.job;
				//}

			/**metier=$scope.formData.metier;
			job=$scope.formData.job;**/
			var degre=$scope.formData.degre;
			var indisp=$scope.formData.indisp;
			var langue=$scope.formData.langue;
			var maitrise=$scope.formData.maitrise;
			var maitriseIcon=$scope.formData.maitriseIcon;

			//if(metier === null || job === null || !$scope.isValid(indisp) || !$scope.isValid(langue)){
			if(metier === null || job === null || isNaN(indisp) || isNaN(langue)){
				Global.showAlertValidation("Remplir tous les champs.");
				return;
			}


			// RECUPERER JOBYER Current
			var jobyerCurrent=$rootScope.jobyerCurrent;
			console.log("Indice jobyerCurrent : "+jobyerCurrent.indice);
			// VERIFICATION
			if(jobyerCurrent.indice && jobyerCurrent.indice>0){

				if(jobyerCurrent.indice<$rootScope.jobyers.length){ // IL S'AGIT D'UNE NAVIGATION
					$scope.loadJobyer(Number($rootScope.jobyers.length));
					return;
				}

				// UPDATE CURRENT JOBYER
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].metier=metier;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].job=job;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].degre=degre;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].indisp=indisp;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].langue=langue;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].maitrise=maitrise;
				$rootScope.jobyers[Number(jobyerCurrent.indice)-1].maitriseIcon=maitriseIcon;

				// UPDATE IN VIEW
				$scope.formData.currentFeuille=jobyerCurrent.indice+1;;
				$scope.formData.allFeuilles=$rootScope.jobyers.length;

				console.log("Old Jobyer : "+JSON.stringify($rootScope.jobyers[Number(jobyerCurrent.indice)-1]));
				// ADD NEW JOBYER
				$rootScope.jobyerCurrent={};
				$rootScope.jobyerCurrent['indice']=jobyerCurrent.indice+1;
				$rootScope.jobyerCurrent['metier']=metier;
				$rootScope.jobyerCurrent['job']=job;
				$rootScope.jobyerCurrent['degre']=degre;
				$rootScope.jobyerCurrent['indisp']=indisp;
				$rootScope.jobyerCurrent['langue']=langue;
				$rootScope.jobyerCurrent['maitrise']=maitrise;
				$rootScope.jobyerCurrent['maitriseIcon']=maitriseIcon;
				$rootScope.jobyers.push($rootScope.jobyerCurrent); // AJOUTE ///MAIS C'EST UNDIFINED

				console.log("New Jobyer : "+JSON.stringify($rootScope.jobyers[Number($rootScope.jobyerCurrent.indice)-1]));

				// REFRESH BUTTONS
				//$scope.refrechNavigation();
			}

			$scope.refrechNavigation();
		};

		$scope.removeJobyer = function(){
			if($rootScope.jobyers.length<=1)
				return;

			var idex=Number($scope.formData.currentFeuille);
			// DELETE OBJECT FROM LIST
			$rootScope.jobyers.splice(idex-1, 1);
			// UPDATE ALL INDICES
			for(var i=0; i<$rootScope.jobyers.length; i++){
				$rootScope.jobyers[i].indice=i+1;
			}

			$scope.refrechNavigation();

			if(idex<=1){
				// LOAD OBJECT NEXT
				$scope.formData.currentFeuille+=1;
				$scope.loadJobyer(idex+1);
			}else{
				// LOAD OBJECT PREV
				$scope.formData.currentFeuille-=1;
				$scope.loadJobyer(idex-1);
			}

			// UPDATE NBRE ITEMS
			$scope.formData['allFeuilles']=$rootScope.jobyers.length;
		};

		// LOAD NEXT FEUILLE
		$scope.loadNextJobyer = function(){

			var idex=Number($scope.formData.currentFeuille);
			console.log("Je suis ds loadNextJobyer -> Last Feuille = "+idex);
			if(idex === 0)
				idex=1;

			// TEST
			if(idex>=$rootScope.jobyers.length || idex<=0)	// IN OUT-BOUND
				return;

			// UPDATE FEUILLE
			idex+=1;
			$scope.formData.currentFeuille=idex;
			console.log("loadNextJobyer : currentFeuille = "+idex);

			$scope.refrechNavigation();

			$rootScope.jobyerCurrent=$rootScope.jobyers[idex-1];
			console.log("jobyerCurrent : "+JSON.stringify($rootScope.jobyerCurrent));
			// CHARGER FORMULAIRE
			document.getElementById('metiers_value').value=$rootScope.jobyerCurrent["metier"]["libelle"];
			document.getElementById('jobs_value').value=$rootScope.jobyerCurrent["job"]["libelle"];
			/**$scope.formData["metier"]= $rootScope.jobyerCurrent["metier"];
			$scope.formData["job"]= $rootScope.jobyerCurrent["job"];**/
			$scope.formData["degre"]= $rootScope.jobyerCurrent["degre"];
			$scope.formData["indisp"]= $rootScope.jobyerCurrent["indisp"];
			$scope.formData["langue"]= $rootScope.jobyerCurrent["langue"];
			$scope.formData["maitrise"]= $rootScope.jobyerCurrent["maitrise"];
			$scope.formData["maitriseIcon"]= $rootScope.jobyerCurrent["maitriseIcon"];

			//console.log("formData : "+JSON.stringify($scope.formData));
			$scope.$apply(function(){});
		};

		// LOAD FEUILLE N°i
		$scope.loadJobyer = function(idex){

			// UPDATE FEUILLE
			$scope.formData.currentFeuille=idex;
			console.log("loadJobyer : currentFeuille = "+idex);

			$scope.refrechNavigation();

			if(idex>$rootScope.jobyers.length || idex<1)	// IN OUT-BOUND
				return;

			$rootScope.jobyerCurrent=$rootScope.jobyers[idex-1];
			console.log("jobyerCurrent : "+JSON.stringify($rootScope.jobyerCurrent));
			// CHARGER FORMULAIRE
			document.getElementById('metiers_value').value=$rootScope.jobyerCurrent["metier"]["libelle"];
			document.getElementById('jobs_value').value=$rootScope.jobyerCurrent["job"]["libelle"];
			/**$scope.formData["metier"]= $rootScope.jobyerCurrent["metier"];
			$scope.formData["job"]= $rootScope.jobyerCurrent["job"];**/
			$scope.formData["degre"]= $rootScope.jobyerCurrent["degre"];
			$scope.formData["indisp"]= $rootScope.jobyerCurrent["indisp"];
			$scope.formData["langue"]= $rootScope.jobyerCurrent["langue"];
			$scope.formData["maitrise"]= $rootScope.jobyerCurrent["maitrise"];
			$scope.formData["maitriseIcon"]= $rootScope.jobyerCurrent["maitriseIcon"];
		};

		// LOAD PREV FEUILLE
		$scope.loadPrevJobyer = function(){

			var idex=Number($scope.formData.currentFeuille);
			console.log("Je suis ds loadPrevJobyer -> Last Feuille = "+idex);
			if(idex === 0)
				idex=1;

			// TEST
			if(idex>$rootScope.jobyers.length || idex<=0)	// IN OUT-BOUND
				return;

			// UPDATE FEUILLE
			idex-=1;
			if(idex===0)
				idex=1;
			$scope.formData.currentFeuille=idex;
			console.log("loadPrevJobyer : currentFeuille = "+idex);

			$scope.refrechNavigation();

			$rootScope.jobyerCurrent=$rootScope.jobyers[idex-1];
			console.log("jobyerCurrent : "+JSON.stringify($rootScope.jobyerCurrent));
			// CHARGER FORMULAIRE
			document.getElementById('metiers_value').value=$rootScope.jobyerCurrent["metier"]["libelle"];
			document.getElementById('jobs_value').value=$rootScope.jobyerCurrent["job"]["libelle"];
			/**$scope.formData["metier"]= $rootScope.jobyerCurrent["metier"];
			$scope.formData["job"]= $rootScope.jobyerCurrent["job"];**/
			$scope.formData["degre"]= $rootScope.jobyerCurrent["degre"];
			$scope.formData["indisp"]= $rootScope.jobyerCurrent["indisp"];
			$scope.formData["langue"]= $rootScope.jobyerCurrent["langue"];
			$scope.formData["maitrise"]= $rootScope.jobyerCurrent["maitrise"];
			$scope.formData["maitriseIcon"]= $rootScope.jobyerCurrent["maitriseIcon"];

			//console.log("formData : "+JSON.stringify($scope.formData));
			$scope.$apply(function(){});
		};

		// REFRESH BUTTONS
		$scope.refrechNavigation=function(){

			var idex=Number($scope.formData.currentFeuille);
			if(idex<1 || idex>$rootScope.jobyers.length)
				return;

			console.log("refrechNavigation : index = "+idex);

			// BUTTON NEXT - VERS IDEX++
			if($rootScope.jobyers.length && $rootScope.jobyers.length>1 && idex!=$rootScope.jobyers.length)
				$scope.formData.showButtRight=false;
			else
				$scope.formData.showButtRight=true;

			// BUTTON PREV
			if($rootScope.jobyers.length && $rootScope.jobyers.length>1 && idex>1)
				$scope.formData.showButtLeft=false;
			else
				$scope.formData.showButtLeft=true;

			console.log("$scope.formData.showButtLeft : "+$scope.formData.showButtLeft);
			console.log("$scope.formData.showButtRight : "+$scope.formData.showButtRight);
		};

		// PERSIST LIST JOBYERS
		$scope.saveJobyers=function(){

			// RECUPERATION DU LAST JOBYER[FEUILLE COURANTE]
			var idex=Number($scope.formData.currentFeuille)-1;

			if($rootScope.jobyers.length <= 1)
				if(typeof $scope.formData.metier === 'undefined' || typeof $scope.formData.job === 'undefined' ||
					isEmpty($scope.formData.degre) || isNaN($scope.formData.indisp) || isNaN($scope.formData.langue)){

						console.log("jobyers : "+JSON.stringify($rootScope.jobyers));
						Global.showAlertValidation("Remplir tous les champs.");
						return;
				}

			// MODIFICATION JOBYER COURANT
			var met=null, comp=null;
			if(typeof $scope.formData.metier !== 'undefined')
				//if(typeof $scope.formData.metier.originalObject !== 'undefined'){
					met=$scope.formData.metier;
				//}
			if(typeof $scope.formData.job !== 'undefined')
				//if(typeof $scope.formData.job.originalObject !== 'undefined'){
					comp=$scope.formData.job;
				//}

			if(met !== null)
				$rootScope.jobyers[idex].metier=met;
			if(comp !== null)
				$rootScope.jobyers[idex].job=comp;
			console.log("met : "+met);
			console.log("comp : "+comp);
			
			/**$rootScope.jobyers[idex].metier=$scope.formData.metier;
			$rootScope.jobyers[idex].job=$scope.formData.job;**/
			$rootScope.jobyers[idex].degre=$scope.formData.degre;
			$rootScope.jobyers[idex].indisp=$scope.formData.indisp;
			$rootScope.jobyers[idex].langue=$scope.formData.langue;
			$rootScope.jobyers[idex].maitrise=$scope.formData.maitrise;
			$rootScope.jobyers[idex].maitriseIcon=$scope.formData.maitriseIcon;

			// RECUPERATION CONNEXION
			var connexion=$cookieStore.get('connexion');
			// RECUPERATION EMPLOYEUR ID
			var employeId=connexion.employeID;
			console.log("connexion : "+JSON.stringify(connexion));
			// RECUPERATION SESSION ID
			sessionId=$cookieStore.get('sessionID');

			console.log("Offres A Persister : "+JSON.stringify($rootScope.jobyers));

			var hasSessionID=0;
			if(sessionId)
				hasSessionID=1;
			else{	// RECUPERATION SESSION-ID
				AuthentificatInServer.getSessionId()
					.success(function (response){
						var jsonResp = x2js.xml_str2json(response);
						var jsonText = JSON.stringify (jsonResp);
						jsonText = jsonText.replace("fr.protogen.connector.model.AmanToken","amanToken");
						jsonResp = JSON.parse(jsonText);

						// GET SESSION ID
          				sessionId = jsonResp.amanToken.sessionId;
          				console.log("New sessionId : "+sessionId);
		  				$cookieStore.put('sessionID', sessionId);
						hasSessionID=1;
					})
					.error(function (err){
						console.log("error : Récuperation Session ID");
						console.log("error In saveJobyers: "+err);
					});
			}

			var promiseArray = [];
			if(hasSessionID){
				console.log("Je suis dans : hasSessionID" + $rootScope.jobyers.length);

				// PARCOURIR ALL JOBYERS
				var i;
				for(i=0; i< $rootScope.jobyers.length; i++){
					console.log("iiii : "+i);
						
						var offre=$rootScope.jobyers[i];
						
						if(typeof offre.metier === 'undefined' || typeof offre.job === 'undefined' || isNaN(offre.indisp) || isNaN(offre.langue)){
							console.log("Il manque des informations")
							return;
						}

						// GET NIVEAU
						var list=DataProvider.getNiveauxMaitrise();
						var niveau=0;
						for(var j=0; j<list.length; j++){
							if(list[j]['libelle'] === offre.maitrise){
								niveau=Number(list[j]['pk_user_niveau_de_maitrise']); break;
							}
						}
						if(niveau){
							console.log("niveau : "+niveau);
						}
						
						
						// PERSISTENCE OFFRE N°i
						PersistInServer.persistInOffres(employeId, "Titre_4", "Description_4", new Date().getTime(), new Date().getTime()+2592000 , sessionId, employeId, niveau)
							.then(
								function (response){
									console.log("response : "+JSON.stringify(response));
									
									// RECUPERATION EMPLOYEUR ID*
									var offreId=0;
									var ofre=formatString.formatServerResult(response.data);
									console.log("ofre : "+JSON.stringify(ofre));
									if(ofre.dataModel.status || ofre.dataModel.status !== 'FAILURE'){	// BIND IN COOKIES
										offreId=Number(ofre.dataModel.status);
										console.log("offreId : "+offreId);
										// $cookieStore.put('offreID', Number(ofre.dataModel.status));
									}
									// DONNEES ONT ETE SAUVEGARDES
									console.log("offreID a été bien récuperé : "+offreId);
									if(offreId){
										if(offre.job){
											console.log("job : "+offre.job.pk_user_competence);
											// PERSISTENCE IN COMPETANCE
											//*
											PersistInServer.persistInOffres_Competences(sessionId, Number(offre.job.pk_user_competence), Number(offreId))
												.then(
													function (response){
														console.log("success : persistInOffres_Competences"+response);
													},function (err){
															console.log("error : insertion DATA");
															console.log("error In persistInOffres_Competences: "+err);
													}
												)
												.then(
													function (e){
														if(!isNaN(offre.indisp)){
															console.log("indisp : "+offre.indisp);
															// PERSISTENCE IN TRANSVERS
															PersistInServer.persistInOffres_Transvers(sessionId, Number(offre.indisp), Number(offreId))
																.then(
																	function (response){
																		console.log("success : persistInOffres_Transvers"+response);
																	},function (err){
																			console.log("error : insertion DATA");
																			console.log("error In persistInOffres_Transvers: "+err);
																	}
																);
														}
													}
												)
												.then(
													function (e){
														if(!isNaN(offre.langue)){
															console.log("offreId : "+offreId);
															console.log("langue : "+offre.langue);
															// PERSISTENCE IN LANGUES
															PersistInServer.persistInOffres_Langues(sessionId, Number(offre.langue), Number(offreId))
																.then(
																	function (response){
																		console.log("success : persistInOffres_Langues"+response);
																	},function (err){
																			console.log("error : insertion DATA");
																		console.log("error In persistInOffres_Langues: "+err);
																	}
																);
														}
													}
												);
																					//*/

										}
												


									}
								},function (err){
									console.log("error : insertion DATA");
									console.log("error In PullDataFromServer.pullDATA: "+err);
								}
							);
							/**
							.success(function (response){
								console.log("response : "+response);

								// RECUPERATION EMPLOYEUR ID*
								offreId=0;
								ofre=formatString.formatServerResult(response);
								if(ofre.dataModel.status || ofre.dataModel.status !== 'FAILURE'){	// BIND IN COOKIES
									offreId=Number(ofre.dataModel.status);
									// $cookieStore.put('offreID', Number(ofre.dataModel.status));
								}

								// DONNEES ONT ETE SAUVEGARDES
								console.log("offreID a été bien récuperé : "+offreId);

								if(offreId){
									if(offre.job){
										console.log("offreId : "+offreId);
										console.log("job : "+offre.job.pk_user_competence);
										// PERSISTENCE IN COMPETANCE
										PersistInServer.persistInOffres_Competences(sessionId, Number(offre.job.pk_user_competence), Number(offreId))
												.success(function (response){
													console.log("success : persistInOffres_Competences"+response);
												}).error(function (err){
														console.log("error : insertion DATA");
														console.log("error In persistInOffres_Competences: "+err);
												});
									}

									if(!isNaN(offre.indisp)){
										console.log("offreId : "+offreId);
										console.log("indisp : "+offre.indisp);
										// PERSISTENCE IN TRANSVERS
										PersistInServer.persistInOffres_Transvers(sessionId, Number(offre.indisp), Number(offreId))
												.success(function (response){
													console.log("success : persistInOffres_Transvers"+response);
												}).error(function (err){
														console.log("error : insertion DATA");
														console.log("error In persistInOffres_Transvers: "+err);
												});
									}

									if(!isNaN(offre.langue)){
											console.log("offreId : "+offreId);
											console.log("langue : "+offre.langue);
											// PERSISTENCE IN LANGUES
											PersistInServer.persistInOffres_Langues(sessionId, Number(offre.langue), Number(offreId))
												.success(function (response){
													console.log("success : persistInOffres_Langues"+response);
												}).error(function (err){
														console.log("error : insertion DATA");
														console.log("error In persistInOffres_Langues: "+err);
												});
										}
								}

							}).error(function (err){
								console.log("error : insertion DATA");
								console.log("error In PullDataFromServer.pullDATA: "+err);
							});**/

				}
				
				// SHOW MODAL
				//Global.showAlertPassword("Merci! Vos Offres sont été bien publiés.");
				// REDIRECTION VERS SEARCH
				$state.go("search");
			}
		};
	  $scope.backbutton = function()
	  {
		console.log("backbutton");
		console.log($ionicHistory.backView());
	  };
		$scope.$on('update-list-job', function(event, args){

			var params = args.params;
			console.log("params : "+JSON.stringify(params));

			// VIDER LIST - JOBS
			$scope.formData.jobs=[];
			var jobs=DataProvider.getJobs();
			for(var i=0; i<jobs.length; i++){
				if(jobs[i]['fk_user_metier'] === params.fk)
					$scope.formData.jobs.push(jobs[i]);
			}
		});

		$scope.$on("$ionicView.beforeEnter", function( scopes, states ){
			if(states.fromCache && states.stateName == "competence" ){
				console.log("Initialisation : beforeEnter(competence)");
				$scope.formData['currentFeuille']=1;
				$scope.formData['allFeuilles']=1;

				// FEUILLE N°1
				$rootScope.jobyerCurrent={};
				$rootScope.jobyerCurrent['indice']=1;
				$rootScope.jobyers=[];
				$rootScope.jobyers.push($rootScope.jobyerCurrent);
			}
		});

		$scope.isValid=function(field){

			return !isNaN(Number(field));
		}

  });
