'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('CarreEntrySystem')
  .controller('MainCtrl', function($scope,$position,Citations) {
    
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
