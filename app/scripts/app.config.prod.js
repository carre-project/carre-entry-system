angular.module('CarreEntrySystem')
  .constant("CONFIG", {
    "API": "http://devices.carre-project.eu:443/ws/",
    "CARRE_DEVICES": "http://devices.carre-project.eu/devices/accounts/",
    'ENV': 'PROD'
  }).config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  });
  
  
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-XXXXX-X');
ga('send', 'pageview');
