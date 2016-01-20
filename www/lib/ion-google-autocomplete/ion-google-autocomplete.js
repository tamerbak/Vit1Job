angular.module('ion-google-autocomplete', [])
    .directive('ionGoogleAutocomplete', [
        '$ionicTemplateLoader',
        '$ionicBackdrop',
        '$ionicPlatform',
        '$q',
        '$timeout',
        '$rootScope',
        '$location',
        '$document',
        function($ionicTemplateLoader, $ionicBackdrop, $ionicPlatform, $q, $timeout, $rootScope, $location, $document) {
            return {
                require: '?ngModel',
                restrict: 'E',
                template: '<input type="text" readonly="readonly" class="ion-google-autocomplete" autocomplete="off">',
                replace: true,
                scope: {
                    ngModel: '=?',
                    placesOptions: '='
                },
                link: function(scope, element, attrs, ngModel) {
                    var unbindBackButtonAction;

                    scope.locations = [];
                    var autocompleteService = new google.maps.places.AutocompleteService();
                    var obj = angular.element('<div>').appendTo('body');
                    var placesService = new google.maps.places.PlacesService(obj.get(0));
                    var searchEventTimeout = undefined;
                    $rootScope.location = $location;
                    var googleAutocompleteOk='<button ng-click="selectLocationString(searchQuery)" class="button button-clear">Ok';
                    
                    if ($rootScope.location.$$path == '/jobyersOffersTab/map') 
                    {
                        googleAutocompleteOk = '';
                    }
                    //  else if($rootScope.location.$$path === '/adressePersonel/')
                    // {
                    //     if ($('#google-autocomplete-personel input:first').hasClass('autocomplete-travail')) 
                    //     {
                    //         $('#google-autocomplete-personel input:first').removeClass('autocomplete-travail');
                    //     };
                        
                    //     $('#google-autocomplete-personel input:first').addClass('autocomplete-personel');
                    // }
                    // else if($rootScope.location.$$path === '/adresseTravail/')
                    // {
                    //     if ($('#google-autocomplete-personel input:first').hasClass('autocomplete-personel')) 
                    //     {
                    //         $('#google-autocomplete-personel input:first').removeClass('autocomplete-personel');
                    //     };
                        
                    //     $('#google-autocomplete-travail input:first').addClass('autocomplete-travail');
                    // }
                    var POPUP_TPL = [
                        '<div class="ion-google-autocomplete-container modal">',
                            '<div class="bar bar-header item-input-inset">',
                                '<label class="item-input-wrapper">',
                                    '<i class="icon ion-ios7-search placeholder-icon"></i>',
                                    '<input class="google-autocomplete-search" type="search" ng-model="searchQuery" placeholder="' + (attrs.searchPlaceholder || 'Veuillez saisir votre adresse...') + '">',
                                '</label>',
                                googleAutocompleteOk,
                                '</button>',
                                '<button class="button button-clear google-autocomplete-cancele">',
                                    attrs.labelCancel || 'Cancel',
                                '</button>',
                            '</div>',
                            '<ion-content class="has-header has-header">',
                                '<ion-list>',
                                    '<ion-item ng-repeat="location in locations" type="item-text-wrap" ng-click="selectLocation(location)">',
                                        '{{location.description}}',
                                    '</ion-item>',
                                '</ion-list>',
                            '</ion-content>',
                        '</div>'
                    ].join('');

                    var popupPromise = $ionicTemplateLoader.compile({
                        template: POPUP_TPL,
                        scope: scope,
                        appendTo: $document[0].body
                    });

                    popupPromise.then(function(el){
                        var searchInputElement = angular.element(el.element.find('input'));

                        // when item in list is selected
                        scope.selectLocation = function(location){
                            var resultF={};
                            var details = placesService.getDetails({reference:location.reference}, function(result, status){
                                if (status === google.maps.places.PlacesServiceStatus.OK) {

                                    resultF = { 
                                        address_components: result.address_components, 
                                        adr_address: result.adr_address, 
                                        formatted_address: result.formatted_address,
                                        geometry: "",
                                        icon: "",
                                        lat:result.geometry.location.lat(location.reference),
                                        lng:result.geometry.location.lng(location.reference),
                                    };
                                    ngModel.$setViewValue(resultF);
                                    ngModel.$render();
                                    el.element.css('display', 'none');
                                    $ionicBackdrop.release();

                                    if (unbindBackButtonAction) {
                                        unbindBackButtonAction();
                                        unbindBackButtonAction = null;
                                    }
                                }
                            });

                            return resultF;
                        };
                        scope.selectLocationString = function(searchQuery)
                        {

                            
                            var result = { 
                                address_components: [], 
                                adr_address: "", 
                                formatted_address: searchQuery,
                                geometry: "",
                                icon: "",
                            };
                            ngModel.$setViewValue(result);
                            ngModel.$render();


                        };
                        

                        scope.$watch('searchQuery', function(query){
                            if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                            searchEventTimeout = $timeout(function() {
                                if(!query) return;
                                if(query.length < 3);

                                var req = scope.placesOptions || {};
                                req.input = query;

                                autocompleteService.getPlacePredictions(req, function(predictions, status){
                                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                                        scope.$apply(function(){
                                            scope.locations = predictions;
                                        });
                                    } else {
                                        // @TODO: Figure out what to do when the autocomplete fails
                                    }
                                });
                            }, 350); // we're throttling the input by 350ms to be nice to google's API
                        });


                        // when input is clicked
                        var onClick = function(e){
                            e.preventDefault();
                            e.stopPropagation();

                            $ionicBackdrop.retain();
                            unbindBackButtonAction = $ionicPlatform.registerBackButtonAction(closeOnBackButton, 250);

                            el.element.css('display', 'block');
                            searchInputElement[0].focus();
                            setTimeout(function(){
                                searchInputElement[0].focus();
                            },0);
                        };

                        var onCancel = function(e){
                            scope.searchQuery = '';
                            $ionicBackdrop.release();
                            el.element.css('display', 'none');

                            if (unbindBackButtonAction){
                                unbindBackButtonAction();
                                unbindBackButtonAction = null;
                            }
                        };

                        closeOnBackButton = function(e){
                            e.preventDefault();

                            el.element.css('display', 'none');
                            $ionicBackdrop.release();

                            if (unbindBackButtonAction){
                                unbindBackButtonAction();
                                unbindBackButtonAction = null;
                            }
                        }

                        element.bind('click', onClick);
                        element.bind('touchend', onClick);

                        el.element.find('button').bind('click', onCancel);
                    });

                    if(attrs.placeholder){
                        element.attr('placeholder', attrs.placeholder);
                    }


                    ngModel.$formatters.unshift(function (modelValue) {
                        if (!modelValue) return '';
                        return modelValue;
                    });

                    ngModel.$parsers.unshift(function (viewValue) {
                        return viewValue;
                    });

                    ngModel.$render = function(){
                        if(!ngModel.$viewValue){
                            element.val('');
                        } else {
                            element.val(ngModel.$viewValue.formatted_address || '');
                        }
                    };

                    scope.$on("$destroy", function(){
                        if (unbindBackButtonAction){
                            unbindBackButtonAction();
                            unbindBackButtonAction = null;
                        }
                    });
                }
            };
        }
    ]);
