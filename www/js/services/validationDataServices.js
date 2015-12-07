/**
 * Created by Omar on 27/10/2015.
 */

angular.module('validationDataServices', ['ionic', 'cb.x2js', 'providerServices'])

  .service('Validator', function ($rootScope, DataProvider) {

		this.checkEmail=function(id){
			var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

			elm=angular.element(document.querySelector('#'+id));
			var isMatchRegex = EMAIL_REGEXP.test(elm.val());
			console.log("Email : "+elm.val());

			if(isMatchRegex){
				elm.parent().removeClass('has-warning').addClass('has-success');
			}
			else if(isMatchRegex == false || elm.val() == ''){
				elm.parent().removeClass('has-success').addClass('has-warning');
			}
		};

		this.checkField=function(id){
			var elm = angular.element(document.querySelector('#'+id));
			console.log("element["+id+"] : "+elm);
			input=elm.val();

			// TEST
			if(input && input.length>3){
				// CHAMP VALID
				elm.parent().removeClass('has-warning').addClass('has-success');
			}
			else{
				// CHAMP INVALID
				elm.parent().removeClass('has-success').addClass('has-warning');
				elm.val("");
			}
		};

		this.checkAutoComplete=function(elem, input, data, id){

			console.log("input : "+input);
			console.log("id : "+elem['currentTarget']['id']);
			/**for(var o in elem['currentTarget']){
				console.log(o+" : "+elem['currentTarget'][o]);
			}**/
			//console.log("data : "+JSON.stringify(data));

			elm= angular.element(document.querySelector('#'+id));
			isIn=0;
			// TEST
			if(input){
				// CHAMP REMPLI
				for(var i=0; i<data.length; i++){
					if(data[i]['libelle'] === input){
						isIn=1; break;
					}
				}
				if(isIn){
					elm.parent().parent().removeClass('has-warning').addClass('has-success');
					console.log("CHAMP VALID");
				}
				else{
					elm.val("");
					//elem.value='';
					console.log("VIDAGE CHAMP");
				}
				//elm.parentNode.classList.remove('has-warning').add('has-success');
			}
			else{
				// CHAMP INVALID
				elm.parent().parent().removeClass('has-success').addClass('has-warning');
				console.log("CHAMP INVALID");
				//elm.parentNode.classList.remove('has-success').add('has-warning');
			}
		};

		this.updateList=function(fk, list){
			console.log("fk : "+fk);
			console.log("list : "+list);

			//$rootScope.$broadcast('scanner-started');
			/**if(list === "ville")
				$rootScope.$broadcast('update-list-code', {params: {fk, list}});**/
			if(list === "postal")
				$rootScope.$broadcast('update-list-ville', {params: {'fk':fk, 'list':list}});
			if(list === "metier")
				$rootScope.$broadcast('update-list-job', {params: {'fk':fk, 'list':list}});
		};
  });
