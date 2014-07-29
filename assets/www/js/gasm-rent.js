var gasmRentApp = angular.module('GasmRentApp', []);

gasmRentApp.controller('MainController', ['$scope', function ($scope) {
	// Magie du contrôleur
	    $scope.text = 'Hello, Angular fanatic.';
}]);

function getConstants() {
	var constants = {
		"URL_GET_USERS" : "https://.appspot.com/api/adherent/",
		"URL_GET_DIVING_EVENT" : "https://gasmrent-webapp.appspot.com/api/divingEvent/",
		"URL_GET_EQUIPMENT" : "https://gasmrent-webapp.appspot.com/api/equipment/",
		"URL_GET_PAYMENT_TYPE" : "https://gasmrent-webapp.appspot.com/api/payment",
		"URL_SEND_RENTAL_RECORDS" : "https://gasmrent-webapp.appspot.com/api/rentalRecord/addToDivingEvent",
		"URL_TO_PAY_A_RENTAL_RECORDS" : "https://gasmrent-webapp.appspot.com/api/rentalRecord/paid/",
		"LOCAL_STORAGE_USERS" : "offlineUsers",
		"LOCAL_STORAGE_DIVING_EVENTS" : "offlineDivingEvents",
		"LOCAL_STORAGE_EQUIPMENTS" : "offlineEquipments",
		"LOCAL_STORAGE_LINE_OF_RENTAL" : "lineOfRental",
		"LOCAL_STORAGE_PAYMENT_TYPE" : "offlinePaymentType",
		"LOCAL_STORAGE_PAYMENT_BY_USER" : "offlinePaymentByUser",
		"PAYMENT_BY_COIN" : "Liquide",
		"PAYMENT_BY_CHECK" : "Ch%C3%A8que"
	};

	return constants;
}

function initLanguages() {
	var userLang = navigator.language || navigator.userLanguage;
	userLang = userLang.substring(0, 2);
	loadBundles(userLang);
}

function synchronizeUsers() {
	var urlComplete = getConstants().URL_GET_USERS;

	jQuery.ajax({
		type : "GET",
		url : urlComplete,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(data, status, jqXHR) {

			alert("online mode");
			var items = [];
			var compteur = 0;

			$.each(data, function(i, item) {
				items.push("{\"id\":" + item.id + ",\"firstName\":\""
						+ item.firstName + "\",\"lastName\":\"" + item.lastName
						+ "\"}");
				compteur++;
			});
			// alert(items);

			window.localStorage.setItem(getConstants().LOCAL_STORAGE_USERS,
					JSON.stringify(items));

			document.getElementById('users').innerHTML = userOnline(compteur);

			// document.getElementById("users").innerHTML = "Online mode : " +
			// compteur + " users updated in local storage";
		},
		error : function(jqXHR, status) {

			alert("offline mode" + JSON.parse(jqXHR));
			alert("offline mode" + status);

			var localStorageUsers = JSON.parse(window.localStorage
					.getItem(getConstants().LOCAL_STORAGE_USERS));

			// alert(localStorageUsers);
			var compteur = 0;

			$.each(localStorageUsers, function(i, oneUser) {

				// alert(oneUser);

				var jsonUser = JSON.parse(oneUser);
				// alert("firstName="+jsonUser.firstName);
				compteur++;
			});

			document.getElementById('users').innerHTML = userOffline(compteur);
		}
	});
}

function synchronizeDivingEvents() {
	var urlComplete = getConstants().URL_GET_DIVING_EVENT;

	jQuery
		.ajax({
			type : "GET",
			url : urlComplete,
			contentType : "application/json; charset=utf-8",
			dataType : "json",
			success : function(data, status, jqXHR) {

				var items = [];
				var compteur = 0;
				
				$.each(
					data,
					function(i, item) {
						
						var threshold = (item.billingType.billingThreshold == undefined ? -1
								: item.billingType.billingThreshold);
						
						items.push("{\"id\":" + item.id
								+ ",\"place\":\"" + item.place
								+ "\",\"date\":\"" + item.date
								+ "\",\"billingThreshold\":"
								+ threshold + "}");

						compteur++;
					}
				);

				window.localStorage.setItem(
						getConstants().LOCAL_STORAGE_DIVING_EVENTS, JSON
								.stringify(items));

				document.getElementById('divingEvent').innerHTML = divingEventOnline(compteur);
			},
			error : function(jqXHR, status) {

				// alert("offline mode");

				var localStorageDivingEvents = JSON
						.parse(window.localStorage
								.getItem(getConstants().LOCAL_STORAGE_DIVING_EVENTS));

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

				document.getElementById('divingEvent').innerHTML = divingEventOffline(compteur);
			}
		}
	);
}

function synchronizeEquipments() {
	
	//var debuging = true;
	var debuging = false;
	
	var urlComplete = getConstants().URL_GET_EQUIPMENT;

	if(debuging){
		alert(urlComplete);	
	}

	jQuery
			.ajax({
				type : "GET",
				url : urlComplete,
				contentType : "application/json; charset=utf-8",
				dataType : "json",
				success : function(data, status, jqXHR) {

					if(debuging){
						alert("online mode");
					}

					var equipments = [];
					var compteur = 0;

					$.each(data, function(i, item) {
					
						if(debuging){
							alert("item=" + JSON.stringify(item));
							alert("item.reference=" + item.reference);
						}
						
						if(item.type == "Tank"){

							if(debuging){
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
							* {
							* 	"reference":"215",
							* 	"brand":"Roth",
							* 	"historyList":[],
							* 	"serialNumber":"5555555215",
							* 	"material":"Steal",
							* 	"gaz":"Air",
							* 	"screw":"Air",
							* 	"weight":20.0,
							* 	"capacity":"Litre_12",
							* 	"buildDate":1406073600000,
							* 	"operatingPressure":200.0,
							* 	"testPressure":300.0,
							* 	"testDate":1406678400000,
							* 	"punch":false,
							* 	"lastDateOfTIV":1406678400000,
							* 	"status":false,
							* 	"type":"Tank",
							* 	"price":4.5,
							* 	"rented":false,
							* 	"renterFullName":null,
							* 	"created":true
							* }
							*/
							
							equipments.push("{\"reference\":\"" + item.reference
									+ "\",\"brand\":\"" + item.brand
									+ "\",\"serialNumber\":\"" + item.serialNumber
									+ "\",\"material\":\"" + item.material
									+ "\",\"gaz\":\"" + item.gaz
									+ "\",\"screw\":\"" + item.screw
									+ "\",\"weight\":\"" + item.weight
									+ "\",\"buildDate\":\"" + item.buildDate
									+ "\",\"operatingPressure\":\"" + item.operatingPressure
									+ "\",\"testPressure\":\"" + item.testPressure
									+ "\",\"punch\":\"" + item.punch
									+ "\",\"lastDateOfTIV\":\"" + item.lastDateOfTIV
									+ "\",\"status\":\"" + item.status
									+ "\",\"type\":\"" + item.type
									+ "\",\"price\":\"" + item.price
									+ "\",\"rented\":" + item.rented
									+ "}");
						}else{
							if(debuging){
								alert("ko");
							}
							
							equipments.push("{\"reference\":\"" + item.reference
									+ "\",\"type\":\"" + item.type
									+ "\",\"price\":" + item.price + ",\"rented\":"
									+ item.rented + "}");
						}
						
						
						compteur++;
					});
					
					if(debuging){
						alert("items=" + JSON.stringify(equipments));
					}

					window.localStorage.setItem(
							getConstants().LOCAL_STORAGE_EQUIPMENTS, JSON
									.stringify(equipments));

					document.getElementById('equipments').innerHTML = equipmentOnline(compteur);
				},
				error : function(jqXHR, status) {

					//alert("offline mode" + JSON.parse(jqXHR));
					//alert("offline mode" + status);

					var localStorageEquipments = JSON.parse(window.localStorage
							.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));

					// alert(localStorageUsers);
					var compteur = 0;

					$.each(localStorageEquipments, function(i, oneElement) {

						// alert(oneUser);

						var jsonOneElement = JSON.parse(oneElement);
						// alert("reference="+jsonOneElement.reference);
						compteur++;
					});

					document.getElementById('equipments').innerHTML = equipmentOffline(compteur);
				}
			});
}

function synchronizePaymentType() {
	var urlComplete = getConstants().URL_GET_PAYMENT_TYPE;
	
	//alert(urlComplete);

	jQuery
			.ajax({
				type : "GET",
				url : urlComplete,
				contentType : "application/json; charset=utf-8",
				dataType : "json",
				success : function(data, status, jqXHR) {

					//alert("online mode");

					var paymentTypes = [];
					var compteur = 0;

					$.each(data, function(i, item) {

						//alert(JSON.stringify(item));
						
						paymentTypes.push(item);

						compteur++;
					});
					
					//alert(JSON.stringify(paymentTypes));

					window.localStorage.setItem(
							getConstants().LOCAL_STORAGE_PAYMENT_TYPE, JSON
									.stringify(paymentTypes));

					//alert("ok");
					document.getElementById('paymentTypes').innerHTML = paymentTypesOnline(compteur);
				},
				error : function(jqXHR, status) {

					alert("offline mode");

					var localStoragePaymentTypes = JSON.parse(window.localStorage
							.getItem(getConstants().LOCAL_STORAGE_PAYMENT_TYPE));

					// alert(localStorageUsers);
					var compteur = 0;

					$.each(localStoragePaymentTypes, function(i, oneElement) {

						// alert(oneUser);

						var jsonOneElement = JSON.parse(oneElement);
						// alert("reference="+jsonOneElement.reference);
						compteur++;
					});

					document.getElementById('paymentTypes').innerHTML = paymentTypesOffline(compteur);
				}
			});
}

function sendLinesOfRental(divingEventId) {
	
	var paymentByUserAndDivingEventArrayStringify = window.localStorage.getItem(getConstants().LOCAL_STORAGE_PAYMENT_BY_USER);
	//alert("paymentByUserAndDivingEventArrayStringify="+paymentByUserAndDivingEventArrayStringify);
	
	var paymentByUserAndDivingEventArrayJSON = JSON.parse(paymentByUserAndDivingEventArrayStringify);
	//alert("paymentByUserAndDivingEventArrayJSON="+paymentByUserAndDivingEventArrayJSON);
	
	var rentalRecordsStringFromLocalStorage = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL));

	var rentalRecordArrays = new Array();

	$.each(rentalRecordsStringFromLocalStorage,
			function(idx2, oneRentalRecord) {
				rentalRecordArrays.push(oneRentalRecord);
		}
	);

	$.each(rentalRecordArrays, 
		function(i, oneElement) {
			var currentElementJSON = JSON.parse(oneElement);
			var paramToSend = "?dEventId=" + currentElementJSON.divingEventId
				+ "&renterId=" + currentElementJSON.userId + "&equipmentId="
				+ currentElementJSON.equipmentId;
			
			//alert(paramToSend);

			var urlComplete = getConstants().URL_SEND_RENTAL_RECORDS + paramToSend;
//			//alert(urlComplete);
	
			jQuery.ajax({
				url : urlComplete,
				type : "PUT",
				contentType : "application/json; charset=utf-8",
				data : "",
				success : function(data) {
					//la synchronisation s'est correctement déroulé
					alert("Synchronisation");
					
					//TODO : payment gesture
					var idOfTheRentalRecord = data;
					
					currentElementJSON.userId
					
					//alert("currentElementJSON.userId="+currentElementJSON.userId);
					//alert("currentElementJSON.divingEventId="+currentElementJSON.divingEventId);
					
					var paymentModeOfTheUser = null;
					
					$.each(paymentByUserAndDivingEventArrayJSON,
							function(idx3, onePayment) {
						
								//alert("onePayment.userId="+onePayment.userId);
								//alert("onePayment.divingEventId="+onePayment.divingEventId);
								
								if(currentElementJSON.userId == onePayment.userId && currentElementJSON.divingEventId == onePayment.divingEventId){
									// we have found a payment entry
									//alert("find");
									//alert("onePayment.paymentMode="+onePayment.paymentMode);
									paymentModeOfTheUser=onePayment.paymentMode;
									return false;
								}
								//alert("next");
						}
					);
					
					//alert("paymentModeOfTheUser="+paymentModeOfTheUser);
					
					if(paymentModeOfTheUser != null){
						if(paymentModeOfTheUser == true){
							//COIN
							paymentModeOfTheUser = getConstants().PAYMENT_BY_COIN;
						}else if(paymentModeOfTheUser == false){
							//CHECK
							paymentModeOfTheUser = getConstants().PAYMENT_BY_CHECK;
						}
						
						var urlCompleteToPay = getConstants().URL_TO_PAY_A_RENTAL_RECORDS + idOfTheRentalRecord + "?payment=" + paymentModeOfTheUser;
						//alert("urlCompleteToPay="+urlCompleteToPay);
						//"https://gasmrent-webapp.appspot.com/api/rentalRecord/paid/"{rentalRecordId}?payment={typeDePayment}
						
						jQuery.ajax({
							url : urlCompleteToPay,
							type : "PUT",
							contentType : "application/json; charset=utf-8",
							data : "",
							success : function(data) {
								alert("payment send");
							},
							error : function(e) {
								alert(JSON.stringify(e));
							}
						});
					}else{
						alert("no payment");
					}
				},
				error : function(e) {
					alert(JSON.stringify(e));
				}
			});
		}
	);
}

function getInfosOfEquipmentsToList() {

	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));

	//alert(localStorageEquipments);
	
	var compteur = 0;

	var items = "";

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);
		
//		alert(jsonOneElement);
		
//		var typeLocalized;
//
//		if (jsonOneElement.type == 'Tank') {
//			typeLocalized = tank;
//		} else if (jsonOneElement.type == 'Regulator') {
//			typeLocalized = regulator;
//		} else if (jsonOneElement.type == 'Jacket') {
//			typeLocalized = jacket;
//		} else if (jsonOneElement.type == 'Suit') {
//			typeLocalized = suit;
//		}
		
		var anEquipment = getEquipmentById(jsonOneElement.reference);
		items = items + "<li><a href=\"./viewEquipmentDetail.html?equipmentId="+ anEquipment.equipmentId +"\">"+ anEquipment.equipmentId + "</a></li>";
		
		compteur++;
	});

	document.getElementById("equipments").innerHTML = items;
}

function getInfosOfEquipmentsForSelect() {

	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));
	
	var items = "<select id=\"selectEquipments\" class=\"form-control\">";

	items = items + "<option value=\"null\"></option>";
	
	$.each(localStorageEquipments, function(i, oneElement) {
		var jsonOneElement = JSON.parse(oneElement);
		
		var anEquipment = getEquipmentById(jsonOneElement.reference);
		
		items = items + "<option value=\"" + jsonOneElement.reference + "\">"
				+ anEquipment.toString() + "</option>";
	});

	items = items + "</select>";

	document.getElementById("equipments").innerHTML = items;
}

function getInfosOfDivingEventsForSelect() {

	var localStorageDivingEvents = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_DIVING_EVENTS));

	var items = "<select id=\"selectDivingEvents\" class=\"form-control\">";

	$.each(localStorageDivingEvents, function(i, oneElement) {
		var jsonOneElement = JSON.parse(oneElement);
		items = items + "<option value=\"" + jsonOneElement.id + "\">"
				+ jsonOneElement.place + " le "
				+ parseDate(jsonOneElement.date) + "</option>";
	});

	items = items + "</select>";

	document.getElementById("divingEvents").innerHTML = items;
}

function getPaymentTypeFromLocalStorage() {
	
	var localStoragePaymentTypes = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_PAYMENT_TYPE));

	var items = "<select id=\"paymentType\" class=\"form-control\">";

	$.each(localStoragePaymentTypes, function(i, oneElement) {
		
		items = items + "<option value=\"" + oneElement + "\">"
				+ oneElement + "</option>";
	});

	items = items + "</select>";
	
	$("#paymentType").html(items);
}

function getInfosOfUsers() {

	var localStorageUsers = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_USERS));
	var items = "<select id=\"selectUsers\" class=\"form-control\">";

	$.each(localStorageUsers, function(i, oneElement) {
		var jsonOneElement = JSON.parse(oneElement);
		items = items + "<option value=\"" + jsonOneElement.id + "\">"
				+ jsonOneElement.firstName + " " + jsonOneElement.lastName
				+ "</option>";
	});

	items = items + "</select>";
	document.getElementById("users").innerHTML = items;
}

function parseDate(dateObject) {
	var theDate = new Date(parseInt(dateObject));
	return theDate.getDate() + "/" + (theDate.getMonth() + 1) + "/"
			+ theDate.getFullYear(); // jQuery.datepicker.parseDate(
	// "yy-mm-dd", d);
};

function isEquipmentAvailableForRent(equipmentId) {
	var result = true;
	//alert("equipment cherche " + equipmentId);
	var localStorageRentalRecords = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL));
	//alert("localStorageRentalRecords" + localStorageRentalRecords);
	
	//is it an knowing reference
	var anIdentifiedEquipment = getEquipmentById(equipmentId);
	
	//alert("anIdentifiedEquipment=" + anIdentifiedEquipment);
	
	if(anIdentifiedEquipment == null){
		result = false;
	}else{
		if (localStorageRentalRecords != null) {
			$.each(localStorageRentalRecords, function(i, aRentalRecord) {

				var jsonRentalRecord = JSON.parse(aRentalRecord);
				//alert(jsonRentalRecord.equipmentId);
				if (jsonRentalRecord.equipmentId == equipmentId) {
					result = false;
					return false;
				}
			});
		}
	}
	
	//alert("end"+result);
	return result;
}

function rentAnEquipment(divingEventId, userId, equipmentId){

	// we have to know if this equipment is available for rent
	if (isEquipmentAvailableForRent(equipmentId)) {
		window.location = "scan.html?equipmentId=" + equipmentId
				+ "&divingEventId=" + divingEventId + "&userId="
				+ userId;
	} else {
		// Do not comment or delete this alert, it's use to send feedback message to the user
		alert(messageErrorEquipmentNotAvailable(equipmentId));
	}
}

function doScanByDivingEventIdAndUserId(divingEventId, userId) {

	window.plugins.barcodeScanner.scan(function(result) {

		if (result.cancelled == false && result.format == "QR_CODE") {
			rentAnEquipment(divingEventId, userId, result.text);
		} else {
			// alert("Le scan n'a pas abouti");
		}
	}, function(error) {
		// alert("Scanning failed: " + error);
	});

}

function doScanForEquipmentDetail() {

	window.plugins.barcodeScanner.scan(function(result) {

		if (result.cancelled == false && result.format == "QR_CODE") {
			viewItemDetail(result.text);
		} else {
			// alert("Le scan n'a pas abouti");
		}
	}, function(error) {
		// alert("Scanning failed: " + error);
	});

}

function viewItemDetail(equipmentId){

	// we have to know if this equipment is available for rent
	if (isEquipmentAvailableForRent(equipmentId)) {
		window.location = "viewEquipmentDetail.html?equipmentId=" + equipmentId;
	} else {
		// Do not comment or delete this alert, it's use to send feedback message to the user
		alert(messageErrorEquipmentNotAvailable(equipmentId));
	}
}

function getEquipmentsByDivingEventId(divingEventId) {
	
	var aDivingEvent = getDivingEventById(divingEventId);
	
	$("#summaryByDivingEventDescription").html(
			summaryByDivingEventDescription(aDivingEvent.getPlace(), aDivingEvent.getDate()));

	var rentalRecordsStringFromLocalStorage = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL));

	var rentalRecordArrays = new Array();

	$.each(rentalRecordsStringFromLocalStorage,
			function(idx2, oneRentalRecord) {
				rentalRecordArrays.push(oneRentalRecord);
			});

	var listOfPendingRentalRecords = "<ul>";

	$.each(rentalRecordArrays, function(i, oneElement) {

		var currentElementJSON = JSON.parse(oneElement);

		alert(JSON.stringify(currentElementJSON));
		
		if (currentElementJSON.divingEventId == divingEventId) {
			
			var aUserObject = getUserById(currentElementJSON.userId);
			
			var anEquipmentObject = getEquipmentById(currentElementJSON.equipmentId);
			
			listOfPendingRentalRecords = listOfPendingRentalRecords + "<li>"
					+ aUserObject.toString() + " : "
					+ anEquipmentObject.toString() + "</li>";
		}
	});

	listOfPendingRentalRecords = listOfPendingRentalRecords + "</ul>";
	$("#listOfPendingRentalRecords").html(listOfPendingRentalRecords);
}

function getURLParameter(key) {
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
	return result && unescape(result[1]) || "";
}

function getNewEquipmentById(equipmentId) {

	var result = null;

	var NewEquipment = function(jsonOneElement) {
		
		this.jsonOneElement = jsonOneElement;
		
		this.toCompleteString = function() {
			
			var otherFields = '';
			//alert(jsonOneElement);
      		for (var oneAttribute in jsonOneElement) {
      			//alert(oneAttribute);
      			//alert(jsonOneElement[oneAttribute]);
      			var valeurAAfficher = null;
      			
      			//alert("oneAttribute=" + oneAttribute + ", test=" + oneAttribute.indexOf("Date"));
      			
      			if(oneAttribute.indexOf("date") != -1 || oneAttribute.indexOf("Date") != -1) {
      				
      				//var maintenant = new Date(jsonOneElement[oneAttribute]);
      				//valeurAAfficher = maintenant.getDate() + '/' + (maintenant.getMonth() + 1)  + '/' + maintenant.getFullYear();
      				
      				valeurAAfficher = formatTimestamp(jsonOneElement[oneAttribute]);
      			}else{
      				valeurAAfficher = jsonOneElement[oneAttribute];
      			}
      			
      			otherFields = otherFields + "<br>"+  jQuery.i18n.prop(oneAttribute) + " = <b>" + valeurAAfficher + "</b>";
      		}
      		
			return otherFields;
		}
	}
	
	
	/**
	 * brand
				serialNumber
				material
				gaz
				screw
				weight
				buildDate
				operatingPressure
				testPressure
				punch
				lastDateOfTIV
				status
				type
				price
				rented
	 */
	
	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);

		if (equipmentId == jsonOneElement.reference) {
			
			result = new NewEquipment(jsonOneElement); 
			
			/*result = new Equipment(jsonOneElement.reference,
					jsonOneElement.type, jsonOneElement.price,
					jsonOneElement.rented, jsonOneElement.serialNumber);
			*/
//			result.prototype.getSerialNumber = function(){
//				return jsonOneElement.serialNumber;
//			}
			
//			result.prototype.toCompleteString2 = function() {
//				
//				otherFields = otherFields + "<br><br>Prix="+ price;
//				otherFields = otherFields + "<br><br>rented="+ rented;
//				otherFields = otherFields + "<br><br>serial=";//+ getSerialNumber();
//				
//				return frenchType + " n°<b>"+equipmentId+"</b>" + otherFields;
//			}
			return false;
		}
	});

	return result;
}

function getEquipmentById(equipmentId) {

	var result = null;

	var Equipment = function(equipmentId, type, price, rented, serialNumber) {
		this.equipmentId = equipmentId;
		this.type = type;
		this.price = price;
		this.rented = rented;
		this.serialNumber = serialNumber;
		
		this.getPrice = function() {
			return this.price;
		}, this.getType = function() {
			return this.type;
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
			
			return frenchType + " n°<b>"+equipmentId+"</b>";
		}, this.toCompleteString = function() {
			
			var frenchType = this.type;
			var otherFields = "";
			
			switch (this.type) {
			case "Tank":
				frenchType = tank;
				
				otherFields = otherFields + "<br><br>Prix="+ price;
				otherFields = otherFields + "<br><br>rented="+ rented;
				otherFields = otherFields + "<br><br>serialNumber="+ serialNumber;
				
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
			
			return frenchType + " n°<b>"+equipmentId+"</b>" + otherFields;
		}
	}
	/*
	var NewEquipment = function(jsonOneElement) {
		
		this.jsonOneElement = jsonOneElement;
		
		this.toCompleteString = function() {
			
			var otherFields = null;
			alert(jsonOneElement);
      		for (var oneAttribute in jsonOneElement) {
      			alert(oneAttribute);
      			alert(jsonOneElement[oneAttribute]);
      			otherFields = otherFields + "<br>"+ $.i18n(oneAttribute) + "=" + jsonOneElement[oneAttribute];
      		}
      		
			return otherFields;
		}
	}
	*/
	
	/**
	 * brand
				serialNumber
				material
				gaz
				screw
				weight
				buildDate
				operatingPressure
				testPressure
				punch
				lastDateOfTIV
				status
				type
				price
				rented
	 */
	
	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);

		if (equipmentId == jsonOneElement.reference) {
			
			//result = new NewEquipment(jsonOneElement); 
			
			result = new Equipment(jsonOneElement.reference,
					jsonOneElement.type, jsonOneElement.price,
					jsonOneElement.rented, jsonOneElement.serialNumber);
			
//			result.prototype.getSerialNumber = function(){
//				return jsonOneElement.serialNumber;
//			}
			
//			result.prototype.toCompleteString2 = function() {
//				
//				otherFields = otherFields + "<br><br>Prix="+ price;
//				otherFields = otherFields + "<br><br>rented="+ rented;
//				otherFields = otherFields + "<br><br>serial=";//+ getSerialNumber();
//				
//				return frenchType + " n°<b>"+equipmentId+"</b>" + otherFields;
//			}
			return false;
		}
	});

	return result;
}

function getDivingEventById(divingEventId) {
	var result = null;

	var DivingEvent = function(divingEventId, place, date, billingThreshold) {
		this.theDivingEventId = divingEventId;
		this.place = place;
		this.date = date;
		this.billingThreshold = billingThreshold;
		this.toString = function() {
			return "<b>" + this.place + "</b> le <b>" + this.date+"</b>";
		}
	}

	$.extend(
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
							}
						);

						$.each(
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
							}
						);
					}

					result = maxPriceForTank + maxPriceForRegulator
							+ maxPriceForJacket + maxPriceForSuit;

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

	var localStorageDivingEvents = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_DIVING_EVENTS));

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
}

function getUserById(userId) {

	var result = null;

	var User = function(aUserId, firstName, lastName) {
		this.id = aUserId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.toString = function() {
			return this.firstName + " " + this.lastName;
		};
	}

	var localStorageUsers = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_USERS));

	$.each(localStorageUsers, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);

		if (userId == jsonOneElement.id) {
			result = new User(jsonOneElement.id, jsonOneElement.firstName,
					jsonOneElement.lastName);
			return false;
		}
	});

	return result;
}

function formatTimestamp(d){
    // padding function
    var s = function(p){
        return (''+p).length<2?'0'+p:''+p;
    };
    
    var dateTmp = null;
    // default parameter
    if (typeof d === 'undefined'){
        dateTmp = new Date();
    }else  if (typeof d === 'number'){
        dateTmp = new Date(d);
    }else  if (typeof d === 'string'){
        dateTmp = new Date(parseInt(d));
    }
    
    return s(dateTmp.getDate()) + '-' +
        s(dateTmp.getMonth()+1) + '-' +
        dateTmp.getFullYear();
}