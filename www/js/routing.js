/**
 * Created by HODAIKY on 24/10/2015.
 */
'use strict';

starter.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })
    .state('connection', {
      url: '/connection',
      templateUrl: 'templates/connections.html',
      controller: 'connectCtrl'

    })

    .state('profile', {
      url: "/profile",
      params: {
        'link': ""
      },
      templateUrl: "templates/profile.html",
      controller: "ProfileCtrl"
    })

    .state('list', {
      url: '/list',
      templateUrl: 'templates/listJobyers.html',
      controller: 'listCtrl'

    })

    .state('map', {
      url: '/map',
      templateUrl: 'templates/map.html',
      controller: 'MapCtrl'

    })

    .state('jobyersOffersTab', {
      url: '/jobyersOffersTab',
      abstract: true,
      templateUrl: 'templates/jobyersOffersTab.html',
    })

    .state('jobyersOffersTab.list', {
      url: '/list',
      views: {
        'jobyersOffersTab-list': {
          templateUrl: 'templates/jobyersOffersList.html',
          controller: 'jobyersOffersListCtrl'
        }
      }
    })

    .state('jobyersOffersTab.map', {
      url: '/map',
      views: {
        'jobyersOffersTab-map': {
          templateUrl: 'templates/jobyersMap.html',
          controller: 'jobyersMapCtrl'
        }
      }
    })

    .state('jobyersOffersTab.options', {
      url: '/options',
      views: {
        'jobyersOffersTab-options': {
          templateUrl: 'templates/jobyersOffersOptions.html',
          controller: 'jobyersOffersOptionsCtrl'
        }
      }
    })

    .state('listNext', {
      url: '/listNext',
      templateUrl: 'templates/listJobyersNext.html',
      controller: 'listNextCtrl'

    })

    .state('cPhone', {
      url: '/cPhone',
      templateUrl: 'templates/connexionPhone.html',
      controller: 'cPhoneCtrl'
    })

    .state('cMail', {
      url: '/cMail',
      templateUrl: 'templates/connexionMail.html',
      controller: 'cMailCtrl'
    })
    .state('saisieCiviliteEmployeur', {
      url: '/saisieCivilite/:steps',
      templateUrl: 'templates/saisieCiviliteEmployeur.html',
      controller: 'saisieCiviliteEmployeurCtrl'
    })

    .state('adresseTravail', {
      url: '/adresseTravail/',
      params: {
        'geolocated': false, 'addressPers': null , steps:null
      },
      templateUrl: 'templates/adresseTravail.html',
      controller: 'adresseTravailCtrl'
    })

    .state('adressePersonel', {
      url: '/adressePersonel/:steps',
      templateUrl: 'templates/adressePersonel.html',
      controller: 'adressePersonelCtrl'
    })

    .state('offres', {
      url: '/offres',
      templateUrl: 'templates/offres.html',
      controller: 'offresCtrl'
    })
    .state('offreTabs', {
      url: '/offreTabs/:offre',
      cache: false,
      abstract: true,
      templateUrl: 'templates/offreTabs.html',
      controller: 'offreTabsCtrl'
    })
    .state('contract', {
      url: '/contract',
      params: {jobyer: null},
      templateUrl: 'templates/createContract.html',
      controller: 'contractCtrl'
    })
    .state('offreTabs.job', {
      url: '/job/:offre',
      views: {
        'offreTabs-job': {
          controller: 'offreTabsCtrl',
          templateUrl: 'templates/tabs/job.html'
        }
      }
    })
    .state('offreTabs.qualites', {
      url: '/qualites',
      views: {
        'offreTabs-qualites': {
          controller: 'offreTabsCtrl',
          templateUrl: 'templates/tabs/qualites.html'
        }
      }
    })
    .state('offreTabs.langues', {
      url: '/langues',
      views: {
        'offreTabs-langues': {
          controller: 'offreTabsCtrl',
          templateUrl: 'templates/tabs/langues.html'
        }
      }
    })
    .state('offreTabs.agenda', {
      url: '/agenda',
      views: {
        'offreTabs-agenda': {
          controller: 'offreTabsCtrl',
          templateUrl: 'templates/tabs/agenda.html'
        }
      }
    });
 $urlRouterProvider.otherwise('/app');
});
