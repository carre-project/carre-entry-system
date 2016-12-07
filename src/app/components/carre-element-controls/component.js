'use strict';

angular.module('CarreEntrySystem')
	.directive('carreElementControls',function(){
		return {
            templateUrl:'app/components/carre-element-controls/template.html',
            restrict: 'E',
            replace: true,
            bindToController: {
                'carreId': '@'
            },
            controllerAs:'controls',
            scope: true,
            controller:function(CONFIG){
                this.dev = CONFIG.AllowDelete;
                this.user = CONFIG.currentUser.username;
            }
    	}
	});


