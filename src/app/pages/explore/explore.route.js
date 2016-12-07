/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    $stateProvider
      .state('main.explore', {
        controller: 'ExploreController',
        controllerAs: 'explore',
        url: '/explore',
        templateUrl: 'app/pages/explore/index.html'
      })
      // .state('main.mineLiterature', {
      //   controller: function(){},
      //   url: '/mine-literature',
      //   templateUrl: 'app/pages/explore/mine-literature.html'
      // });
  }

})();
