angular.module('CarreEntrySystem')
  .constant("CONFIG", {
    "API": "http://beta.carre-project.eu:5050/carre.kmi.open.ac.uk:443/ws/",
    "CARRE_DEVICES": "http://devices.carre-project.eu/devices/accounts/",
    "TEST_TOKEN": "0213be219dc1821eb2f7b0bbc7c8a6cbe3c3559b",
    'ENV': 'DEV'
  }).config(function($locationProvider) {
    $locationProvider.html5Mode(false);
  });
