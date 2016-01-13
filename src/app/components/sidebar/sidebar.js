'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
  .directive('sidebar',sidebarDirective);
  
  function sidebarDirective() {
    return {
      templateUrl:'app/components/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
        collapsed:'='
      },
      controller:function($scope){
             
        $scope.slideWidth=(window.innerWidth>730)?window.innerWidth*0.4:window.innerWidth*0.9;
        
        $(window).resize(function(){
            if($scope.showAbout) { 
              // console.log('Width changed', window.innerWidth);
              $scope.slideWidth=(window.innerWidth>730)?window.innerWidth*0.4:window.innerWidth*0.9;
              $scope.$apply(function(){ $scope.showAbout=false;  });
              $scope.$apply(function(){ $scope.showAbout=true;  });
            }
        });
        
        // $scope.showAbout=false;
        // $scope.selectedMenu = 'dashboard';
        // $scope.collapseVar = 0;
        // $scope.multiCollapseVar = 0;
        
        // $scope.check = function(x){
          
        //   if(x==$scope.collapseVar)
        //     $scope.collapseVar = 0;
        //   else
        //     $scope.collapseVar = x;
        // };
        
        // $scope.multiCheck = function(y){
          
        //   if(y==$scope.multiCollapseVar)
        //     $scope.multiCollapseVar = 0;
        //   else
        //     $scope.multiCollapseVar = y;
        // };
      }
    };
  };
