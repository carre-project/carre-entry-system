angular.module('CarreEntrySystem').service('QUERY', function(CONFIG) {

  this.exports = {
    'insert': buildInsertQuery,
    'update': buildUpdateQuery,
    
  };

  /* The prefixes for CARRE*/
  var PREFIXES = {
    'xsd': 'http://www.w3.org/2001/XMLSchema#',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'carreUsers': 'https://carre.kmi.open.ac.uk/users/',
    'risk': 'http://carre.kmi.open.ac.uk/ontology/risk.owl#',
    'ME': 'http://carre.kmi.open.ac.uk/measurement_types/',
    'OB': 'http://carre.kmi.open.ac.uk/observables/',
    'RL': 'http://carre.kmi.open.ac.uk/risk_elements/',
    'RV': 'http://carre.kmi.open.ac.uk/risk_evidences/',
    'RF': 'http://carre.kmi.open.ac.uk/risk_factors/',
    'MD': 'http://carre.kmi.open.ac.uk/medical_experts/',
    'CI': 'http://carre.kmi.open.ac.uk/citations/',
  };
  var PREFIXSTR = '';
  var PREFIXARR = [];

  function addPrefix(prefix) {
    if (prefix) {
      if (PREFIXES.hasOwnProperty(prefix)&&PREFIXARR.indexOf(prefix)===-1) {
        PREFIXARR.push(prefix);
        PREFIXSTR += 'PREFIX ' + prefix + ': <' + PREFIXES[prefix] + '> \n';
      }
    }
    else {
      //add all prefixes
      for (var prop in PREFIXES) {
        PREFIXARR.push(prop);
        PREFIXSTR += 'PREFIX ' + prop + ': <' + PREFIXES[prop] + '> \n';
      }
    }
  }

  function keepDiffProps(oldObj,newObj) {
    var obj={};
    for (var prop in newObj) {
      //iterate new object properties
      if( newObj[prop].value instanceof Array) {
        //if array
        if((newObj[prop].value.length!==oldObj[prop].length)) obj[prop]=newObj[prop];
        else {
          for (var i=0,arr=newObj[prop].value;i<arr.length;i++){
            if(oldObj[prop].indexOf(arr[i])===-1) {
              obj[prop]=newObj[prop];
              break;
            }
          }
        }
      } else if(oldObj[prop+'_label']!=newObj[prop].value) obj[prop]=newObj[prop];
    }
    return obj;
  }
  
  function parse(node){
    if(node instanceof Object) return "\"" + node.value + "\"^^" + fillPrefix('xsd:' + node.type); //if it is value
    else {
        if(node.indexOf('<')===0 && node.indexOf('>')===node.length-1) return node; //if has already parsed
        if (node.indexOf('http://') === 0 || node.indexOf('https://') === 0) return '<' + node + '>';  //if it is node without prefix
        else return fillPrefix(node); //if it is node or relation with prefix
    }
  }
  
  function fillPrefix(test, prefixes) {
    if(test.indexOf(":")===-1) test = "risk:"+test;
    var val = test.split(':');
    if(CONFIG.OPTIONS.usePrefix) {
      addPrefix(val[0]);
      return test;
    } 
    prefixes = prefixes || PREFIXES;
    if (prefixes.hasOwnProperty(val[0])) return '<' + prefixes[val[0]] + val[1] + '>';
    else return '<node_' + Math.round(Math.random() * 100000000) + '>';
  }

  /* Update query */
  function buildUpdateQuery (old,obj,id,graph) {
    PREFIXARR=[];
    PREFIXSTR=[];
    graph = graph || CONFIG.CARRE_DEFAULT_GRAPH;
    obj = keepDiffProps(old,obj);
    id = id||parse(old.id);
    var deleteTriples = "";
    var insertTriples = "";
    var objEmpty = true;
    for (var prop in obj) {
      objEmpty = false;
      var pre=obj[prop].pre;
      deleteTriples+= id +" "+ parse(pre+":"+prop) +" ?"+prop+"_var . \n";
      if(obj[prop].value instanceof Array){
        // array e.g observables
        obj[prop].value.forEach(function(elem){
          insertTriples+= id +" "+ parse(pre+":"+prop) +" "+parse(elem)+" . \n" ;
        });
      } else {
        insertTriples+= id +" "+ parse(pre+":"+prop) +" "+parse(obj[prop])+" . \n" ;
      }
    }
    if(objEmpty) return "";
    var deleteQuery = "WITH " + graph + " DELETE { \n" + deleteTriples + " } \n WHERE { \n"+ deleteTriples + " } \n";
    var insertQuery = "INSERT DATA { GRAPH " + graph + " { \n" + insertTriples + " }} \n";
    
    return (CONFIG.OPTIONS.usePrefix?PREFIXSTR:"")+deleteQuery + insertQuery;

  }

  /* Insert query */
  function buildInsertQuery (obj,type,idlabel,usergraph,graph) {
    PREFIXARR=[];
    PREFIXSTR=[];
    graph = graph || CONFIG.CARRE_DEFAULT_GRAPH;
    usergraph = usergraph || CONFIG.currentUser.graphName;
    var insertTriples = "";
    var objEmpty = true;
    for (var prop in obj) {
      objEmpty = false;
      var pre=obj[prop].pre;
      if(obj[prop].value instanceof Array){
        // array e.g observables
        obj[prop].value.forEach(function(elem){
          insertTriples+= "?newid "+ parse(pre+":"+prop) +" "+parse(elem)+" . \n";
        });
      } else {
        //non array
        insertTriples+= "?newid "+ parse(pre+":"+prop) +" "+parse(obj[prop])+" . \n";
      }
    }
    if(objEmpty) return "";
    //add author and type
    insertTriples+= "?newid "+parse("risk:has_author")+ " " + parse(usergraph) + "; a "+parse("risk:"+type)+" .  \n";
    var insertQuery = "INSERT { GRAPH " + graph + " { \n" + insertTriples + " }} WHERE \n\
          { GRAPH " + graph + " \n\
          { { \n\
              SELECT ?oldindex FROM " + graph + " \n\
              WHERE { \n\
               ?elem a "+parse("risk:"+type)+" . \n\
                BIND (xsd:integer(strafter(STR(?elem),\"CI_\")) AS ?oldindex) \n\
              } ORDER BY DESC(?oldindex) LIMIT 1 \n\
            } \n\
            BIND (IRI(CONCAT("+parse(idlabel+":")+", \""+idlabel+"_\", ?oldindex+1)) AS ?newid) \n\
          } }";
    
    return (CONFIG.OPTIONS.usePrefix?PREFIXSTR:"")+insertQuery;
  }
      

  return this.exports;
});