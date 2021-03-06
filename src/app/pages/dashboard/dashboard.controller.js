(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController($rootScope, $timeout, toastr, CARRE, $location, CONFIG, $scope,Email) {
    var vm = this;

    //graph init
    vm.countAllInit = 0;
    vm.countAll = 0;
  
    vm.colors=CONFIG.COLORS;
    console.log(vm.colors);
    vm.counterchart_labels = [
      // "Medical Experts",
      "Risk Factors",
      "Risk Evidences",
      "Risk Elements",
      "Observables",
      "Citations"
      // "Measurement Types",
    ];
    vm.counterchart_data=[];
    vm.counterchart_data[0] = [0,0,0,0,0];
    
    //event on create method
    $scope.$on('create', function (event, chart) {
      // set colors for each bar
      if(chart && chart.datasets && chart.datasets[0] && chart.datasets[0].bars.length>0){
        chart.datasets[0].bars.map(function(obj,index){
          obj.fillColor=vm.colors[index];
          obj.strokeColor="#FFF";
          return obj;
        });
      } else {
        Email.bug({title:'chart datasets not exist',data:chart.datasets[0]});
        console.log('chart datasets not exist');
        $timeout(function(){
        chart.datasets[0].bars.map(function(obj,index){
          obj.fillColor=vm.colors[index];
          obj.strokeColor="#FFF";
          return obj;
        });
      },200);
      }
    });

    //get total and unreviewed elements 
    
    CARRE.countAll().then(function(res){
      var r=res.data[0];
      console.log('Counter data:',r);
      
      vm.citations = {
        total:Number(r.citations.value)
      };
      vm.measurement_types = {
        total:Number(r.measurement_types.value)
      };
      vm.observables = {
        total:Number(r.observables.value),
        noreviews:Number(r.observables_unreviewed.value)
      };
      vm.risk_elements = {
        total:Number(r.risk_elements.value),
        noreviews:Number(r.risk_elements_unreviewed.value)
      };
      vm.risk_evidences = {
        total:Number(r.risk_evidences.value),
        noreviews:Number(r.risk_evidences_unreviewed.value)
      };
      vm.risk_factors = {
        total:Number(r.risk_factors.value),
        noreviews:Number(r.risk_factors_unreviewed.value)
      };
      // vm.medical_experts = {
      //   total:Number(r.risk_factors.value),
      //   noreviews:Number(r.risk_factors_unreviewed.value)
      // };
      
      //set data for the graph
      vm.counterchart_data[0][0]=vm.risk_factors.total;
      vm.counterchart_data[0][1]=vm.risk_evidences.total;
      vm.counterchart_data[0][2]=vm.risk_elements.total;
      vm.counterchart_data[0][3]=vm.observables.total;
      // vm.counterchart_data[0][0]=vm.measurement_types.total;
      vm.counterchart_data[0][4]=vm.citations.total;
      
      //set top counter
      vm.countAll = vm.citations.total+
                    vm.risk_elements.total+
                    vm.risk_factors.total+
                    vm.risk_evidences.total+
                    vm.observables.total+
                    vm.measurement_types.total;
                    
                    
      /* Donut graph temp */
    vm.counterdonut_data=[
      vm.risk_factors.total,
      vm.risk_evidences.total,
      vm.risk_elements.total,
      vm.observables.total,
      vm.citations.total
    ];
    vm.counterdonut_labels=vm.counterchart_labels;
    vm.counterdonut_options={};
    
    });

    
  }
})();
