angular.module('CarreEntrySystem').service('Measurement_types', function($http, CARRE, CONFIG, QUERY) {

  this.exports={
    'get': getMeasurement_types,
    'save': saveMeasurement_type
  };
  
  function getMeasurement_types(ArrayOfIDs) {
    return CARRE.instances('measurement_type',ArrayOfIDs);
  }
  
  function saveMeasurement_type(oldElem, newElem, user) {
    user = user || CONFIG.currentUser.graphName;
    var updateQuery = "",insertQuery = "";
    var newObj = {};
    /*
      //Init Form object
        $scope.measurement_type = {
          name: $scope.model.has_measurement_type_name_label,
          unit: $scope.model.has_label_label||"",
          datatype: $scope.model.has_datatype_label
        };
    */
    if(newElem.name.length>0) newObj.has_measurement_type_name = {pre:'risk',value:newElem.name.toString(),type:"lang"};
    if(newElem.unit.length>0) newObj.has_label = {pre:'risk',value:newElem.unit.toString(),type:"string"};
    if(newElem.datatype.length>0) newObj.has_datatype = {pre:'risk',value:newElem.datatype.toString(),type:"string"};
    if(newElem.has_enumeration_values.length>0) newObj.has_enumeration_values = {pre:'risk',value:newElem.has_enumeration_values.toString(),type:"string"};
    if (newElem.identifier.length > 0) newObj.has_external_unit = {
      pre: 'risk',
      value: newElem.identifier.toString(),
      type: "node"
    };
    
    console.log('Old: ',oldElem);
    console.log('New: ',newElem);
    console.log('Mapped: ',newObj);
    
    /* invalidate measurement_type_all */
    CARRE.invalidateCache('measurement_type_all');
    CARRE.invalidateCache('count_all');

    if (oldElem.id) {
      /*Update query*/
      updateQuery = QUERY.update(oldElem,newObj);
      console.log('----Update Query----');
      return CARRE.query(updateQuery,'no prefix');
    }
    else {
      /*Insert query*/
      insertQuery = QUERY.insert(newObj,"measurement_type","ME",user);
      console.info('-----insertQuery------');
      return CARRE.query(insertQuery,'no prefix');
    }

  }

  return this.exports;
  
});