'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('CarreEntrySystem')
	.directive('headerNotification',function(){
		return {
        templateUrl:'app/components/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true
    	}
	});


