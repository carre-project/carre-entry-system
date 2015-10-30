'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('CarreEntrySystem')
  .controller('MainCtrl', function($scope,$position,CarreQuery) {
    var citation='<http://carre.kmi.open.ac.uk/citations/15385656>';
    var citationQuery="SELECT ?citation ?has_author ?has_citation_pubmed_identifier ?has_reviewer ?has_citation_source_type ?has_citation_source_level FROM <http://carre.kmi.open.ac.uk/beta> WHERE { \n\
             ?citation \n\
                    rdf:type risk:citation; \n\
                    risk:has_author ?has_author; \n\
                    risk:has_citation_pubmed_identifier ?has_citation_pubmed_identifier. \n\
              OPTIONAL { ?citation risk:has_citation_source_level ?has_citation_source_level }. \n\
              OPTIONAL { ?citation risk:has_reviewer ?has_reviewer }. \n\
              OPTIONAL { ?citation risk:has_citation_source_type ?has_citation_source_type } \n\
              FILTER (?citation = "+citation+") \n\
            }";
    
    CarreQuery(citationQuery).success(function(data) {
        
        
        console.log('Raw Data: ',data); 
        var results=data;
        // =========== transformation lib===========//
        /* converts triples to nested object with properties as arrays of values */
        
        // var results = []; //final object array
        // var items = []; //ids for
        // data.forEach(function(triple) {

        //   var prop = triple.predicate.value.split('#')[1] || '_';
        //   if (items.indexOf(triple.subject.value) === -1) {
        //     items.push(triple.subject.value);
        //     var obj = {
        //       id: triple.subject.value
        //     };
        //     obj[prop] = obj[prop] || [];
        //     obj[prop].push(triple.object.value);
        //     results.push(obj);
        //   }
        //   else {
        //     results[items.indexOf(triple.subject.value)][prop] = results[items.indexOf(triple.subject.value)][prop] || [];
        //     results[items.indexOf(triple.subject.value)][prop].push(triple.object.value);
        //   }
        // });
        // console.log(results);
        
        // =========== transformation lib===========//
        
        $scope.queryResult={
          'error': false,
          'data': results
        }
      }).error(function(err) {
        $scope.queryResult={
          'error': true,
          'data': err
        }
      })
      
      
    
  });
