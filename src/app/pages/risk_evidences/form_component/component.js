'use strict';

angular.module('CarreEntrySystem')

.directive('riskEvidenceForm', function() {
  return {
    templateUrl: 'app/pages/risk_evidences/form_component/form.html',
    restrict: 'E',
    replace: true,
    scope: {
      'model': '='
    },
    controller: function($rootScope, $scope, $state, $stateParams, Citations, Observables, Bioportal, Risk_factors, Risk_evidences, toastr,$timeout,Measurement_types,$q) {
      
      $scope.copyModel={};
      angular.copy($scope.model,$scope.copyModel);
      
      
      $scope.showLeEditor=false;
      $scope.model = $scope.model || {};
      $scope.bioportalAutocompleteResults = [];
      
      $scope.$on('citation:save',function(res){
        $scope.showAddCitation=false;
        
        // get citations
        Citations.get().then(function(res) {
          $scope.citations = res.data.map(function(obj) {
            var label=[];
            if(obj.has_citation_summary_label) label=obj.has_citation_summary_label.split('.');
            return {
              value: obj.id||"",
              pubmed:obj.has_citation_pubmed_identifier[0]||"",
              title: label[1].replace('; ','')||"",
              authors: label[0]||"",
              date: label[2]||""
            };
          });
           updateSelectedCitation();
        });
        
        // $state.go($state.current, $stateParams, {reload: true, inherit: false});
      })

      if ($scope.model.id) {

        /************** Edit Mode **************/
        console.info('---Edit---');


        //Init Form object
        $scope.risk_evidence = {
          observables: [],
          ratio_type:$scope.model.has_risk_evidence_ratio_type?$scope.model.has_risk_evidence_ratio_type[0]:"",
          ratio_value:$scope.model.has_risk_evidence_ratio_value?parseFloat($scope.model.has_risk_evidence_ratio_value[0]):0,
          confidence_interval_min:$scope.model.has_confidence_interval_min?parseFloat($scope.model.has_confidence_interval_min[0]):0,
          confidence_interval_max:$scope.model.has_confidence_interval_max?parseFloat($scope.model.has_confidence_interval_max[0]):0,
          risk_factor:$scope.model.has_risk_factor[0],
          pubmedId:$scope.model.has_risk_evidence_source_label,
          evidence_source:$scope.model.has_risk_evidence_source[0],
          condition: $scope.model.has_observable_condition,
          condition_json: angular.fromJson($scope.model.has_observable_condition_json[0]),
          condition_text: "",
          adjusted_for:[]
        };
        
        //init expression
        $scope.filter = $scope.risk_evidence.condition_json || {
          "group": {
            "operator": "AND",
            "rules": []
          }
        };


      }
      else {

        /************** Create Mode **************/
        console.info('---Create---');

        //init expression
        $scope.filter = {
          "group": {
            "operator": "AND",
            "rules": []
          }
        };
        
        
        //Init Form object
        $scope.risk_evidence = {
          observables:[],
          pubmedId:$scope.model.pubmedId||'',
          evidence_source: $scope.model.citation||'',
          risk_factor:'',
          condition_text: "",
          adjusted_for:[]
        };


      }
      
      $scope.adjusted_for=[];
    
      
      // function loadExternalData() {
      
        //Get combined requests done in an async way!
        $q.all([Observables.get(),Measurement_types.get()]).then(function(res){
          console.log('Promises',res);      
          
          //observables
          //auto select initial
          var selected=[];
          $scope.observables = res[0].data.map(function(obj) {
              
              var result= {
                value: obj.id_label,
                id: obj.id,
                label: obj.has_observable_name_label,
                metype_label: obj.has_observable_measurement_type_label,
                metype_id: obj.has_observable_measurement_type[0]
              };
              
              if($scope.model.id) {
                if($scope.model.has_risk_evidence_observable.indexOf(obj.id)>=0) selected.push(obj.id);
              }
              
              return result;
            });
          $scope.risk_evidence.observables=selected;
          
          
          $scope.output=removeOuterParenthesis(computed($scope.filter.group));
          
          //measurement types
          $scope.metypes=res[1].data;
          $scope.showLeEditor=true;
        })
        
        //get risk evidence adjusted for
        Risk_evidences.adjusted_for().then(function(res){
          console.log('adjusted_for',res);
          $scope.adjusted_for=res;
          
          //initial selection
          if($scope.model.is_adjusted_for instanceof Array) {
            $scope.risk_evidence.adjusted_for=$scope.model.is_adjusted_for[0].split(',').map(function(str){
              return str.trim().toLocaleLowerCase();
            });
          }
        });
        
        
        //get risk factors
        Risk_factors.get().then(function(res) {
          $scope.risk_factors = res.data.map(function(obj) {
              return {
                value: obj.id,
                label: obj.has_risk_factor_source_label+' ['+obj.has_risk_factor_association_type_label+'] '+obj.has_risk_factor_target_label
              };
            });
        });
        
        //get citations
        Citations.get().then(function(res) {
          $scope.citations = res.data.map(function(obj) {
            var label=[];
            if(obj.has_citation_summary_label) label=obj.has_citation_summary_label.split('.');
              return {
                value: obj.id||"",
                pubmed:obj.has_citation_pubmed_identifier[0]||"",
                title: label[1].replace('; ','')||"",
                authors: label[0]||"",
                date: label[2]||""
              };
            });
            updateSelectedCitation();
        });
        
      // }

      //ratio types
      $scope.ratiotypes = [{
        label: "Hazard ratio",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_ratio_type_hazard_ratio"
      }, {
        label: "Odds ratio",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_ratio_type_odds_ratio"
      }, {
        label: "Relative risk",
        value: "http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_evidence_ratio_type_relative_risk"
      }];
      
      
      //Save to RDF method
      $scope.saveModel = function() {
        //save condition text format
        $scope.risk_evidence.condition_text=$scope.output
          .replace(/<\/?[a-z][a-z0-9]*[^>]*>/ig, "")
          .replace(/&nbsp;/gi," ")
          .replace(/&amp;/gi,"&")
          .replace(/&quot;/gi,'"')
          .replace(/&lt;/gi,'<')
          .replace(/&gt;/gi,'>');
          
        //cleanse condition json format
        var condition_clean={};
        angular.copy($scope.filter,condition_clean);
        cleanseCondition(condition_clean);
        $scope.risk_evidence.condition_json=angular.toJson(condition_clean).toString().replace(/"/g, '\\"');
        
        Risk_evidences.save($scope.model, $scope.risk_evidence).then(function(res) {
          //success
          console.log('Risk Evidence saved', res);

          $scope.$emit('risk_evidence:save');
          toastr.success('<b>' + $scope.risk_evidence.pubmedId + '</b>' + ($scope.model.id ? ' has been updated' : ' has been created'), '<h4>Risk evidence saved</h4>');

        });
      };
      //Return back
      $scope.cancelForm = function() {
        $scope.$emit('risk_evidence:cancel');
      };

      
      
      /* LoadPubmed */
      $scope.loadPubmed=loadPubmed;
      function loadPubmed(){
        $scope.showPubmed=false;
        $timeout(function(){
          $scope.showPubmed=true;
          updateSelectedCitation();
        },200);
      }
      
      $scope.viewPubmed=function(item,model){
        //init Pubmed Fetch
        $scope.risk_evidence.pubmedId=item.pubmed;
        loadPubmed();
      };
      
      function updateSelectedCitation(){
        $timeout(function() {
          $scope.risk_evidence.evidence_source = $scope.CIbyPMID($scope.citations,$scope.risk_evidence.pubmedId);
        }, 0);
      }
      
      $scope.CIbyPMID=function(citations,pmid){
        if(!citations||!pmid) return null;
        else return citations.filter(function(ci){ return ci.pubmed === pmid; }).map(function(ci){ return ci.value;  })[0];  
      };

      // function htmlEntities(str) {
      //   return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      // }

      function computed(group) {
          if(!$scope.observables) return "";
          if (!group) return "";
          
          var str="(";
          for (var i = 0; i < group.rules.length; i++) {
              i > 0 && (str += " <b>" + group.operator + "</b> ");
              str += group.rules[i].group ?
                  computed(group.rules[i].group) :
                  getObservableName(group.rules[i].field) + " " + group.rules[i].condition + " " + group.rules[i].data;
          }
          return str +")";
      }
      
      function computedRaw(group) {
          if(!$scope.observables) return "";
          if (!group) return "";
          
          var str="(";
          for (var i = 0; i < group.rules.length; i++) {
              i > 0 && (str += " " + group.operator + " ");
              str += group.rules[i].group ?
                  computed(group.rules[i].group) :
                  group.rules[i].field + " " + group.rules[i].condition + " " + group.rules[i].data;
          }
          return str +")";
      }

      $scope.$watch('filter', function(newValue) {
        $scope.risk_evidence.condition_json = newValue;
        $scope.output = removeOuterParenthesis(computed(newValue.group, 0, {}));
        //calculate raw condition
        $scope.risk_evidence.condition = removeOuterParenthesis(computedRaw(newValue.group, 0, {}));
      }, true);

      
      function getObservableName(id){
        if (!id) return '';
        if($scope.observables) {
          var result=$scope.observables.filter(function(ob){
            return ob.value===id;
          });
          if(result.length>0){
            return "<a href='/observables/"+id+"'>"+result[0].label+"</a>";
          } else return '';
        }
        // return <carre-linker model="risk_evidence.current" property="{{field.value}}"></carre-linker>""
      }
      
      function removeOuterParenthesis(str){
        return str.substr(1,str.length-2);
      }
      
      function cleanseCondition(obj){
        if(obj.condition) {
          delete obj.hiddenData;
          delete obj.datatype;
          delete obj.unit_label;
          delete obj.dataoptions;
          delete obj.unit;
        } else {
          //group
          if(obj.group.rules) {
            obj.group.rules.forEach(function(condition){
              cleanseCondition(condition);
            });
          }
        }
      }
      
      console.info('Model: ', $scope.model);
      console.info('Form params: ', $scope.risk_evidence);
      
      //init Pubmed Fetch
      loadPubmed();
      // loadExternalData();
    }
  };
});
