(function() {
  'use strict';
  
  angular
    .module('CarreEntrySystem')
    .constant("CONFIG", {
      "currentUser":{},
      "USECACHE":false,
      "AllowDelete":true,
      "useOfflineMode":true,
      "ENV": "DEV"
    })
    .config(function($locationProvider, $compileProvider, $urlRouterProvider) {

      //show home page on error
      $urlRouterProvider.otherwise( function($injector) {
        var $state = $injector.get("$state");
        $state.go('main.dashboard');
      });
      
      //Set url handler  
      $locationProvider.html5Mode(false);

      // Enable log
      $compileProvider.debugInfoEnabled(true);
      
      
      //load the google analytics only in production

      
      
    });

})();
