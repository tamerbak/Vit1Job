/**
 * Created by Tamer on 24/10/2015.
 */
'use strict';

starter.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider

    .state('menu', {
      url: '/menu',
      abstract: true,
      templateUrl: 'menu.html',
      controller: 'MenuCtrl'
    })

    .state('menu.app', {
      url: '/app',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      }
      //templateUrl: 'templates/home.html',

    })
    .state('menu.resetPassword', {
      url: '/resetPassword',
      views: {
        'menuContent': {
          templateUrl: 'templates/resetPassword.html',
          //templateUrl: 'templates/resetPassword.html',
          controller: 'ResetPasswordCtrl'
        }
      }
    })
    .state('menu.verifyPassword', {
      url: '/verifyPassword',
      views: {
        'menuContent': {
          templateUrl: 'templates/verifyPassword.html',
          //templateUrl: 'templates/verifyPassword.html',
          controller: 'VerifyPasswordCtrl'
        }
      }
    })
    .state('menu.changePassword', {
      url: '/changePassword',
      views: {
        'menuContent': {
          templateUrl: 'templates/changePassword.html',
          //templateUrl: 'templates/changePassword.html',
          controller: 'ChangePasswordCtrl'
        }
      }
    })
    .state('menu.paiementOptions', {
      url: '/paiementOptions',
      views: {
        'menuContent': {
          templateUrl: 'templates/paiementOptions.html',
          //templateUrl: 'templates/paiementOptions.html',
          controller: 'PaiementOptionsCtrl'
        }
      }
    })
    .state('menu.payLine', {
      url: '/payLine',
      views: {
        'menuContent': {
          templateUrl: 'templates/payLine.html',
          //templateUrl: 'templates/payLine.html',
          controller: 'PayLineCtrl'
        }
      }
    })
    .state('menu.slimPay', {
      url: '/slimPay',
      views: {
        'menuContent': {
          templateUrl: 'templates/slimPay.html',
          //templateUrl: 'templates/slimPay.html',
          controller: 'SlimPayCtrl'
        }
      }
    })
    .state('menu.connection', {
      url: '/connection',
      views: {
        'menuContent': {
          templateUrl: 'templates/connections.html',
          //templateUrl: 'templates/connections.html',
          controller: 'connectCtrl'
        }
      }
    })
    .state('menu.profile', {
      url: "/profile",
      params: {
        'link': ""
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          //templateUrl: "templates/profile.html",
          controller: "ProfileCtrl"
        }
      }
    })

    .state('menu.list', {
      url: '/list',
      views: {
        'menuContent': {
          templateUrl: 'templates/listJobyers.html',
          //templateUrl: 'templates/listJobyers.html',
          controller: 'listCtrl'
        }
      }

    })

    .state('menu.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          //templateUrl: 'templates/map.html',
          controller: 'MapCtrl'
        }
      }

    })

    .state('menu.jobyersOffersTab', {
      url: '/jobyersOffersTab',
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/jobyersOffersTab.html'
        }
      }
      //templateUrl: 'templates/jobyersOffersTab.html',
    })

    .state('menu.jobyersOffersTab.list', {
      url: '/list',
      views: {
        //'menuContent': {
          //views: {
            'jobyersOffersTab-list': {
              templateUrl: 'templates/searchTabs/jobyersOffersList.html',
              controller: 'CardsCtrl' //jobyersOffersListCtrl
            }
          //}
        //}
      }
    })

    .state('menu.jobyersOffersTab.map', {
      url: '/map',
      views: {
        //'menuContent': {
          //views: {
            'jobyersOffersTab-map': {
              templateUrl: 'templates/searchTabs/jobyersMap.html',
              controller: 'jobyersMapCtrl'
            }
          }
        //}
      //}
    })

    .state('menu.jobyersOffersTab.options', {
      url: '/options',
      views: {
        //'menuContent': {
          //views: {
            'jobyersOffersTab-options': {
              templateUrl: 'templates/searchTabs/jobyersOffersOptions.html',
              controller: 'jobyersOffersOptionsCtrl'
            }
          }
        //}
      //}
    })

    .state('menu.listNext', {
      url: '/listNext',
      views: {
        'menuContent': {
          templateUrl: 'templates/listJobyersNext.html',
          //templateUrl: 'templates/listJobyersNext.html',
          controller: 'listNextCtrl'
        }
      }

    })

    .state('menu.cPhone', {
      url: '/cPhone',
      views: {
        'menuContent': {
          templateUrl: 'templates/connexionPhone.html',
          //templateUrl: 'templates/connexionPhone.html',
          controller: 'cPhoneCtrl'
        }
      }
    })

    .state('menu.cMail', {
      url: '/cMail',
      views: {
        'menuContent': {
          templateUrl: 'templates/connexionMail.html',
          //templateUrl: 'templates/connexionMail.html',
          controller: 'cMailCtrl'
        }
      }
    })

    .state('menu.infoTabs', {
      url: '/infoTabs',
      cache: false,
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/informationTabs.html'//,
          //controller: 'infoTabsCtrl'
        }
      }
    })

    .state('menu.infoTabs.saisieCiviliteEmployeur', {
      url: '/saisieCivilite/:steps',
      views: {
        'infoTabs-saisieCiviliteEmployeur': {
          templateUrl: 'templates/infoTabs/saisieCiviliteEmployeur.html',
          controller: 'saisieCiviliteEmployeurCtrl'
        }
      }
    })

    .state('menu.infoTabs.adresseTravail', {
      url: '/adresseTravail/',
      params: {
        'geolocated': false, 'addressPers': null , steps:null
      },
      views: {
        'infoTabs-adresseTravail': {
          templateUrl: 'templates/infoTabs/adresseTravail.html',
          controller: 'adresseTravailCtrl'
        }
      }
    })

    .state('menu.infoTabs.adressePersonel', {
      url: '/adressePersonel/:steps',
      views: {
          'infoTabs-adressePersonel': {
            controller: 'adressePersonelCtrl',
            templateUrl: 'templates/infoTabs/adressePersonel.html'
          }
      }
    })

    .state('menu.offres', {
      url: '/offres',
      views: {
        'menuContent': {
          templateUrl: 'templates/offres.html',
          //templateUrl: 'templates/offres.html',
          controller: 'offresCtrl'
        }
      }
    })
    .state('menu.offreTabs', {
      url: '/offreTabs/:offre',
      cache: false,
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/offreTabs.html',
          //templateUrl: 'templates/offreTabs.html',
          controller: 'offreTabsCtrl'
        }
      }
    })
    .state('menu.contract', {
      url: '/contract',
      params: {jobyer: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/createContract.html',
          //templateUrl: 'templates/createContract.html',
          controller: 'contractCtrl'
        }
      }
    })
    .state('menu.offreTabs.job', {
      url: '/job/:offre',
      views: {
        //'menuContent': {
          //views: {
            'offreTabs-job': {
              controller: 'offreTabsCtrl',
              templateUrl: 'templates/offerTabs/job.html'
            }
          }
        //}
      //}
    })
    .state('menu.offreTabs.qualites', {
      url: '/qualites',
      views: {
        //'menuContent': {
          //views: {
            'offreTabs-qualites': {
              controller: 'offreTabsCtrl',
              templateUrl: 'templates/offerTabs/qualites.html'
            }
          }
        //}
      //}
    })
    .state('menu.offreTabs.langues', {
      url: '/langues',
      views: {
        //'menuContent': {
          //views: {
            'offreTabs-langues': {
              controller: 'offreTabsCtrl',
              templateUrl: 'templates/offerTabs/langues.html'
            }
          }
        //}
      //}
    })
    .state('menu.offreTabs.agenda', {
      url: '/agenda',
      views: {
        //'menuContent': {
          //views: {
            'offreTabs-agenda': {
              controller: 'offreTabsCtrl',
              templateUrl: 'templates/offerTabs/agenda.html'
            }
          }
        //}
      //}
    });
    $urlRouterProvider.otherwise('/menu/app');
});
