angular.module('CarreEntrySystem').service('Risk_elements', function($http, CARRE, CONFIG, QUERY) {

  this.exports = {
    'get': getRisk_elements,
    'save': saveRisk_element,
    'associations': RiskElementAssociations
  };


  function getRisk_elements(ArrayOfIDs) {
    return CARRE.instances('risk_element', ArrayOfIDs);
  }

  function saveRisk_element(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",
      insertQuery = "";
    var newObj = {};
    if (newElem.name.length > 0) newObj.has_risk_element_name = {
      pre: 'risk',
      value: newElem.name.toString(),
      type: "string"
    };
    if (newElem.identifier.length > 0) newObj.has_risk_element_identifier = {
      pre: 'risk',
      value: "http://umls.nlm.nih.gov/sab/mth/cui/" + newElem.identifier.toString(),
      type: "node"
    };
    if (newElem.type.length > 0) newObj.has_risk_element_type = {
      pre: 'risk',
      value: newElem.type.toString(),
      type: "node"
    };
    if (newElem.modifiable_status.length > 0) newObj.has_risk_element_modifiable_status = {
      pre: 'risk',
      value: newElem.modifiable_status.toString(),
      type: "string"
    };
    if (newElem.observables.length > 0) newObj.has_risk_element_observable = {
      pre: 'risk',
      value: newElem.observables,
      type: "node"
    };
    if (newElem.risk_elements.length > 0) newObj.includes_risk_element = {
      pre: 'risk',
      value: newElem.risk_elements,
      type: "node"
    };


    console.log('Old: ', oldElem);
    console.log('New: ', newElem);
    console.log('Mapped: ', newObj);

    /* invalidate risk_element_all */
    CARRE.invalidateCache('risk');
    CARRE.invalidateCache('count_all');

    if (oldElem.id) {
      /*Update query*/
      updateQuery = QUERY.update(oldElem, newObj);
      console.log('----Update Query----');
      return CARRE.query(updateQuery, 'no prefix');
    }
    else {
      /*Insert query*/
      insertQuery = QUERY.insert(newObj, "risk_element", "RL", user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery, 'no prefix');
    }

  }

  function RiskElementAssociations(id) {
    var FilterString="";
    var cache_key="";
    //accept only risk element ids
    if(id) {
      //id fix
      var prefix = "";
      if (id.indexOf("http") === -1) {
        cache_key=id;
        prefix = id.split("_")[0];
        id = prefix + ":" + id;
      } else {
        cache_key=id.substring(id.lastIndexOf("/")+1);
        id = "<" + id + ">";
      }
      
      //now filter depending on id
      if(id.indexOf("RL")>=0){
        FilterString="FILTER (?has_risk_factor_source="+id+"||?has_risk_factor_target="+id+")";
      } else if(id.indexOf("RF")>=0) {
        FilterString="FILTER (?subject="+id+")";
      }
    } else cache_key="all";
    
    var query = "SELECT * FROM " + CONFIG.CARRE_DEFAULT_GRAPH + " \n\
              WHERE { ?subject a risk:risk_factor; ?predicate ?object. \n\
               ?subject risk:has_risk_factor_association_type ?has_risk_factor_association_type. \n\
               ?subject risk:has_risk_factor_source ?has_risk_factor_source. \n\
               ?subject risk:has_risk_factor_target ?has_risk_factor_target. \n\
              OPTIONAL {    \n\
               ?object a risk:risk_element. \n\
               ?object risk:has_risk_element_name ?has_risk_element_name  \n\
              }"+ FilterString+" }";
              
    return CARRE.selectQuery(query,null,'risk_associations_for_'+cache_key).then(function(res) {

      var graphData = {
        nodes:[],
        edges:[]
      };
        
      var tmp_nodes=[];
      res.data.forEach(function(rf) {
      
        var source = {
          label: rf.has_risk_factor_source_label,
          id: rf.has_risk_factor_source[0],
          value:1
        };

        var target = {
          label: rf.has_risk_factor_target_label,
          id: rf.has_risk_factor_target[0],
          value:1
        };

        var relation = {
          label: rf.has_risk_factor_association_type_label,
          id: rf.id
        };

        //add the nodes
        var source_index=tmp_nodes.indexOf(source.id);
        if(source_index===-1) {
          tmp_nodes.push(source.id);
          graphData.nodes.push(source);
        } else {
          graphData.nodes[source_index].value++;
        }
        var target_index=tmp_nodes.indexOf(target.id);
        if(target_index===-1) {
          tmp_nodes.push(target.id);
          graphData.nodes.push(target);
        } else {
          graphData.nodes[target_index].value++;
        }
        
        //add the edges
        graphData.edges.push({id:relation.id, from:source.id, label:relation.label, to:target.id});

      });
      
      return graphData;

    });

  }

  return this.exports;

});