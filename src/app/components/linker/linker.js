'use strict';

angular.module('CarreEntrySystem')
  .directive('carreLinker', function(CONFIG) {
    return {
      templateUrl: 'app/components/linker/linker.html',
      restrict: 'E',
      replace: true,
      scope: {
        'property': '@',
        'model': '='
      },
      controller: function($scope, CONFIG) {
        $scope.show = 'label';
        $scope.items = [];
        var label_arr = [];
        var avoidExpressions = ['has_observable_condition'];
        var arr = $scope.model[$scope.property];
        $scope.label = $scope.model[$scope.property + '_label'];
        if ($scope.property === 'has_observable_condition') {
          $scope.show='condition';
          
          // handle expressions first
          $scope.model['has_risk_evidence_observable'].forEach(function(obj,index){
            var id=obj.substr(obj.lastIndexOf('/')+1);
            var link=(CONFIG.ENV === 'PROD' ? '' : '#/') + 'observables/' + id;
            var label=$scope.model['has_risk_evidence_observable_label_arr'][index];
            //construct <a> tag
            var atag="<a href="+link+">"+label+"</a>";
            //replace all OB_* in the expression
            $scope.label=$scope.label.replace(new RegExp(id, 'g'), atag);
          });
          
        }
        else {
          // handle links
          if (arr instanceof Array && avoidExpressions.indexOf($scope.property) === -1) {
              
            label_arr = $scope.model[$scope.property + '_label_arr'];

            arr.forEach(function(str, index) {
              var id = str.substr(str.lastIndexOf('/') + 1);
              var cat = id.substr(0, 2);
              var type = false;
              switch (cat) {
                case 'CI':
                  // make label for observables
                  type = 'citations/';
                  break;
                case 'OB':
                  // make label for observables
                  type = 'observables/';
                  break;
                case 'ME':
                  // make label for measurent types
                  type = 'measurement_types/';
                  break;
                case 'RF':
                  // make label for risk factor                          
                  type = 'risk_factors/';
                  break;
                case 'RL':
                  // make label for risk element
                  type = 'risk_elements/';
                  break;
                case 'RV':
                  // make label for risk evidence
                  type = 'risk_evidences/';
                  break;
                default:
              }
              if (type) {
                $scope.show = 'links';
                $scope.items.push({
                  link: (CONFIG.ENV === 'PROD' ? '' : '#/') + type + id,
                  label: label_arr[index]
                });
              }

            });
          }
        }
        //debug
        // console.log('Label:',$scope.label,($scope.showlink?'link':'text'));
      }
    };
  });