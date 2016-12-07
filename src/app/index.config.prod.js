(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant("CONFIG", {    
      "currentUser":{},
      "USECACHE":false,
      "ENV": "PROD",
      "useOfflineMode":true,
      "AllowDelete":true,
    }).config(function($locationProvider, $compileProvider, $urlRouterProvider) {
      
      //show error
      $urlRouterProvider.otherwise( function($injector) {
        var $state = $injector.get("$state");
        $state.go('404_error');
      });
      
      //Set url handler  
      $locationProvider.html5Mode(true);
      
      // Disable log
      $compileProvider.debugInfoEnabled(false);
      
      //load the google analytics only in production
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-60507179-2', 'auto');
      ga('send', 'pageview');
  
    });

})();
