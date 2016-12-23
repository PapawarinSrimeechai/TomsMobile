// Ionic Starter App
var db = null;
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'ngMaterial', 'ngCordova', 'ngStorage', 'angular-md5', 'ngCordova.plugins.nativeStorage'])

app.run(function($ionicPlatform, DatabaseSQLite, APIService, $cordovaSQLite, WLog, $cordovaNativeStorage) {
    $ionicPlatform.ready(function() {
        ////////////
        $cordovaNativeStorage.getItem('test').then(function(value) {    
            console.info(value);    
            alert(value.id);  
        }, function(error) {     console.error(error);     });
        ///////////
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        DatabaseSQLite.connect();
        WLog.clearlog(function(clog_status) {
            console.log("clearlog status : " + clog_status);
        });

    });

    // Animate.css && Wow.js
    new WOW().init();
    $.fn.extend({
        animateCss: function(animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
            });
        }
    });
});

app.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, $ionicConfigProvider, $httpProvider) {
    $ionicConfigProvider.views.maxCache(0);

    $httpProvider.defaults.timeout = 300000; // 5 miniute

    $mdThemingProvider.theme('default')
        .primaryPalette('indigo');

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.loading', {
        cache: false,
        url: '/loading',
        views: {
            'menuContent': {
                templateUrl: 'templates/loading.html',
                controller: 'LoadingCtrl'
            }
        }
    })

    .state('app.login', {
        cache: false,
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.start', {
        cache: false,
        url: '/start',
        views: {
            'menuContent': {
                templateUrl: 'templates/start.html',
                controller: 'StartCtrl'
            }
        }
    })

    .state('app.pickup', {
        cache: false,
        url: '/pickup',
        views: {
            'menuContent': {
                templateUrl: 'templates/pickup.html',
                controller: 'PickupCtrl'
            }
        }
    })

    .state('app.pickup-take-photo', {
        cache: false,
        url: '/pickup-take-photo',
        views: {
            'menuContent': {
                templateUrl: 'templates/pickup-take-photo.html',
                controller: 'PickupTakePhotoCtrl'
            }
        }
    })

    .state('app.pickup-loading', {
        cache: false,
        url: '/pickup-loading',
        views: {
            'menuContent': {
                templateUrl: 'templates/pickup-loading.html',
                controller: 'PickupLoadingCtrl'
            }
        }
    })

    .state('app.pickup-loading-take-photo', {
        cache: false,
        url: '/pickup-loading-take-photo',
        views: {
            'menuContent': {
                templateUrl: 'templates/pickup-loading-take-photo.html',
                controller: 'PickupLoadingTakePhotoCtrl'
            }
        }
    })

    .state('app.on-the-way', {
        cache: false,
        url: '/on-the-way',
        views: {
            'menuContent': {
                templateUrl: 'templates/on-the-way.html',
                controller: 'OnTheWayCtrl'
            }
        }
    })

    .state('app.delivery', {
        cache: false,
        url: '/delivery',
        views: {
            'menuContent': {
                templateUrl: 'templates/delivery.html',
                controller: 'DeliveryCtrl'
            }
        }
    })

    .state('app.delivery-take-photo', {
        cache: false,
        url: '/delivery-take-photo',
        views: {
            'menuContent': {
                templateUrl: 'templates/delivery-take-photo.html',
                controller: 'DeliveryTakePhotoCtrl'
            }
        }
    })

    .state('app.load-product', {
        cache: false,
        url: '/loadproduct',
        views: {
            'menuContent': {
                templateUrl: 'templates/load-product.html',
                controller: 'LoadProductCtrl'
            }
        }
    })

    .state('app.delivery-loading', {
        cache: false,
        url: '/delivery-loading',
        views: {
            'menuContent': {
                templateUrl: 'templates/delivery-loading.html',
                controller: 'DeliveryLoadingCtrl'
            }
        }
    })

    .state('app.delivery-loading-take-photo', {
        cache: false,
        url: '/delivery-loading-take-photo',
        views: {
            'menuContent': {
                templateUrl: 'templates/delivery-loading-take-photo.html',
                controller: 'DeliveryLoadingTakePhotoCtrl'
            }
        }
    })

    .state('app.broken-list', {
        cache: false,
        url: '/broken-list',
        views: {
            'menuContent': {
                templateUrl: 'templates/broken-list.html',
                controller: 'BrokenListCtrl'
            }
        }
    })

    .state('app.broken-reason', {
        cache: false,
        url: '/broken-reason',
        views: {
            'menuContent': {
                templateUrl: 'templates/broken-reason.html',
                controller: 'BrokenReasonCtrl'
            }
        }
    })

    .state('app.broken-take-photo', {
        cache: false,
        url: '/broken-take-photo',
        views: {
            'menuContent': {
                templateUrl: 'templates/broken-take-photo.html',
                controller: 'BrokenTakePhotoCtrl'
            }
        }
    })

    .state('app.otp', {
        cache: false,
        url: '/otp',
        views: {
            'menuContent': {
                templateUrl: 'templates/otp.html',
                controller: 'OtpCtrl'
            }
        }
    })

    .state('app.container-return-list', {
        cache: false,
        url: '/container-return-list',
        views: {
            'menuContent': {
                templateUrl: 'templates/container-return-list.html',
                controller: 'ContainerReturnListCtrl'
            }
        }
    })

    .state('app.config', {
        cache: false,
        url: '/config',
        views: {
            'menuContent': {
                templateUrl: 'templates/config.html',
                controller: 'ConfigController'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/config');
});

app.controller("ConfigController", function(DatabaseSQLite, $scope, $ionicPlatform, $ionicLoading, $location, $ionicHistory, $cordovaSQLite) {
    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });
    $ionicPlatform.ready(function() {
        DatabaseSQLite.connect();
        DatabaseSQLite.createTB();
        DatabaseSQLite.insertTest();
        $location.path("/app/loading");
    });
});
