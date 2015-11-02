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
  .service('RDF', function($http) {

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
  .service('Citations', function($http,RDF) {
    
    var getCitations=function(citationStr){

      var listQuery="SELECT ?citation ?has_author ?has_citation_pubmed_identifier ?has_reviewer ?has_citation_source_type ?has_citation_source_level FROM <http://carre.kmi.open.ac.uk/beta> WHERE { \n\
             ?citation \n\
                    rdf:type risk:citation; \n\
                    risk:has_author ?has_author; \n\
                    risk:has_citation_pubmed_identifier ?has_citation_pubmed_identifier. \n\
              OPTIONAL { ?citation risk:has_citation_source_level ?has_citation_source_level }. \n\
              OPTIONAL { ?citation risk:has_reviewer ?has_reviewer }. \n\
              OPTIONAL { ?citation risk:has_citation_source_type ?has_citation_source_type } \n";
      if(citationStr)  listQuery+="FILTER (?citation = "+citationStr+") \n }"; else listQuery+="}";
      return RDF(listQuery);        
    };
    var insertCitation=function(citationObj){
      insertQuery="INSERT INTO  <http://carre.kmi.open.ac.uk/beta> { \n\
      <"+citationObj.citation.value+"> rdf:type risk:citation ; \n\
                          risk:has_author <"+citationObj.has_author.value+">; \n\
                          risk:has_citation_pubmed_identifier '"+citationObj.has_citation_pubmed_identifier.value+"'^^xsd:int ; \n\
                          risk:has_reviewer <"+citationObj.has_reviewer.value+">; \n\
            	            risk:has_citation_source_type '"+citationObj.has_citation_source_type.value+"'^^xsd:string; \n\
            	            risk:has_citation_source_level '"+citationObj.has_citation_source_level.value+"'^^xsd:int . \n\
    }";
    
    };
    var updateCitation=function(oldcitationObj,newcitationObj,archiveFlag){
      //for the shake of complexity do not find diff and just resplace the whole thing. i mean it!!
      var updateQuery="DELETE FROM <http://carre.kmi.open.ac.uk/beta> WHERE { \n\
                          <"+citationObj.citation.value+"> rdf:type risk:citation ; \n\
                          risk:has_author <"+citationObj.has_author.value+">; \n\
                          risk:has_citation_pubmed_identifier '"+citationObj.has_citation_pubmed_identifier.value+"'^^xsd:int ; \n\
                          risk:has_reviewer <"+citationObj.has_reviewer.value+">; \n\
            	            risk:has_citation_source_type '"+citationObj.has_citation_source_type.value+"'^^xsd:string; \n\
            	            risk:has_citation_source_level '"+citationObj.has_citation_source_level.value+"'^^xsd:int . \n\
                      } \n\
                      INSERT INTO  <http://carre.kmi.open.ac.uk/beta> { \n\
                          <"+citationObj.citation.value+"> rdf:type risk:citation ; \n\
                          risk:has_author <"+citationObj.has_author.value+">; \n\
                          risk:has_citation_pubmed_identifier '"+citationObj.has_citation_pubmed_identifier.value+"'^^xsd:int ; \n\
                          risk:has_reviewer <"+citationObj.has_reviewer.value+">; \n\
            	            risk:has_citation_source_type '"+citationObj.has_citation_source_type.value+"'^^xsd:string; \n\
            	            risk:has_citation_source_level '"+citationObj.has_citation_source_level.value+"'^^xsd:int . \n\
                      }";
            

      
    };
    return {
      'get':getCitations,
      'insert':insertCitation,
      'update':updateCitation
    }
  })
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider','$injector','$locationProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider,$injector,$locationProvider) {
    
    
    $locationProvider.html5Mode(false);
  
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
    });

    //$urlRouterProvider.otherwise('404_error');
    $urlRouterProvider.otherwise('dashboard');
    
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
      .state('500_error', {
        templateUrl: '500.html',
        url: '/500_error'
      })
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      })
  }]);
