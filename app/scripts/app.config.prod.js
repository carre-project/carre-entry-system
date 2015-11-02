angular.module('CarreEntrySystem')
  .constant("CONFIG", {
    "API": "http://devices.carre-project.eu:443/ws/",
    "CARRE_DEVICES": "http://devices.carre-project.eu/devices/accounts/",
    'ENV': 'PROD'
  }).config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  });
