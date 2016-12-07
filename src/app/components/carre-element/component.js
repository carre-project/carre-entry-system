'use strict';

angular.module('CarreEntrySystem')
  .directive('carreElement', function(CONFIG) {
    return {
      templateUrl: 'app/components/carre-element/template.html',
      restrict: 'E',
      replace: true,
      scope:{
        'type': '@',
        'mode': '@',
        'elemId': '@',
        'elem': '=',
        'notFields': '@',
        'hidePubmed': '@'
      },
      controller: function($rootScope, $state, $scope, $timeout, content, CONFIG, VisibleFields, Observables, Risk_elements, Risk_factors, Measurement_types, Citations, Medical_experts, Risk_evidences) {
        
        var vm = $scope;
        vm.current = vm.elem || {};
          
        vm.notFields = vm.notFields || '';
        if(vm.elemId) {
          //init
          renderElement(vm.type,vm.elemId);
          //setup watcher
          // WATCHER delete before restart;
          if($rootScope.elementViewerWatcher) $rootScope.elementViewerWatcher();
          $rootScope.elementViewerWatcher=$scope.$watch('elemId',
            function(newId,oldId){ if(newId && newId.length>=2 && newId !== oldId) { renderElement(vm.type,newId);  }
          });
          
        } else if(vm.type&&vm.elem) {
            renderTempElement(vm.type,vm.elem);
        }
        
        // =========MAIN function==============
        
        function renderElement(type,id) {
          type = type || content.typeFromId(id).raw;
          vm.type=type;
          console.log("Element ID: ",id);
          console.log("Element sub: ", id.substring(0,2));
          
          //setup type
          switch (type) {
            case 'risk_element':
              if(id.substring(0,2)!=="RL") $state.go("404_error");
              else getRisk_element(id);
              break;
            case 'risk_factor':
              if(id.substring(0,2)!=="RF") $state.go("404_error");
              else getRisk_factor(id);
              break;
            case 'risk_evidence':
              if(id.substring(0,2)!=="RV") $state.go("404_error");
              else getRisk_evidence(id);
              break;
            case 'observable':
              if(id.substring(0,2)!=="OB") $state.go("404_error");
              else getObservable(id);
              break;
            case 'citation':
              if(id.substring(0,2)!=="CI") $state.go("404_error");
              else getCitation(id);
              break;
            case 'measurement_type':
              if(id.substring(0,2)!=="ME") $state.go("404_error");
              else getMeasurement_type(id);
              break;
            case 'medical_expert':
              // code
              break;
            
            default:
            console.log("Type not found :", type);
            $state.go("404_error");
          }
        }
        
        
        // =========== Fetching functions for each element ==========
        
        function renderTempElement(type,data) {
          var visibleFields=VisibleFields(type,'single',vm.notFields.split(','));
            vm.current = data;
            vm.fields = visibleFields.map(function(field) {
              return {
                value: field,
                label: content.labelOf(field)
              };
            });
            vm.rdf_source = rdfSource(vm.current.id);
          
        }
        
        
        // =========== Fetching functions for each element ==========
        
        function getRisk_element(id) {
          var visibleFields=VisibleFields('risk_element','single',vm.notFields.split(','));
          vm.loading=Risk_elements.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
              vm.rdf_source = rdfSource(vm.current.id);
          
            }
          });
        }
        function getRisk_factor(id) {
          var visibleFields=VisibleFields('risk_factor','single',vm.notFields.split(','));
          vm.loading=Risk_factors.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
              vm.rdf_source = rdfSource(vm.current.id);
          
            }
          });
        }
        function getRisk_evidence(id) {
          var visibleFields=VisibleFields('risk_evidence','single',vm.notFields.split(','));
          vm.loading=Risk_evidences.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.current.pubmedId = $scope.hidePubmed?false:res.data[0].has_risk_evidence_source_label;
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
              vm.rdf_source = rdfSource(vm.current.id);
          
            } else {
             console.log("No risk_evidence with id:",id); 
            }
          });
        }
        function getCitation(id) {
          var visibleFields=VisibleFields('citation','single',vm.notFields.split(','));
          vm.loading=Citations.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.current.pubmedId = $scope.hidePubmed?false:res.data[0].has_citation_pubmed_identifier_label;
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
              vm.rdf_source = rdfSource(vm.current.id);
          
            }
          });
        }
        function getObservable(id) {
          var visibleFields=VisibleFields('observable','single',vm.notFields.split(','));
          vm.loading=Observables.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
              vm.rdf_source = rdfSource(vm.current.id);
          
            }
          });
        }
        
        function getMeasurement_type(id) {
          var visibleFields=VisibleFields('measurement_type','single',vm.notFields.split(','));
          vm.loading=Measurement_types.get([id]).then(function(res) {
            if (res.data) {
              vm.current = res.data[0];
              vm.fields = visibleFields.map(function(field) {
                return {
                  value: field,
                  label: content.labelOf(field)
                };
              });
              
              vm.rdf_source = rdfSource(vm.current.id);
          
            }
          });
        }
        
        function rdfSource(id){
          // return 'https://devices.duth.carre-project.eu/sparql?query=DESCRIBE%20%3C'+id+'%3E&format=text/plain';
          return 'https://'+
            CONFIG.CARRE_API_URL.substring(CONFIG.CARRE_API_URL.indexOf('://')+3,CONFIG.CARRE_API_URL.indexOf('/ws'))+
            '/sparql?query=DESCRIBE%20%3C'+id+'%3E&format=text/plain';
        }
        
      }
    };
  });
