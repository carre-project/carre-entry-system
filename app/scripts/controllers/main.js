'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('CarreEntrySystem')
  .controller('MainCtrl', function($scope,$position,Citations,User,$location,CONFIG) {
    $scope.user=User();
    $scope.config=CONFIG;
    //clean up the browser url
    $location.url('/').replace();
    var baseUrl = $location.absUrl();
    
    //set up the urls 
    $scope.loginUrl = CONFIG.CARRE_DEVICES + 'login?next=' + baseUrl;
    $scope.logoutUrl = CONFIG.CARRE_DEVICES + 'logout?next=' + baseUrl;


    // $scope.user=User.login
    $scope.goto='dashboard.home';
    
    var citation='<http://carre.kmi.open.ac.uk/citations/15385656>';
    
    Citations.get().success(function(data) {
        
        
        console.log('Raw Data: ',data); 
        
        $scope.queryResult={
          'error': !(data instanceof Array),
          'data': data
        }
    });
      
      
    
  });
