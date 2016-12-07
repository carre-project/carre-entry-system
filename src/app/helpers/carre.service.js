angular.module('CarreEntrySystem').service('CARRE', function($http, CONFIG, Auth, RdfFormatter,$q,toastr,$state,$cacheFactory, QUERY, Email,$rootScope) {

  this.exports = {
    // 'count': countInstance,
    'countAll': countAllInstances,
    'query': apiQuery,
    'cacheQuery': cacheQuery,
    'invalidateCache': invalidateCache,
    'selectQuery': selectQuery,
    'instances': queryInstances,
    'search': searchInstances,
    'delete': deleteInstance
  };
  

  /*
    PREFIX carreManufacturer: <http://carre.kmi.open.ac.uk/manufacturers/> \n\
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
    PREFIX sensors: <http://carre.kmi.open.ac.uk/ontology/sensors.owl#> \n\
  */
  /* The prefixes for CARRE*/
  var PREFIXSTR = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
PREFIX carreUsers: <https://carre.kmi.open.ac.uk/users/> \n\
PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#> \n\
PREFIX ME: <http://carre.kmi.open.ac.uk/measurement_types/> \n\
PREFIX OB: <http://carre.kmi.open.ac.uk/observables/> \n\
PREFIX RL: <http://carre.kmi.open.ac.uk/risk_elements/> \n\
PREFIX RV: <http://carre.kmi.open.ac.uk/risk_evidences/> \n\
PREFIX RF: <http://carre.kmi.open.ac.uk/risk_factors/> \n\
PREFIX RW: <http://carre.kmi.open.ac.uk/risk_reviews/> \n\
PREFIX MD: <http://carre.kmi.open.ac.uk/medical_experts/> \n\
PREFIX CI: <http://carre.kmi.open.ac.uk/citations/> \n";


  function deleteInstance(id){
    console.log(QUERY.prefix(id));
    var query = "WITH " + CONFIG.CARRE_ARCHIVE_GRAPH + " DELETE { <"+QUERY.prefix(id)+"> ?s ?p .  }  WHERE { <"+QUERY.prefix(id)+"> ?s ?p .}";
    return apiQuery(query);
  /*               
      OPTIONAL {    \n\
                 ?object risk:includes_risk_element ?includes_risk_element. \n\
                 ?includes_risk_element risk:has_risk_element_name ?includes_risk_element_name. \n\
                } \n\
                */
                
                /*
                Another delete query
                
                
                PREFIX risk: <http://carre.kmi.open.ac.uk/ontology/risk.owl#>
PREFIX OB: <http://carre.kmi.open.ac.uk/observables/>
#select ?ob ?predicate FROM <http://carre.kmi.open.ac.uk/riskdata> WHERE { ?ob a risk:observable; risk:has_external_predicate ?predicate. FILTER (?ob=OB:OB_5 || ?ob=OB:OB_6) }

WITH <http://carre.kmi.open.ac.uk/public> DELETE { OB:OB_5 risk:has_external_predicate ?p .  }  WHERE { OB:OB_5 risk:has_external_predicate ?p .}

                */
  }
  
  
  

  function searchInstances(type, term) {
    if(!type||!term) {
      throw "CARRE Error: Cannot search without type and term!";
    } 
    var listQuery = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
             ?subject a risk:" + type + "; ?predicate ?object. \n\
              OPTIONAL {    \n\
               ?object a risk:citation. \n\
               ?object risk:has_citation_pubmed_identifier ?has_citation_pubmed_identifier  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:observable. \n\
               ?object risk:has_observable_name ?has_observable_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_element. \n\
               ?object risk:has_risk_element_name ?has_risk_element_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:measurement_type. \n\
               ?object risk:has_measurement_type_name ?has_measurement_type_name  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_factor.  \n\
               ?object risk:has_risk_factor_association_type ?has_risk_factor_association_type. \n\
               ?object risk:has_risk_factor_source ?has_risk_factor_source. \n\
               ?object risk:has_risk_factor_target ?has_risk_factor_target. \n\
               ?has_risk_factor_source risk:has_risk_element_name ?has_source_risk_element_name.  \n\
               ?has_risk_factor_target risk:has_risk_element_name ?has_target_risk_element_name.  \n\
              } \n";


    //add filter to query if a single observable is requested
    listQuery += "FILTER (lcase(str(?object)) = \""+term+"\") }";

    return selectQuery(listQuery);

  }
  
  function langFilter(variable_predicate){
    var lang = CONFIG.LANG;
    return "FILTER(lang("+variable_predicate+")='"+lang+"') ";
  }
  /*
      OPTIONAL {    \n\
    #Language filter \n\
     VALUES ?predicate {"+CONFIG.LANGPredicates.join(" ")+" }. \n\
     "+langFilter('?predicate')+" \
    } \n\
  */
  
  function queryInstances(type, ArrayOfIDs) {

    var listQuery = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
             ?subject a risk:" + type + "; ?predicate ?object. \n\
              OPTIONAL {    \n\
               ?object a risk:citation. \n\
               ?object risk:has_citation_pubmed_identifier ?has_citation_pubmed_identifier  \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:observable. \n\
               ?object risk:has_observable_name ?has_observable_name  \n\
              "+langFilter('?has_observable_name')+" \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_element. \n\
               ?object risk:has_risk_element_name ?has_risk_element_name  \n\
              "+langFilter('?has_risk_element_name')+" \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:measurement_type. \n\
               ?object risk:has_measurement_type_name ?has_measurement_type_name  \n\
              "+langFilter('?has_measurement_type_name')+" \n\
              } \n\
              OPTIONAL {    \n\
               ?object a risk:risk_factor.  \n\
               ?object risk:has_risk_factor_association_type ?has_risk_factor_association_type. \n\
               ?object risk:has_risk_factor_source ?has_risk_factor_source. \n\
               ?object risk:has_risk_factor_target ?has_risk_factor_target. \n\
               ?has_risk_factor_source risk:has_risk_element_name ?has_source_risk_element_name.  \n\
               ?has_risk_factor_target risk:has_risk_element_name ?has_target_risk_element_name.  \n\
              "+langFilter('?has_source_risk_element_name')+" \n\
              "+langFilter('?has_target_risk_element_name')+" \n\
              } \n";



    //add filter to query if a single observable is requested
    if (ArrayOfIDs) {
      listQuery += "FILTER ( " + ArrayOfIDs.map(function(id) {
        return "?subject=" + id.split('_')[0] + ":" + id;
      }).join("||") + "  )\n }";
      
      return selectQuery(listQuery);
    }
    else {
      listQuery += "}";
      
      return selectQuery(listQuery,null,(CONFIG.USECACHE?type+'_all':null));
    }
   

  }

  
  /* Dashboard count instances methods */
  function countAllInstances() {
    var query = "SELECT \n\
    (COUNT(?rf) as ?risk_factors) \n\
    (COUNT(?rf_r) as ?risk_factors_unreviewed) \n\
    (COUNT(?rl) as ?risk_elements) \n\
    (COUNT(?rl_r) as ?risk_elements_unreviewed) \n\
    (COUNT(?ob) as ?observables) \n\
    (COUNT(?ob_r) as ?observables_unreviewed) \n\
    (COUNT(?rv) as ?risk_evidences) \n\
    (COUNT(?rv_r) as ?risk_evidences_unreviewed) \n\
    (COUNT(?ci) as ?citations) \n\
    (COUNT(?me) as ?measurement_types)  \n\
    FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " WHERE { \n\
    {?rf a risk:risk_factor} \n\
    UNION { ?rf_r a risk:risk_factor FILTER NOT EXISTS {?rf_r risk:has_reviewer ?anything} } \n\
    UNION {?rl a risk:risk_element} \n\
    UNION { ?rl_r a risk:risk_element FILTER NOT EXISTS {?rl_r risk:has_reviewer ?anything} } \n\
    UNION {?ob a risk:observable} UNION { ?ob_r a risk:observable FILTER NOT EXISTS {?ob_r risk:has_reviewer ?anything} } \n\
    UNION {?rv a risk:risk_evidence} UNION { ?rv_r a risk:risk_evidence FILTER NOT EXISTS {?rv_r risk:has_reviewer ?anything} } \n\
    UNION {?ci a risk:citation} \n\
    UNION {?me a risk:measurement_type}  }";
    if(CONFIG.USECACHE) return cacheQuery(query,null,'count_all');
    else return apiQuery(query);
  }
  

  /* Easy select query to transform triples to javascript objects */
  function selectQuery(sparqlQuery, raw,cache_id) {
    var props=[
      'subject',
      'predicate',
      'object',
      'has_observable_name',
      'has_risk_element_name',
      'has_measurement_type_name',
      'has_risk_factor_association_type',
      'has_risk_factor_source',
      'has_risk_factor_target',
      'has_source_risk_element_name',
      'has_target_risk_element_name',
      'has_citation_pubmed_identifier'
      ];
    if( cache_id ) { 
      // USE CACHE
      return cacheQuery(sparqlQuery,null,cache_id).then(function(res) {
        if (raw) return res;
        // console.log(res.data);
        var results = RdfFormatter.groupByProp(res.data, props, null, 'value');
        if (results.data.length > 0) return RdfFormatter.mappings(results);
        else return [];
      });
    } else {
      return apiQuery(sparqlQuery).then(function(res) {
          
        console.log("=========NO CACHE===================");
        
        // console.log("Sparql Query: ",sparqlQuery);
        console.log("Raw: ",res.data);
        if (raw) return res;
        var results = RdfFormatter.groupByProp(res.data, props, null, 'value');
        console.log("groupByProp: ",results);
        if (results.data.length > 0) {
          var MappedResults = RdfFormatter.mappings(results);
          console.log("MappedResults: ",results);
          return MappedResults
        } else return [];
        
        
        console.log("===========NO CACHE===============");
        
      });
    } 
  }



  /* CORE query method*/
  function apiQuery(sparqlQuery,noprefix) {
    
    if($rootScope.isOffline) {
      $state.go('500_API_ERROR');
      return $q.reject({});
    }
    
    var params = {};
    //add prefixes
    params.sparql = (noprefix?"":PREFIXSTR) + sparqlQuery;
    console.info('API query: ', params.sparql);
    // use token
    if (Auth.cookie) params.token = Auth.cookie;
    return $http.post(CONFIG.CARRE_API_URL + 'query', params).then(function(res){
      if(res.data==='No JSON object could be decoded'||res.status===500||res.status===404||res.status===401) {
        console.error(res);
        toastr.error('<p>'+res.data+'</p>','<h4>Oh Error</h4>');
        return $q.reject(res);
      }  else return res;
    }).catch(function(err){
        console.log(err);
        Email.bug(err);
        $state.go('500_API_ERROR');
    });

  }
  

  /* CACHE methods */
  function cacheQuery(sparqlQuery,noprefix,req_url_id) {
    
    console.info('CACHE query: ', (noprefix?"":PREFIXSTR) + sparqlQuery);
    
    var graphName=CONFIG.CARRE_DEFAULT_GRAPH.substring(CONFIG.CARRE_DEFAULT_GRAPH.lastIndexOf("/")+1,CONFIG.CARRE_DEFAULT_GRAPH.lastIndexOf(">"));
    var url=CONFIG.CARRE_CACHE_URL + 'carreapi/'
            +graphName+'_'+CONFIG.LANG+'_'+req_url_id+'/'
            +encodeURIComponent(CONFIG.CARRE_API_URL+'query')+'/'
            +encodeURIComponent((noprefix?"":PREFIXSTR) + sparqlQuery)
            +(Auth.cookie?'/'+Auth.cookie:'');
    console.log(url);
    
    return $http.get(url, {"cache":false}).then(function(res){
      if(res.data==='No JSON object could be decoded') {
        console.error(res);
        toastr.error('<p>'+res.data+'</p>','<h4>Oh Error</h4>');
        return $q.reject(res);
      }  else {
        
          //setup client caching
          // CONFIG.CACHED_QUERIES[graphName+'_'+req_url_id]=url;
    
        return res;
      }
    }).catch(function(err){
        console.log(err);
        $state.go('500_API_ERROR');
    });

  }
  
  function invalidateCache(req_url_id){
    if(!CONFIG.USECACHE) return; 
    var graphName=CONFIG.CARRE_DEFAULT_GRAPH.substring(CONFIG.CARRE_DEFAULT_GRAPH.lastIndexOf("/")+1,CONFIG.CARRE_DEFAULT_GRAPH.lastIndexOf(">"));
    var url=CONFIG.CARRE_CACHE_URL + 'refresh_cache/'+graphName+'_'+CONFIG.LANG+'_'+req_url_id
    
    // remove cached url
    // var cached_url=CONFIG.CACHED_QUERIES[graphName+'_'+req_url_id];
    // $cacheFactory.get('$http').remove(cached_url); 
    
    return $http.get(url).then(function(res){
      console.log(res);
    }).catch(function(err){
        console.log(err);
        $state.go('500_API_ERROR');
    });
  }
  

  return this.exports;
});