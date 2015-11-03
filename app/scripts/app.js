'use strict';
/**
 * @ngdoc overview
 * @name CarreEntrySystem
 * @description
 * # CarreEntrySystem
 *
 * Main module of the application.
 */
angular.module('CarreEntrySystem', [
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngTouch'
  ]).config(function($stateProvider, $urlRouterProvider) {
    
  
    //$urlRouterProvider.otherwise('404_error');
    $urlRouterProvider.otherwise('/dashboard/home');
    
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
        }
      })
      .state('dashboard.home', {
        url: '/home',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/home.html',
        resolve: {
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
  });
