'use strict';

/**
 * Global methods
 * 
 */
var parseDate = function(dateObject){
	var theDate = new Date(parseInt(dateObject));
	return theDate.getDate() + "/" + (theDate.getMonth() + 1) + "/"
			+ theDate.getFullYear(); // jQuery.datepicker.parseDate(
	// "yy-mm-dd", d);
};

var logMessage = function(message) {
	//var debug = false;
	var debug = true;
	
	if (debug === true) {
		alert(message);
	}
}

var formatTimestamp = function(d) {
	// padding function
	var s = function(p) {
		return ('' + p).length < 2 ? '0' + p : '' + p;
	};

	var dateTmp = null;
	// default parameter
	if (typeof d === 'undefined') {
		dateTmp = new Date();
	} else if (typeof d === 'number') {
		dateTmp = new Date(d);
	} else if (typeof d === 'string') {
		dateTmp = new Date(parseInt(d));
	}

	return s(dateTmp.getDate()) + '/' + s(dateTmp.getMonth() + 1) + '/'
			+ dateTmp.getFullYear();
}

/**
 * End of global methods
 */

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

gasmRentServices.factory('equipmentService', ['$window', 'localStorageService', 'LOCAL_STORAGE_EQUIPMENTS', 'LOCAL_STORAGE_LINE_OF_RENTAL', function($window, localStorageService, LOCAL_STORAGE_EQUIPMENTS, LOCAL_STORAGE_LINE_OF_RENTAL){
	
	var Equipment = function(equipmentId, type, price, rented, serialNumber, status, jsonOneElement) {
		this.equipmentId = equipmentId;
		this.type = type;
		this.price = price;
		this.rented = rented;
		this.serialNumber = serialNumber;
		this.status = status;
		
		/* other fields */
		this.jsonOneElement = jsonOneElement;

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

			for ( var oneAttribute in jsonOneElement) {
					// alert(oneAttribute);
					// alert(jsonOneElement[oneAttribute]);
					var valeurAAfficher = null;

					var jsonValue = jsonOneElement[oneAttribute];

					if (jsonValue == "null") {
						valeurAAfficher = "";
					} else if (oneAttribute.indexOf("date") != -1
							|| oneAttribute.indexOf("Date") != -1) {
						// var maintenant = new Date(jsonOneElement[oneAttribute]);
						// valeurAAfficher = maintenant.getDate() + '/' +
						// (maintenant.getMonth() + 1) + '/' +
						// maintenant.getFullYear();
						valeurAAfficher = formatTimestamp(jsonValue);
					} else if (jsonValue == "true" || jsonValue == "false"
							|| jsonValue === true || jsonValue === false) {
						
						if (jsonValue == "true" || jsonValue === true) {
							valeurAAfficher = "<span class=\"fa-stack\"><i class=\"fa fa-square-o fa-stack-2x\"></i><i class=\"fa fa-check fa-stack-1x\"></i></span>"
						} else if (jsonValue == "false" || jsonValue === false) {
							valeurAAfficher = "<span class=\"fa-stack\"><i class=\"fa fa-square-o fa-stack-2x\"></i><i class=\"fa fa-times fa-stack-1x\"></i></span>";
						}
						
						// alert(valeurAAfficher);
					} else if ((oneAttribute.indexOf("Pressure") != -1)
							|| (oneAttribute.indexOf("pressure") != -1)) {
						valeurAAfficher = jsonValue + " bars";
					} else if (oneAttribute.indexOf("weight") != -1) {
						valeurAAfficher = jsonValue + " Kg";
					} else if (oneAttribute.indexOf("price") != -1) {
						valeurAAfficher = jsonValue + " €";
					} else {
						valeurAAfficher = jsonValue;
					}

					otherFields = otherFields + "<br>"
							+ jQuery.i18n.prop(oneAttribute) + " = <b>"
							+ valeurAAfficher + "</b>";
				}

				// alert(otherFields);

				return frenchType + " n°<b>" + equipmentId + "</b>" + otherFields;
		}
	}
	
	var getById = function(equipmentId){
		
		var result = null;

		var localStorageEquipments = localStorageService.read(LOCAL_STORAGE_EQUIPMENTS);

		$.each(localStorageEquipments, function(i, oneElement) {

			var jsonOneElement = JSON.parse(oneElement);

			if (equipmentId == jsonOneElement.reference) {
				
				alert('jsonOneElement=' + JSON.stringify(jsonOneElement));
				
				result = new Equipment(jsonOneElement.reference,
						jsonOneElement.type, jsonOneElement.price,
						jsonOneElement.rented, jsonOneElement.serialNumber, jsonOneElement.status, jsonOneElement);

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
    	
    	var localStorageRentalRecords = localStorageService.read(LOCAL_STORAGE_LINE_OF_RENTAL);
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
    	
    	var localStorageEquipments = localStorageService.read(LOCAL_STORAGE_EQUIPMENTS);
    	
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

gasmRentServices.factory('userService', ['localStorageService', 'LOCAL_STORAGE_USERS', function(localStorageService, LOCAL_STORAGE_USERS){
	
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

    	var localStorageUsers = localStorageService.read(LOCAL_STORAGE_USERS);
    	
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
    	
    	var localStorageUsers = localStorageService.read(LOCAL_STORAGE_USERS);
    	
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

gasmRentServices.factory('divingEventService', ['localStorageService', 'LOCAL_STORAGE_LINE_OF_RENTAL', 'LOCAL_STORAGE_DIVING_EVENTS', function(localStorageService, LOCAL_STORAGE_LINE_OF_RENTAL, LOCAL_STORAGE_DIVING_EVENTS){
	
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
											.getItem(LOCAL_STORAGE_LINE_OF_RENTAL));
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

    	var localStorageDivingEvents = localStorageService.read(LOCAL_STORAGE_DIVING_EVENTS);
    	
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
    	
    	var localStorageDivingEvents = localStorageService.read(LOCAL_STORAGE_DIVING_EVENTS);
    	
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

gasmRentServices.factory('lineOfRentalService', ['localStorageService', 'LOCAL_STORAGE_LINE_OF_RENTAL', function(localStorageService, LOCAL_STORAGE_LINE_OF_RENTAL){
	
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
		var linesOfRentalFromTheLocalStorage = localStorageService.read(LOCAL_STORAGE_LINE_OF_RENTAL);

		var linesOfRentalArrays = new Array();
	
		if (linesOfRentalFromTheLocalStorage != null) {
			$.each(linesOfRentalFromTheLocalStorage, function(idx2,
					oneRentalRecord) {
				linesOfRentalArrays.push(oneRentalRecord);
			});
		}

		linesOfRentalArrays.push(JSON.stringify(theNewLineOfRental));
		localStorageService.save(LOCAL_STORAGE_LINE_OF_RENTAL, linesOfRentalArrays);
		
		return theNewLineOfRental;
    };
    
    var getAllRentalsByDivingIdAndUserId = function(divingEventId, userId){
    	
    	var linesOfRentalFromTheLocalStorage = localStorageService.read(LOCAL_STORAGE_LINE_OF_RENTAL);
    	
    	//alert('linesOfRentalFromTheLocalStorage=' + linesOfRentalFromTheLocalStorage);
    	
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


gasmRentServices.factory('divingEventService', ['localStorageService', 'LOCAL_STORAGE_LINE_OF_RENTAL', 'LOCAL_STORAGE_DIVING_EVENTS', function(localStorageService, LOCAL_STORAGE_LINE_OF_RENTAL, LOCAL_STORAGE_DIVING_EVENTS){
	
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
											.getItem(LOCAL_STORAGE_LINE_OF_RENTAL));
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

    	var localStorageDivingEvents = localStorageService.read(LOCAL_STORAGE_DIVING_EVENTS);
    	
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
    	
    	var localStorageDivingEvents = localStorageService.read(LOCAL_STORAGE_DIVING_EVENTS);
    	
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

gasmRentServices.factory('barcodeScannerService', ['equipmentService', '$window', function(equipmentService, $window){
	
	var scanAnEquipmentId = function(divingEventId, userId){
		
		logMessage("doScanForEquipmentDetail start");

		logMessage("cordova.plugins.barcodeScanner");
		
		cordova.plugins.barcodeScanner.scan(
	      function (result) {
	    	  
	    	  var scanResult = "We got a barcode\n" + "Result: " + result.text + "\n"
	  			+ "Format: " + result.format + "\n" + "Cancelled: "
	  			+ result.cancelled;
	    	  
	    	  logMessage(scanResult);
	  		
	    	  if (result.cancelled == false && result.format == "QR_CODE") {
	    		  if(divingEventId == undefined && userId == undefined){
	    			  $window.location = "#/viewEquipmentDetail/" + result.text;
	    		  }else{
	    			  equipmentService.rent(divingEventId, userId, result.text);
	    		  }
	    	  } else {
	    		  alert("Le scan n''est pas valide : " + scanResult);
	    	  }
	      }, 
	      function (error) {
	    	  alert("Le scan n''a pas abouti : " + error);
	      }
	   );
		
		logMessage("doScanForEquipmentDetail end");
	}
    
	return {
		scanAnEquipmentId: scanAnEquipmentId
	}
}]);

gasmRentServices.factory('billingRecordService', ['localStorageService', 'LOCAL_STORAGE_PAYMENT_BY_USER', 'LOCAL_STORAGE_LINE_OF_RENTAL', function(localStorageService, LOCAL_STORAGE_PAYMENT_BY_USER, LOCAL_STORAGE_LINE_OF_RENTAL){
	
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
		
		var localStorageVarName = LOCAL_STORAGE_PAYMENT_BY_USER;
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
		
		localStorageService.save(LOCAL_STORAGE_PAYMENT_BY_USER, paymentByUserAndDivingEventArrayStringify);
    };
    
    var getAllRentalsByDivingIdAndUserId = function(divingEventId, userId){
    	
    	var linesOfRentalFromTheLocalStorage = localStorageService.read(LOCAL_STORAGE_LINE_OF_RENTAL);
    	
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

gasmRentServices.factory('backendService', ['localStorageService', 'URL_GET_USERS', 'LOCAL_STORAGE_USERS', 
                                            'URL_GET_DIVING_EVENT', 'LOCAL_STORAGE_DIVING_EVENTS', 
                                            'URL_GET_EQUIPMENT', 'LOCAL_STORAGE_EQUIPMENTS', 
                                            'URL_GET_ALL_RENTED_EQUIPMENT', 'LOCAL_STORAGE_RENTED_EQUIPMENTS', 
                                            'URL_GET_PAYMENT_TYPE', 'LOCAL_STORAGE_PAYMENT_TYPE', 
                                            'LOCAL_STORAGE_PAYMENT_BY_USER', 'LOCAL_STORAGE_LINE_OF_RENTAL', 'URL_PUT_NEW_RENTAL_RECORD',
                                            'PAYMENT_BY_COIN','PAYMENT_BY_CHECK','URL_PUT_TO_PAY_A_RENTAL_RECORDS',
                                            function(localStorageService, 
                                            		URL_GET_USERS, LOCAL_STORAGE_USERS, 
                                            		URL_GET_DIVING_EVENT, LOCAL_STORAGE_DIVING_EVENTS, 
                                            		URL_GET_EQUIPMENT, LOCAL_STORAGE_EQUIPMENTS, 
                                            		URL_GET_ALL_RENTED_EQUIPMENT, LOCAL_STORAGE_RENTED_EQUIPMENTS,
                                            		URL_GET_PAYMENT_TYPE, LOCAL_STORAGE_PAYMENT_TYPE, 
                                            		LOCAL_STORAGE_PAYMENT_BY_USER, LOCAL_STORAGE_LINE_OF_RENTAL, URL_PUT_NEW_RENTAL_RECORD,
                                            		PAYMENT_BY_COIN, PAYMENT_BY_CHECK, URL_PUT_TO_PAY_A_RENTAL_RECORDS){
	
    var pullUsers = function(){
    	
    	var userArray = [];
    	
    	var urlComplete = URL_GET_USERS;

    	jQuery.ajax({
    		type : "GET",
    		url : urlComplete,
    		contentType : "application/json; charset=utf-8",
    		dataType : "json",
    		success : function(data, status, jqXHR) {

    			//var items = [];
    			var compteur = 0;

    			$.each(data, function(i, item) {
    				userArray.push("{\"id\":" + item.id + ",\"firstName\":\""
    						+ item.firstName + "\",\"lastName\":\"" + item.lastName
    						+ "\"}");
    				compteur++;
    			});

    			localStorageService.save(LOCAL_STORAGE_USERS, userArray);
    			//localStorageService.save(LOCAL_STORAGE_USERS, JSON.stringify(items));

    			$('#users').html(userOnline(compteur));

    			$('#pageDescription').html(online);
    		},
    		error : function(jqXHR, status) {

    			var localStorageUsers = JSON.parse(window.localStorage
    					.getItem(LOCAL_STORAGE_USERS));

    			var compteur = 0;

    			$.each(localStorageUsers, function(i, oneUser) {

    				var jsonUser = JSON.parse(oneUser);
    				compteur++;
    			});

    			$('#pageDescription').html(offline);
    			$('#users').html(userOffline(compteur));
    		}
    	});
    	
    	return userArray;
    }
    
    var pullDivingEvents = function(){
    	
    	var urlComplete = URL_GET_DIVING_EVENT;
    	
    	//alert('urlComplete=' + urlComplete);
    	
    	var resultArray = [];

    	jQuery
    			.ajax({
    				type : "GET",
    				url : urlComplete,
    				contentType : "application/json; charset=utf-8",
    				dataType : "json",
    				success : function(data, status, jqXHR) {

    					//var items = [];
    					var compteur = 0;
    					
    					//alert('data=' + data);

    					$
    							.each(
    									data,
    									function(i, item) {
    										
    										//alert('item=' + item);

    										var threshold = (item.billingType.billingThreshold == undefined ? -1
    												: item.billingType.billingThreshold);

    										resultArray.push("{\"id\":" + item.id
    												+ ",\"place\":\"" + item.place
    												+ "\",\"date\":\"" + item.date
    												+ "\",\"billingThreshold\":"
    												+ threshold + "}");

    										compteur++;
    									});

    					localStorageService.save(
    							LOCAL_STORAGE_DIVING_EVENTS, resultArray);

    					//alert('localStorageService.save');
    					
    					$("#divingEvent").html(divingEventOnline(compteur));
    				},
    				error : function(jqXHR, status) {

    					// alert("offline mode");

    					var localStorageDivingEvents = JSON
    							.parse(window.localStorage
    									.getItem(LOCAL_STORAGE_DIVING_EVENTS));

    					// alert(localStorageUsers);
    					var compteur = 0;

    					$.each(localStorageDivingEvents,
    							function(i, oneDivingEvent) {

    								// alert(oneUser);

    								var jsonDivingEvent = JSON
    										.parse(oneDivingEvent);
    								// alert("lieu="+jsonDivingEvent.lieu);
    								compteur++;
    							});

    					$('#divingEvent').html(divingEventOffline(compteur));
    				}
    			});
    	return resultArray;
    }
    
    var pullEquipments = function(){
    	
    	var resultArray = [];

    	// var debuging = true;
    	var debuging = false;

    	var urlComplete = URL_GET_EQUIPMENT;

    	if (debuging) {
    		alert(urlComplete);
    	}

    	jQuery.ajax({
    		type : "GET",
    		url : urlComplete,
    		contentType : "application/json; charset=utf-8",
    		dataType : "json",
    		success : function(data, status, jqXHR) {

    			if (debuging) {
    				alert("online mode");
    			}

    			//var equipments = [];
    			var compteur = 0;

    			$.each(data, function(i, item) {

    				if (debuging) {
    					alert("item=" + JSON.stringify(item));
    					alert("item.reference=" + item.reference);
    				}

    				if (item.type == "Tank") {

    					if (debuging) {
    						alert("ok");

    						alert("reference:" + item.reference);
    						alert("brand:" + item.brand);
    						alert("serialNumber:" + item.serialNumber);
    						alert("material:" + item.material);
    						alert("gaz:" + item.gaz);
    						alert("screw:" + item.screw);
    						alert("weight:" + item.weight);
    						alert("buildDate:" + item.buildDate);
    						alert("operatingPressure:" + item.operatingPressure);
    						alert("testPressure:" + item.testPressure);
    						alert("punch:" + item.punch);
    						alert("lastDateOfTIV:" + item.lastDateOfTIV);
    						alert("status:" + item.status);
    						alert("type:" + item.type);
    						alert("price:" + item.price);
    						alert("rented:" + item.rented);
    					}
    					/**
    					 * { "reference":"215", "brand":"Roth", "historyList":[],
    					 * "serialNumber":"5555555215", "material":"Steal",
    					 * "gaz":"Air", "screw":"Air", "weight":20.0,
    					 * "capacity":"Litre_12", "buildDate":1406073600000,
    					 * "operatingPressure":200.0, "testPressure":300.0,
    					 * "testDate":1406678400000, "punch":false,
    					 * "lastDateOfTIV":1406678400000, "status":false,
    					 * "type":"Tank", "price":4.5, "rented":false,
    					 * "renterFullName":null, "created":true }
    					 */

    					resultArray.push("{\"reference\":\"" + item.reference
    							+ "\",\"brand\":\"" + item.brand
    							+ "\",\"serialNumber\":\"" + item.serialNumber
    							+ "\",\"material\":\"" + item.material
    							+ "\",\"gaz\":\"" + item.gaz + "\",\"screw\":\""
    							+ item.screw + "\",\"weight\":\"" + item.weight
    							+ "\",\"buildDate\":\"" + item.buildDate
    							+ "\",\"operatingPressure\":\""
    							+ item.operatingPressure + "\",\"testPressure\":\""
    							+ item.testPressure + "\",\"punch\":\""
    							+ item.punch + "\",\"lastDateOfTIV\":\""
    							+ item.lastDateOfTIV + "\",\"status\":\""
    							+ item.status + "\",\"type\":\"" + item.type
    							+ "\",\"price\":\"" + item.price + "\",\"rented\":"
    							+ item.rented + "}");
    				} else {
    					if (debuging) {
    						alert("ko");
    					}

    					resultArray.push("{\"reference\":\"" + item.reference
    							+ "\",\"type\":\"" + item.type + "\",\"price\":"
    							+ item.price + ",\"rented\":" + item.rented + "}");
    				}

    				compteur++;
    			});

    			if (debuging) {
    				alert("items=" + JSON.stringify(resultArray));
    			}

    			localStorageService.save(LOCAL_STORAGE_EQUIPMENTS, resultArray);

    			$('#equipments').html(equipmentOnline(compteur));
    		},
    		error : function(jqXHR, status) {

    			// alert("offline mode" + JSON.parse(jqXHR));
    			// alert("offline mode" + status);

    			var localStorageEquipments = JSON.parse(window.localStorage
    					.getItem(LOCAL_STORAGE_EQUIPMENTS));

    			// alert(localStorageUsers);
    			var compteur = 0;

    			$.each(localStorageEquipments, function(i, oneElement) {

    				// alert(oneUser);

    				var jsonOneElement = JSON.parse(oneElement);
    				// alert("reference="+jsonOneElement.reference);
    				compteur++;
    			});

    			$('#equipments').html(equipmentOffline(compteur));
    		}
    	});
    	
    	return resultArray;
    }
    
    var pullRentedEquipments = function(){
    	
    	var resultArray = [];

    	// var debuging = true;
    	var debuging = false;

    	var urlComplete = URL_GET_ALL_RENTED_EQUIPMENT;

    	if (debuging) {
    		alert(urlComplete);
    	}

    	jQuery.ajax({
    		type : "GET",
    		url : urlComplete,
    		contentType : "application/json; charset=utf-8",
    		dataType : "json",
    		success : function(data, status, jqXHR) {

    			if (debuging) {
    				alert("online mode");
    			}

    			//var rentedEquipments = [];
    			var compteur = 0;

    			$.each(data, function(i, item) {

    				if (debuging) {
    					alert("item=" + JSON.stringify(item));
    					alert("item.reference=" + item.reference);
    				}

    				if (debuging) {
    					alert("ok");

    					alert("reference:" + item.reference);
    					alert("rented:" + item.rented);
    					alert("renterFullName:" + item.renterFullName);
    				}

    				resultArray.push("{\"reference\":\"" + item.reference
    						+ "\",\"renterFullName\":\"" + item.renterFullName
    						+ "\",\"rented\":" + item.rented + "}");
    				compteur++;
    			});

    			if (debuging) {
    				alert("resultArray=" + JSON.stringify(resultArray));
    			}

    			localStorageService.save(LOCAL_STORAGE_RENTED_EQUIPMENTS, resultArray);
    			
    			$('#listOfRentedItems').html(rentedEquipmentsOffline(compteur));
    		},
    		error : function(jqXHR, status) {

    			// alert("offline mode" + JSON.parse(jqXHR));
    			// alert("offline mode" + status);

    			var localStorageEquipments = JSON.parse(window.localStorage
    					.getItem(LOCAL_STORAGE_EQUIPMENTS));

    			// alert(localStorageUsers);
    			var compteur = 0;

    			$.each(localStorageEquipments, function(i, oneElement) {

    				// alert(oneUser);

    				var jsonOneElement = JSON.parse(oneElement);
    				// alert("reference="+jsonOneElement.reference);
    				compteur++;
    			});

    			$('#listOfRentedItems').html(rentedEquipmentsOffline(compteur));
    		}
    	});
    }
    
    var pullPaymentType = function(){
    	
    	var resultArray = [];
    	var urlComplete = URL_GET_PAYMENT_TYPE;

    	// alert(urlComplete);

    	jQuery.ajax({
    		type : "GET",
    		url : urlComplete,
    		contentType : "application/json; charset=utf-8",
    		dataType : "json",
    		success : function(data, status, jqXHR) {

    			// alert("online mode");

    			//var paymentTypes = [];
    			var compteur = 0;

    			$.each(data, function(i, item) {

    				// alert(JSON.stringify(item));

    				resultArray.push(item);

    				compteur++;
    			});

    			// alert(JSON.stringify(paymentTypes));

    			localStorageService.save(LOCAL_STORAGE_PAYMENT_TYPE, resultArray);
    			
    			// alert("ok");
    			$('#paymentTypes').html(paymentTypesOnline(compteur));
    		},
    		error : function(jqXHR, status) {

    			var localStoragePaymentTypes = JSON.parse(window.localStorage
    					.getItem(LOCAL_STORAGE_PAYMENT_TYPE));

    			var compteur = 0;

    			$.each(localStoragePaymentTypes, function(i, oneElement) {
    				compteur++;
    			});

    			$('#paymentTypes').html(paymentTypesOffline(compteur));
    		}
    	});
    	
    	return resultArray;
    }
    
    var pushLinesOfRental = function(divingEventId){

    	// var debug = true;
    	var debug = false;

    	var paymentByUserAndDivingEventArrayStringify = window.localStorage
    			.getItem(LOCAL_STORAGE_PAYMENT_BY_USER);

    	if (debug === true) {
    		alert("paymentByUserAndDivingEventArrayStringify="
    				+ paymentByUserAndDivingEventArrayStringify);
    	}

    	var paymentByUserAndDivingEventArrayJSON = JSON
    			.parse(paymentByUserAndDivingEventArrayStringify);

    	if (debug === true) {
    		alert("paymentByUserAndDivingEventArrayJSON="
    				+ paymentByUserAndDivingEventArrayJSON);
    	}

    	var rentalRecordsStringFromLocalStorage = JSON.parse(window.localStorage
    			.getItem(LOCAL_STORAGE_LINE_OF_RENTAL));

    	var rentalRecordArrays = new Array();

    	$.each(rentalRecordsStringFromLocalStorage,
    			function(idx2, oneRentalRecord) {
    				rentalRecordArrays.push(oneRentalRecord);
    			});

    	$
    			.each(
    					rentalRecordArrays,
    					function(i, oneElement) {

    						var currentElementJSON = JSON.parse(oneElement);
    						var paramToSend = "?dEventId="
    								+ currentElementJSON.divingEventId
    								+ "&renterId=" + currentElementJSON.userId
    								+ "&equipmentId="
    								+ currentElementJSON.equipmentId;

    						if (debug === true) {
    							alert(paramToSend);
    						}

    						var urlComplete = URL_PUT_NEW_RENTAL_RECORD
    								+ paramToSend;

    						if (debug === true) {
    							alert(urlComplete);
    						}

    						jQuery
    								.ajax({
    									url : urlComplete,
    									type : "PUT",
    									contentType : "application/json; charset=utf-8",
    									data : "",
    									success : function(data) {
    										// la synchronisation s'est correctement
    										// déroulé
    										alert("Synchronisation");

    										if (debug === true) {
    											alert("data=" + data);
    										}

    										var jsonResponseStringify = JSON
    												.stringify(data);

    										if (debug === true) {
    											alert("jsonResponseStringify="
    													+ jsonResponseStringify);
    										}

    										var jsonResponse = JSON
    												.parse(jsonResponseStringify);
    										if (debug === true) {
    											alert("jsonResponse="
    													+ jsonResponse);
    										}

    										var idOfTheRentalRecord = jsonResponse.id;

    										if (debug === true) {
    											alert("idOfTheRentalRecord="
    													+ idOfTheRentalRecord);
    										}

    										var paymentModeOfTheUser = null;

    										$
    												.each(
    														paymentByUserAndDivingEventArrayJSON,
    														function(idx3,
    																onePayment) {

    															if (debug === true) {
    																alert("onePayment.userId="
    																		+ onePayment.userId
    																		+ " currentElementJSON.userId="
    																		+ currentElementJSON.userId);
    																alert("onePayment.divingEventId="
    																		+ onePayment.divingEventId
    																		+ " currentElementJSON.divingEventId="
    																		+ currentElementJSON.divingEventId);
    															}

    															if (currentElementJSON.userId == onePayment.userId
    																	&& currentElementJSON.divingEventId == onePayment.divingEventId) {

    																if (debug === true) {
    																	alert("we have found a payment entry : find");
    																	alert("onePayment.paymentMode="
    																			+ onePayment.paymentMode);
    																}
    																paymentModeOfTheUser = onePayment.paymentMode;
    																return false;
    															}
    															if (debug === true) {
    																alert("next");
    															}
    														});

    										if (debug === true) {
    											alert("paymentModeOfTheUser="
    													+ paymentModeOfTheUser);
    										}

    										if (paymentModeOfTheUser != null) {
    											if (paymentModeOfTheUser == true) {
    												// COIN
    												paymentModeOfTheUser = PAYMENT_BY_COIN;
    											} else if (paymentModeOfTheUser == false) {
    												// CHECK
    												paymentModeOfTheUser = PAYMENT_BY_CHECK;
    											}

    											var urlCompleteToPay = URL_PUT_TO_PAY_A_RENTAL_RECORDS
    													+ idOfTheRentalRecord
    													+ "?payment="
    													+ paymentModeOfTheUser;

    											if (debug === true) {
    												alert("urlCompleteToPay="
    														+ urlCompleteToPay);
    											}
    											// "https://gasmrent-webapp.appspot.com/api/rentalRecord/paid/"{rentalRecordId}?payment={typeDePayment}

    											jQuery
    													.ajax({
    														url : urlCompleteToPay,
    														type : "PUT",
    														contentType : "application/json; charset=utf-8",
    														data : "",
    														success : function(data) {

    															if (debug === true) {
    																alert("payment envoyé");
    															}
    														},
    														error : function(e) {
    															alert(JSON
    																	.stringify(e));
    														}
    													});
    										} else {
    											if (debug === true) {
    												alert("no payment");
    											}
    										}
    									},
    									error : function(e) {
    										alert(JSON.stringify(e));
    									}
    								});
    					});
    }
    
	return {
		pullUsers:pullUsers,
		pullDivingEvents:pullDivingEvents,
		pullEquipments:pullEquipments,
		pullRentedEquipments:pullRentedEquipments,
		pullPaymentType:pullPaymentType,
		pushLinesOfRental:pushLinesOfRental
	}
}]);