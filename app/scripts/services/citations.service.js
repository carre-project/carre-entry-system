angular.module('CarreEntrySystem').service('Citations', function($http, RDF) {

  var getCitations = function(citationStr) {

    var listQuery = "SELECT ?citation ?has_author ?has_citation_pubmed_identifier ?has_reviewer ?has_citation_source_type ?has_citation_source_level \n\
            FROM <http://carre.kmi.open.ac.uk/beta> WHERE { \n\
             ?citation \n\
                    rdf:type risk:citation; \n\
                    risk:has_author ?has_author; \n\
                    risk:has_citation_pubmed_identifier ?has_citation_pubmed_identifier. \n\
              OPTIONAL { ?citation risk:has_citation_source_level ?has_citation_source_level }. \n\
              OPTIONAL { ?citation risk:has_reviewer ?has_reviewer }. \n\
              OPTIONAL { ?citation risk:has_citation_source_type ?has_citation_source_type } \n";

    //add filter to query if a single citation is requested
    if (citationStr) listQuery += "FILTER (?citation = " + citationStr + ") \n }";
    else listQuery += "}";

    return RDF(listQuery);
  };

  var insertCitation = function(citationObj) {

    var insertQuery = "INSERT INTO  <http://carre.kmi.open.ac.uk/beta> { \n\
      <" + citationObj.citation.value + "> rdf:type risk:citation ; \n\
                          risk:has_author <" + citationObj.has_author.value + ">; \n\
                          risk:has_citation_pubmed_identifier '" + citationObj.has_citation_pubmed_identifier.value + "'^^xsd:int ; \n\
                          risk:has_reviewer <" + citationObj.has_reviewer.value + ">; \n\
            	            risk:has_citation_source_type '" + citationObj.has_citation_source_type.value + "'^^xsd:string; \n\
            	            risk:has_citation_source_level '" + citationObj.has_citation_source_level.value + "'^^xsd:int . \n\
    }";

  };

  var updateCitation = function(oldCitationObj, newCitationObj, archiveFlag) {

    //for the shake of complexity do not find diff and just resplace the whole thing. i mean it!!
    var updateQuery = "DELETE FROM <http://carre.kmi.open.ac.uk/beta> WHERE { \n\
                          <" + oldCitationObj.citation.value + "> rdf:type risk:citation ; \n\
                          risk:has_author <" + oldCitationObj.has_author.value + ">; \n\
                          risk:has_citation_pubmed_identifier '" + oldCitationObj.has_citation_pubmed_identifier.value + "'^^xsd:int ; \n\
                          risk:has_reviewer <" + oldCitationObj.has_reviewer.value + ">; \n\
            	            risk:has_citation_source_type '" + oldCitationObj.has_citation_source_type.value + "'^^xsd:string; \n\
            	            risk:has_citation_source_level '" + oldCitationObj.has_citation_source_level.value + "'^^xsd:int . \n\
                      } \n\
                      INSERT INTO  <http://carre.kmi.open.ac.uk/beta> { \n\
                          <" + newCitationObj.citation.value + "> rdf:type risk:citation ; \n\
                          risk:has_author <" + newCitationObj.has_author.value + ">; \n\
                          risk:has_citation_pubmed_identifier '" + newCitationObj.has_citation_pubmed_identifier.value + "'^^xsd:int ; \n\
                          risk:has_reviewer <" + newCitationObj.has_reviewer.value + ">; \n\
            	            risk:has_citation_source_type '" + newCitationObj.has_citation_source_type.value + "'^^xsd:string; \n\
            	            risk:has_citation_source_level '" + newCitationObj.has_citation_source_level.value + "'^^xsd:int . \n\
                      }";

  };
  
  
  return {
    'get': getCitations,
    'insert': insertCitation,
    'update': updateCitation
  }
});