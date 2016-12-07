angular.module('CarreEntrySystem').service('Observables', function($http, CARRE, CONFIG, QUERY) {

  this.exports={
    'get': getObservables,
    'save': saveObservable
  };
  
  function getObservables(ArrayOfIDs) {
    return CARRE.instances('observable',ArrayOfIDs);
  }
  
  function saveObservable(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",insertQuery = "";
    var newObj = {};
    if(newElem.name.length>0) newObj.has_observable_name = {pre:'risk',value:newElem.name.toString(),type:"lang"};
    if(newElem.type.length>0) newObj.has_observable_type = {pre:'risk',value:newElem.type.toString(),type:"node"};
    if(newElem.measurement_type.length>0) newObj.has_observable_measurement_type = {pre:'risk',value:newElem.measurement_type.toString(),type:"node"};
    if (newElem.identifier.length > 0) newObj.has_external_type = {
      pre: 'risk',
      value: newElem.identifier.toString(),
      type: "node"
    };
    if (newElem.predicate.length > 0) newObj.has_external_predicate = {
      pre: 'risk',
      value: newElem.predicate.toString(),
      type: "node"
    };
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    console.log('Mapped: ',newObj);
    
    /* invalidate observable_all */
    CARRE.invalidateCache('observable_all');
    CARRE.invalidateCache('count_all');

    if (oldElem.id) {
      /*Update query*/
      updateQuery = QUERY.update(oldElem,newObj);
      console.log('----Update Query----');
      return CARRE.query(updateQuery,'no prefix');
    }
    else {
      /*Insert query*/
      insertQuery = QUERY.insert(newObj,"observable","OB",user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery,'no prefix');
    }

  }


  return this.exports;
  
});