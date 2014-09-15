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
	
	var getById = function(equipmentId){
		
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
    	var anIdentifiedEquipment = getById(equipmentId);

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
		getById:getById,
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

gasmRentServices.factory('lineOfRentalService', ['localStorageService', function(localStorageService){
	
	var LineOfRental = function(divingEventId, userId, equipmentId) {
		this.divingEventId = divingEventId;
		this.userId = userId;
		this.equipmentId = equipmentId;
	}

	$.extend(LineOfRental.prototype, {
		getDivingEventId : function() {
			return this.divingEventId;
		},
		getUserId : function() {
			return this.userId;
		},
		getEquipmentId : function() {
			return this.equipmentId;
		},
		toString : function() {
			return 'divingEventId=' + this.divingEventId + '&userId='
					+ this.userId + '&equipmentId=' + this.equipmentId;
		}
	});
	
	var save = function(divingEventId, userId, equipmentId){
		var theNewLineOfRental = new LineOfRental(divingEventId, userId, equipmentId);

		// persist data in local storage
		var linesOfRentalFromTheLocalStorage = localStorageService.read(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL);

		var linesOfRentalArrays = new Array();
	
		if (linesOfRentalFromTheLocalStorage != null) {
			$.each(linesOfRentalFromTheLocalStorage, function(idx2,
					oneRentalRecord) {
				linesOfRentalArrays.push(oneRentalRecord);
			});
		}

		linesOfRentalArrays.push(JSON.stringify(theNewLineOfRental));
		localStorageService.save(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL, linesOfRentalArrays);
		
		return theNewLineOfRental;
    };
    
    var getAllRentalsByDivingIdAndUserId = function(divingEventId, userId){
    	
    	var linesOfRentalFromTheLocalStorage = localStorageService.read(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL);
    	
    	alert('linesOfRentalFromTheLocalStorage=' + linesOfRentalFromTheLocalStorage);
    	
    	var rentalRecordArrays = [];

    	$.each(linesOfRentalFromTheLocalStorage, function(idx2,oneRentalRecord) {
    		
    		var currentElementJSON = JSON.parse(oneRentalRecord);
    		
    		if (currentElementJSON.divingEventId == divingEventId && currentElementJSON.userId == userId) {
    			
    			var theNewLineOfRental = new LineOfRental(currentElementJSON.divingEventId, currentElementJSON.userId, currentElementJSON.equipmentId);
    			
    			rentalRecordArrays.push(theNewLineOfRental);
    		}
    	});
    	
    	return rentalRecordArrays;
    }
    
	return {
		save: save,
		getAllRentalsByDivingIdAndUserId:getAllRentalsByDivingIdAndUserId
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

gasmRentServices.factory('barcodeScannerService', ['equipmentService', function(equipmentService){
	
	var scanAnEquipmentId = function(divingEventId, userId){
		
		var debug = false;
		//var debug = true;

		if (debug === true) {
			alert("cordova.plugins.barcodeScanner");
		}
		
		cordova.plugins.barcodeScanner.scan(
	      function (result) {
	    	  if (debug === true) {
	    		  alert("We got a barcode\n" +
	    				  "Result: " + result.text + "\n" +
	    				  "Format: " + result.format + "\n" +
	    				  "Cancelled: " + result.cancelled);
	    	  }
	    	  
	    	  if (result.cancelled == false && result.format == "QR_CODE") {
	    		  equipmentService.rent(divingEventId, userId, result.text);
	    	  } else {
	    		  alert("Le scan n'a pas abouti");
	    	  }
	      }, 
	      function (error) {
	          alert("Scanning failed: " + error);
	      }
	   );
		
	}
    
	return {
		scanAnEquipmentId: scanAnEquipmentId
	}
}]);

gasmRentServices.factory('billingRecordService', ['localStorageService', function(localStorageService){
	
	var BillingRecord = function(userId, divingEventId, paymentMode) {
		this.userId = userId;
		this.divingEventId = divingEventId;
		this.paymentMode = paymentMode;
		
		this.getUserId = function() {
			return this.userId;
		}, 
		
		this.getDivingEventId = function() {
			return this.divingEventId;
		},
		
		this.getPaymentMode = function() {
			return this.paymentMode;
		},
		
		this.setPaymentMode = function(newPaymentMode) {
			this.paymentMode = newPaymentMode;
		}
	}
	
	var save = function(divingEventId, userId, paymentMode){
		
		var paymentByUserAndDivingEventArray = new Array();
		logMessage("paymentMode="+paymentMode);
		
		logMessage("divingEventId="+divingEventId);
		
		logMessage("userId="+userId);
		
		var localStorageVarName = getConstants().LOCAL_STORAGE_PAYMENT_BY_USER;
		logMessage("localStorageVarName="+localStorageVarName);
		
		var localStorageValue = localStorageService.read(localStorageVarName);
		logMessage("localStorageValue="+localStorageValue);
		
		//var paymentByUserAndDivingEventJSON = JSON.parse(localStorageValue);
		//logMessage("paymentByUserAndDivingEventJSON="+paymentByUserAndDivingEventJSON);
		
		if(localStorageValue != null){
			
			logMessage("localStorageValue is not null");
			
			$.each(localStorageValue, function(i,oneRecord) {                    
				logMessage("found one record in local storage");
				paymentByUserAndDivingEventArray.push(oneRecord);
			});
		}
		
		logMessage("paymentByUserAndDivingEventArray="+paymentByUserAndDivingEventArray);
		
		var recordFound = false;
		logMessage("record initial=" + paymentByUserAndDivingEventArray);
		
		var paymentByUserAndDivingEventstringify = JSON.stringify(paymentByUserAndDivingEventArray);
		logMessage("paymentByUserAndDivingEventstringify=" + paymentByUserAndDivingEventstringify);
		
		var paymentByUserAndDivingEventParse = JSON.parse(paymentByUserAndDivingEventstringify);
		logMessage("paymentByUserAndDivingEventParse=" + paymentByUserAndDivingEventParse);
		
		paymentByUserAndDivingEventArray.forEach(
			function updatePaymentMode(anItem) {
				if(userIdByParam == anItem.userId && divingEventIdByParam == anItem.divingEventId){
					logMessage("set payment mode");
					anItem.paymentMode=paymentMode;
					recordFound=true;
					logMessage("return:"+paymentMode);
				}
			}		
		);
		
		logMessage("recordFound="+recordFound);
		if(recordFound == false){
			var oneBillingRecord = new BillingRecord(userId,divingEventId,paymentMode);	
			paymentByUserAndDivingEventArray.push(oneBillingRecord);
		}
		
		var paymentByUserAndDivingEventArrayStringify = JSON.stringify(paymentByUserAndDivingEventArray);
		logMessage("paymentByUserAndDivingEventArray="+paymentByUserAndDivingEventArrayStringify); 
		
		localStorageService.save(getConstants().LOCAL_STORAGE_PAYMENT_BY_USER, paymentByUserAndDivingEventArrayStringify);
    };
    
    var getAllRentalsByDivingIdAndUserId = function(divingEventId, userId){
    	
    	var linesOfRentalFromTheLocalStorage = localStorageService.read(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL);
    	
    	alert('linesOfRentalFromTheLocalStorage=' + linesOfRentalFromTheLocalStorage);
    	
    	var rentalRecordArrays = [];

    	$.each(linesOfRentalFromTheLocalStorage, function(idx2,oneRentalRecord) {
    		
    		var currentElementJSON = JSON.parse(oneRentalRecord);
    		
    		if (currentElementJSON.divingEventId == divingEventId && currentElementJSON.userId == userId) {
    			
    			var theNewLineOfRental = new LineOfRental(currentElementJSON.divingEventId, currentElementJSON.userId, currentElementJSON.equipmentId);
    			
    			rentalRecordArrays.push(theNewLineOfRental);
    		}
    	});
    	
    	return rentalRecordArrays;
    }
    
	return {
		save: save,
		getAllRentalsByDivingIdAndUserId:getAllRentalsByDivingIdAndUserId
	}
}]);