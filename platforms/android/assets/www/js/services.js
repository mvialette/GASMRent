'use strict';

//Demonstrate how to register services
//In this case it is a simple value service.
//angular.module('GasmRentApp.services', ['ngResource'])
// .factory('DivingEventService', ['$resource',
//     function($resource){
//         return $resource('/api/jacket/:itemId', {itemId:'@id'});
//		     } ]);

var gasmRentServices = angular.module('GasmRentServices', ['ngResource']);

gasmRentServices.factory('localStorageService', ['$window', function($window){
     var save = function(key, value){
    	 $window.localStorage.setItem(key, angular.toJson(value));
     };
     var read = function(key){
    	 	var json = $window.localStorage.getItem(key);
    	 	return angular.fromJson(json);
     };
	return {
		save: save,
		read: read
	}
}]);

gasmRentServices.factory('equipmentService', ['$window', function($window){
    var rent = function(divingEventId,userId,equipmentId){
    	
    	// we have to know if this equipment is available for rent
    	if (isEquipmentAvailableForRent(equipmentId)) {
    		var adresse =  "#/scan/" + equipmentId + "/" + divingEventId + "/" + userId;
    		$window.location = adresse;
    	} else {
    		// Do not comment or delete this alert, it's use to send feedback
    		// message to the user
    		alert(messageErrorEquipmentNotAvailable(equipmentId));
    	}
    };
    var isEquipmentAvailableForRent = function(equipmentId){
    	var result = true;
    	var localStorageRentalRecords = JSON.parse(window.localStorage
    			.getItem(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL));

    	// is it an knowing reference
    	var anIdentifiedEquipment = getEquipmentById(equipmentId);

    	if (anIdentifiedEquipment == null) {
    		result = false;
    	} else {
    		// is the 
    		if(anIdentifiedEquipment.isStatus() === false || anIdentifiedEquipment.isStatus() === 'false'){
    			result = false;
    		}else{
    			if (localStorageRentalRecords != null) {
    				$.each(localStorageRentalRecords, function(i, aRentalRecord) {

    					var jsonRentalRecord = JSON.parse(aRentalRecord);
    					
    					if (jsonRentalRecord.equipmentId == equipmentId) {
    						result = false;
    						return false;
    					}
    				});
    			}
    		}
    	}
    	return result;
    };
	return {
		rent: rent
	}
}]);