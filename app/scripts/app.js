'use strict';
/**
 * @ngdoc overview
 * @name CarreEntrySystem
 * @description
 * # CarreEntrySystem
 *
 * Main module of the application.
 */
angular
  .module('CarreEntrySystem', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
  ])
  .service('CarreQuery', function($http) {

    var API = 'http://beta.carre-project.eu:5050/carre.kmi.open.ac.uk:443/ws/'; // http://carre.kmi.open.ac.uk:443/ws/  
    var TOKEN = '0213be219dc1821eb2f7b0bbc7c8a6cbe3c3559b';
    var PREFIXSTR= "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n\
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
                    PREFIX sensors: <http://carre.kmi.open.ac.uk/ontology/sensors.owl#> \n\
                    PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#> \n\
                    PREFIX carreManufacturer: <http://carre.kmi.open.ac.uk/manufacturers/> \n\
                    PREFIX carreUsers: <https://carre.kmi.open.ac.uk/users/> \n";
                    
    return function(sparqlQuery) {
      
      //add prefixes
      sparqlQuery=PREFIXSTR+sparqlQuery;
      console.log('Final query: ',sparqlQuery);
      
      return $http.post(API + 'query', {
        'sparql': sparqlQuery,
        'token': TOKEN
      });
    };
  })
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider','$injector','$locationProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider,$injector,$locationProvider) {
    
    
    $locationProvider.html5Mode(false).hashPrefix('!');
  
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
    });

    $urlRouterProvider.otherwise('dashboard/home');
    
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
          loadMyDirectives: function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: [
                  'scripts/directives/header/header.js',
                  'scripts/directives/header/header-notification/header-notification.js',
                  'scripts/directives/sidebar/sidebar.js',
                  'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                ]
              }),
              $ocLazyLoad.load({
                name: 'toggle-switch',
                files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                  "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                ]
              }),
              $ocLazyLoad.load({
                name: 'ngAnimate',
                files: ['bower_components/angular-animate/angular-animate.js']
              })
              $ocLazyLoad.load({
                name: 'ngCookies',
                files: ['bower_components/angular-cookies/angular-cookies.js']
              })
              $ocLazyLoad.load({
                name: 'ngResource',
                files: ['bower_components/angular-resource/angular-resource.js']
              })
              $ocLazyLoad.load({
                name: 'ngSanitize',
                files: ['bower_components/angular-sanitize/angular-sanitize.js']
              })
              $ocLazyLoad.load({
                name: 'ngTouch',
                files: ['bower_components/angular-touch/angular-touch.js']
              })
          }
        }
      })
      .state('dashboard.home', {
        url: '/home',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/home.html',
        resolve: {
          loadMyFiles: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: [
                'scripts/controllers/main.js',
                'scripts/directives/timeline/timeline.js',
                'scripts/directives/notifications/notifications.js',
                'scripts/directives/chat/chat.js',
                'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
      })
      .state('dashboard.form', {
        templateUrl: 'views/form.html',
        url: '/form'
      })
      .state('dashboard.blank', {
        templateUrl: 'views/pages/blank.html',
        url: '/blank'
      })
      .state('login', {
        templateUrl: 'views/pages/login.html',
        url: '/login'
      })
      .state('dashboard.chart', {
        templateUrl: 'views/chart.html',
        url: '/chart',
        controller: 'ChartCtrl',
        resolve: {
          loadMyFile: function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name: 'chart.js',
                files: [
                  'bower_components/angular-chart.js/dist/angular-chart.min.js',
                  'bower_components/angular-chart.js/dist/angular-chart.css'
                ]
              }),
              $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: ['scripts/controllers/chartContoller.js']
              })
          }
        }
      })
      .state('dashboard.table', {
        templateUrl: 'views/table.html',
        url: '/table'
      })
      .state('dashboard.panels-wells', {
        templateUrl: 'views/ui-elements/panels-wells.html',
        url: '/panels-wells'
      })
      .state('dashboard.buttons', {
        templateUrl: 'views/ui-elements/buttons.html',
        url: '/buttons'
      })
      .state('dashboard.notifications', {
        templateUrl: 'views/ui-elements/notifications.html',
        url: '/notifications'
      })
      .state('dashboard.typography', {
        templateUrl: 'views/ui-elements/typography.html',
        url: '/typography'
      })
      .state('dashboard.icons', {
        templateUrl: 'views/ui-elements/icons.html',
        url: '/icons'
      })
      .state('dashboard.grid', {
        templateUrl: 'views/ui-elements/grid.html',
        url: '/grid'
      })
  }]);
