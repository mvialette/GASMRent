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
	
	var clear = function(key){
		var emptyArray = new Array();
		$window.localStorage.setItem(key, JSON.stringify(emptyArray));
    };
     var save = function(key, value){
    	 $window.localStorage.setItem(key, angular.toJson(value));
     };
     var read = function(key){
	 	var json = $window.localStorage.getItem(key);
	 	return angular.fromJson(json);
     };
	return {
		clear: clear,
		save: save,
		read: read
	}
}]);

gasmRentServices.factory('equipmentService', ['$window','localStorageService', function($window, localStorageService){
	
	var Equipment = function(equipmentId, type, price, rented, serialNumber, status) {
		this.equipmentId = equipmentId;
		this.type = type;
		this.price = price;
		this.rented = rented;
		this.serialNumber = serialNumber;
		this.status = status;

		this.getPrice = function() {
			return this.price;
		}, this.getType = function() {
			return this.type;
		}, this.isStatus = function() {
			return this.status;
		}, this.toString = function() {

			var frenchType = this.type;

			switch (this.type) {
			case "Tank":
				frenchType = tank;
				break;
			case "Regulator":
				frenchType = regulator;
				break;
			case "Jacket":
				frenchType = jacket;
				break;
			case "Suit":
				frenchType = suit;
				break;
			default:
				alert("Cas non géré")
				break;
			}

			return frenchType + " n°" + equipmentId;
		}, this.toHtmlString = function() {

			var frenchType = this.type;

			switch (this.type) {
			case "Tank":
				frenchType = tank;
				break;
			case "Regulator":
				frenchType = regulator;
				break;
			case "Jacket":
				frenchType = jacket;
				break;
			case "Suit":
				frenchType = suit;
				break;
			default:
				alert("Cas non géré")
				break;
			}

			return frenchType + " n°<b>" + equipmentId + "</b>";
		}, this.toCompleteString = function() {

			var frenchType = this.type;
			var otherFields = "";

			switch (this.type) {
			case "Tank":
				frenchType = tank;

				otherFields = otherFields + "<br><br>Prix=" + price;
				otherFields = otherFields + "<br><br>rented=" + rented;
				otherFields = otherFields + "<br><br>serialNumber="
						+ serialNumber;

				break;
			case "Regulator":
				frenchType = regulator;
				break;
			case "Jacket":
				frenchType = jacket;
				break;
			case "Suit":
				frenchType = suit;
				break;
			default:
				alert("Cas non géré")
				break;
			}

			return frenchType + " n°<b>" + equipmentId + "</b>" + otherFields;
		}
	}
	
	var getEquipmentById = function(equipmentId){
		
		var result = null;

		var localStorageEquipments = localStorageService.read(getConstants().LOCAL_STORAGE_EQUIPMENTS);

		$.each(localStorageEquipments, function(i, oneElement) {

			var jsonOneElement = JSON.parse(oneElement);

			if (equipmentId == jsonOneElement.reference) {
				
				result = new Equipment(jsonOneElement.reference,
						jsonOneElement.type, jsonOneElement.price,
						jsonOneElement.rented, jsonOneElement.serialNumber, jsonOneElement.status);

				return false;
			}
		});

		return result;
	};
    var rent = function(divingEventId,userId,equipmentId){
    	//alert('divingEventId='+divingEventId+',userId=' + userId + ',equipmentId=' + equipmentId);
    	// we have to know if this equipment is available for rent
    	if (isEquipmentAvailableForRent(equipmentId)) {
    		//alert('ok');
    		var adresse =  "#/scan/" + equipmentId + "/" + divingEventId + "/" + userId;
    		$window.location = adresse;
    	} else {
    		//alert('ko');
    		// Do not comment or delete this alert, it's use to send feedback
    		// message to the user
    		alert(messageErrorEquipmentNotAvailable(equipmentId));
    	}
    };
    var isEquipmentAvailableForRent = function(equipmentId){
    	var result = true;
    	
    	var localStorageRentalRecords = localStorageService.read(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL);
    	//alert('localStorageRentalRecords=' + localStorageRentalRecords);
    	
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
    var getAllEquipments = function(){
    	
    	var localStorageEquipments = localStorageService.read(getConstants().LOCAL_STORAGE_EQUIPMENTS);
    	
    	var equipments = [];
    	
    	$.each(localStorageEquipments, function(i, oneElement) {
    		var jsonOneElement = JSON.parse(oneElement);
    		
    		var result = new Equipment(jsonOneElement.reference,
					jsonOneElement.type, jsonOneElement.price,
					jsonOneElement.rented, jsonOneElement.serialNumber, jsonOneElement.status);
    		
    		equipments.push(result);
    	});
    	
    	return equipments;
    }
	return {
		getEquipmentById:getEquipmentById,
		getAllEquipments: getAllEquipments,
		rent: rent,
		isEquipmentAvailableForRent: isEquipmentAvailableForRent
	}
}]);

gasmRentServices.factory('userService', ['localStorageService', function(localStorageService){
	
	var User = function(aUserId, firstName, lastName) {
		this.id = aUserId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.toString = function() {
			return this.firstName + " " + this.lastName;
		};
	};
	
	var getById = function(userId){
    	
    	var result = null;

    	var localStorageUsers = localStorageService.read(getConstants().LOCAL_STORAGE_USERS);
    	
    	$.each(localStorageUsers, function(i, oneElement) {

    		var jsonOneElement = JSON.parse(oneElement);

    		if (userId == jsonOneElement.id) {
    			result = new User(jsonOneElement.id, jsonOneElement.firstName,
    					jsonOneElement.lastName);
    			return false;
    		}
    	});

    	return result;
    };
    
    var getAllUsers = function(){
    	
    	var localStorageUsers = localStorageService.read(getConstants().LOCAL_STORAGE_USERS);
    	
    	var users = [];
    	
    	$.each(localStorageUsers, function(i, oneElement) {
    		var jsonOneElement = JSON.parse(oneElement);
    		
    		var result = new User(jsonOneElement.id, jsonOneElement.firstName,
					jsonOneElement.lastName);
    		
    		users.push(result);
    	});
    	
    	return users;
    }
    
	return {
		getById: getById,
		getAllUsers:getAllUsers
	}
}]);

gasmRentServices.factory('divingEventService', ['localStorageService', function(localStorageService){
	
	var DivingEvent = function(divingEventId, place, date, billingThreshold) {
		this.id = divingEventId;
		this.place = place;
		this.date = date;
		this.billingThreshold = billingThreshold;
		this.toString = function() {
			return this.place + " (" + this.date + ")";
		}
		this.toHtmlString = function() {
			return "<b>" + this.place + "</b> le <b>" + this.date + "</b>";
		}
	}

	$
			.extend(
					DivingEvent.prototype,
					{
						getDivingEventId : function() {
							return this.theDivingEventId;
						},
						getPlace : function() {
							return this.place;
						},
						getDate : function() {
							return this.date;
						},
						getBillingThreshold : function() {
							return this.billingThreshold;
						},
						getUserPrice : function(userId) {

							var result = 0;
							var theCurrentDivingEventId = this.theDivingEventId;

							var lineOfRentalsFromLocalStorageString = JSON
									.parse(window.localStorage
											.getItem(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL));
							var lineOfRentalsArrays = new Array();

							var maxPriceForRegulator = 0;
							var maxPriceForTank = 0;
							var maxPriceForJacket = 0;
							var maxPriceForSuit = 0;

							if (lineOfRentalsFromLocalStorageString != null) {
								$.each(lineOfRentalsFromLocalStorageString,
										function(idx2, oneRentalRecord) {
											lineOfRentalsArrays
													.push(oneRentalRecord);
										});

								$
										.each(
												lineOfRentalsArrays,
												function(i, oneElement) {

													var currentElementJSON = JSON
															.parse(oneElement);

													if (currentElementJSON.divingEventId == theCurrentDivingEventId
															&& currentElementJSON.userId == userId) {
														var anEquipment = getEquipmentById(currentElementJSON.equipmentId);

														switch (anEquipment
																.getType()) {
														case "Tank":
															if (anEquipment
																	.getPrice() > maxPriceForTank) {
																maxPriceForTank = anEquipment
																		.getPrice();
															}
															break;
														case "Regulator":
															if (anEquipment
																	.getPrice() > maxPriceForRegulator) {
																maxPriceForRegulator = anEquipment
																		.getPrice();
															}
															break;
														case "Jacket":
															if (anEquipment
																	.getPrice() > maxPriceForJacket) {
																maxPriceForJacket = anEquipment
																		.getPrice();
															}
															break;
														case "Suit":
															if (anEquipment
																	.getPrice() > maxPriceForSuit) {
																maxPriceForSuit = anEquipment
																		.getPrice();
															}
															break;
														default:
															alert("Cas non géré")
															break;
														}
													}
												});
							}

							// TODO: I have to put a '+' before adding numbers,
							// is there another way ?
							result = +maxPriceForTank + +maxPriceForRegulator
									+ +maxPriceForJacket + +maxPriceForSuit;

							if ((Math.max(result, this.billingThreshold) == result)) {
								if (this.billingThreshold == -1) {
									// cela signifie qu'il n'y a pas de plafond
									// positionné pour cette sortie, le résultat
									// est donc bien la somme du matos loué.
								} else {
									result = this.billingThreshold;
								}
							}

							return result;
						}
					});
	
	var getById = function(divingEventId){
    	
    	var result = null;

    	var localStorageDivingEvents = localStorageService.read(getConstants().LOCAL_STORAGE_DIVING_EVENTS);
    	
    	$.each(localStorageDivingEvents, function(i, oneElement) {

    		var jsonOneElement = JSON.parse(oneElement);

    		if (divingEventId == jsonOneElement.id) {

    			result = new DivingEvent(jsonOneElement.id, jsonOneElement.place,
    					parseDate(jsonOneElement.date),
    					jsonOneElement.billingThreshold);
    			return false;
    		}
    	});

    	return result;
    };
    
    var getAllDivingEvents = function(){
    	
    	var localStorageDivingEvents = localStorageService.read(getConstants().LOCAL_STORAGE_DIVING_EVENTS);
    	
    	var divingEvents = [];
    	
    	$.each(localStorageDivingEvents, function(i, oneElement) {
    		var jsonOneElement = JSON.parse(oneElement);
    		
    		var result = new DivingEvent(jsonOneElement.id, jsonOneElement.place,
					parseDate(jsonOneElement.date),
					jsonOneElement.billingThreshold);
    		
    		divingEvents.push(result);
    	});
    	
    	return divingEvents;
    }
    
	return {
		getById: getById,
		getAllDivingEvents:getAllDivingEvents
	}
}]);