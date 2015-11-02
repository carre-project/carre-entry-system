angular.module('CarreEntrySystem').service('RDF', function($http,CONFIG) {

    var PREFIXSTR = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n\
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
                    PREFIX sensors: <http://carre.kmi.open.ac.uk/ontology/sensors.owl#> \n\
                    PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#> \n\
                    PREFIX carreManufacturer: <http://carre.kmi.open.ac.uk/manufacturers/> \n\
                    PREFIX carreUsers: <https://carre.kmi.open.ac.uk/users/> \n";

    return function(sparqlQuery) {

        //add prefixes
        sparqlQuery = PREFIXSTR + sparqlQuery;
        console.log('Final query: ', sparqlQuery);

        return $http.post(CONFIG.API + 'query', {
            'sparql': sparqlQuery,
            'token': CONFIG.TEST_TOKEN
        });
    };
});