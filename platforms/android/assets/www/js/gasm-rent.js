function getConstants() {
	var constants = {
		"URL_GET_USERS" : "https://gasmrent-webapp.appspot.com/api/adherent/",
		"URL_GET_DIVING_EVENT" : "https://gasmrent-webapp.appspot.com/api/divingEvent/",
		"URL_GET_EQUIPMENT" : "https://gasmrent-webapp.appspot.com/api/equipment/",
		"URL_GET_ALL_RENTED_EQUIPMENT" : "http://gasmrent-webapp.appspot.com/api/equipment/findAllRented",
		"URL_GET_PAYMENT_TYPE" : "https://gasmrent-webapp.appspot.com/api/payment",
		"URL_GET_RENTAL_RECORDS" : "https://gasmrent-webapp.appspot.com/api/rentalRecord/",
		"URL_PUT_NEW_RENTAL_RECORD" : "https://gasmrent-webapp.appspot.com/api/rentalRecord/addToDivingEvent",
		"URL_PUT_TO_PAY_A_RENTAL_RECORDS" : "https://gasmrent-webapp.appspot.com/api/rentalRecord/paid/",
		"METHOD_TURN_IN" : "turnIn",
		"LOCAL_STORAGE_USERS" : "offlineUsers",
		"LOCAL_STORAGE_DIVING_EVENTS" : "offlineDivingEvents",
		"LOCAL_STORAGE_EQUIPMENTS" : "offlineEquipments",
		"LOCAL_STORAGE_RENTED_EQUIPMENTS" : "offlineRentedEquipments",
		"LOCAL_STORAGE_LINE_OF_RENTAL" : "lineOfRental",
		"LOCAL_STORAGE_PAYMENT_TYPE" : "offlinePaymentType",
		"LOCAL_STORAGE_PAYMENT_BY_USER" : "offlinePaymentByUser",
		"PAYMENT_BY_COIN" : "Liquide",
		"PAYMENT_BY_CHECK" : "Ch%C3%A8que"
	};

	return constants;
}

function getHtmlForBoolean(boolean) {
	var result = null;
	if (boolean == "true" || boolean === true) {
		result = "<span class=\"fa-stack\"><i class=\"fa fa-square-o fa-stack-2x\"></i><i class=\"fa fa-check fa-stack-1x\"></i></span>"
	} else if (boolean == "false" || boolean === false) {
		result = "<span class=\"fa-stack\"><i class=\"fa fa-square-o fa-stack-2x\"></i><i class=\"fa fa-times fa-stack-1x\"></i></span>";
	}

	return result;
}

function importDatas() {

	$('#pageDescription').html("Synchronizing...");

	// We ask the synchronize of users informations
	synchronizeUsers();

	// We ask the synchronize of diving events
	synchronizeDivingEvents();

	// We ask the synchronize of equipment informations
	synchronizeEquipments();

	// We ask the synchronize the payment type
	synchronizePaymentType();

	// Import all rented items
	synchronizeRentedEquipments();
}

function synchronizeUsers() {

	var urlComplete = getConstants().URL_GET_USERS;

	jQuery.ajax({
		type : "GET",
		url : urlComplete,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(data, status, jqXHR) {

			var items = [];
			var compteur = 0;

			$.each(data, function(i, item) {
				items.push("{\"id\":" + item.id + ",\"firstName\":\""
						+ item.firstName + "\",\"lastName\":\"" + item.lastName
						+ "\"}");
				compteur++;
			});

			window.localStorage.setItem(getConstants().LOCAL_STORAGE_USERS,
					JSON.stringify(items));

			$('#users').html(userOnline(compteur));

			$('#pageDescription').html(online);
		},
		error : function(jqXHR, status) {

			var localStorageUsers = JSON.parse(window.localStorage
					.getItem(getConstants().LOCAL_STORAGE_USERS));

			var compteur = 0;

			$.each(localStorageUsers, function(i, oneUser) {

				var jsonUser = JSON.parse(oneUser);
				compteur++;
			});

			$('#pageDescription').html(offline);
			$('#users').html(userOffline(compteur));
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

					$
							.each(
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
									});

					window.localStorage.setItem(
							getConstants().LOCAL_STORAGE_DIVING_EVENTS, JSON
									.stringify(items));

					$("#divingEvent").html(divingEventOnline(compteur));
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

					$('#divingEvent').html(divingEventOffline(compteur));
				}
			});
}

function synchronizeEquipments() {

	// var debuging = true;
	var debuging = false;

	var urlComplete = getConstants().URL_GET_EQUIPMENT;

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

			var equipments = [];
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

					equipments.push("{\"reference\":\"" + item.reference
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

					equipments.push("{\"reference\":\"" + item.reference
							+ "\",\"type\":\"" + item.type + "\",\"price\":"
							+ item.price + ",\"rented\":" + item.rented + "}");
				}

				compteur++;
			});

			if (debuging) {
				alert("items=" + JSON.stringify(equipments));
			}

			window.localStorage.setItem(
					getConstants().LOCAL_STORAGE_EQUIPMENTS, JSON
							.stringify(equipments));

			$('#equipments').html(equipmentOnline(compteur));
		},
		error : function(jqXHR, status) {

			// alert("offline mode" + JSON.parse(jqXHR));
			// alert("offline mode" + status);

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

			$('#equipments').html(equipmentOffline(compteur));
		}
	});
}

function synchronizeRentedEquipments() {

	// var debuging = true;
	var debuging = false;

	var urlComplete = getConstants().URL_GET_ALL_RENTED_EQUIPMENT;

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

			var rentedEquipments = [];
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

				rentedEquipments.push("{\"reference\":\"" + item.reference
						+ "\",\"renterFullName\":\"" + item.renterFullName
						+ "\",\"rented\":" + item.rented + "}");
				compteur++;
			});

			if (debuging) {
				alert("rentedEquipments=" + JSON.stringify(rentedEquipments));
			}

			window.localStorage.setItem(
					getConstants().LOCAL_STORAGE_RENTED_EQUIPMENTS, JSON
							.stringify(rentedEquipments));

			$('#listOfRentedItems').html(rentedEquipmentsOffline(compteur));
		},
		error : function(jqXHR, status) {

			// alert("offline mode" + JSON.parse(jqXHR));
			// alert("offline mode" + status);

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

			$('#listOfRentedItems').html(rentedEquipmentsOffline(compteur));
		}
	});
}

function synchronizePaymentType() {
	var urlComplete = getConstants().URL_GET_PAYMENT_TYPE;

	// alert(urlComplete);

	jQuery.ajax({
		type : "GET",
		url : urlComplete,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(data, status, jqXHR) {

			// alert("online mode");

			var paymentTypes = [];
			var compteur = 0;

			$.each(data, function(i, item) {

				// alert(JSON.stringify(item));

				paymentTypes.push(item);

				compteur++;
			});

			// alert(JSON.stringify(paymentTypes));

			window.localStorage.setItem(
					getConstants().LOCAL_STORAGE_PAYMENT_TYPE, JSON
							.stringify(paymentTypes));

			// alert("ok");
			$('#paymentTypes').html(paymentTypesOnline(compteur));
		},
		error : function(jqXHR, status) {

			var localStoragePaymentTypes = JSON.parse(window.localStorage
					.getItem(getConstants().LOCAL_STORAGE_PAYMENT_TYPE));

			var compteur = 0;

			$.each(localStoragePaymentTypes, function(i, oneElement) {
				compteur++;
			});

			$('#paymentTypes').html(paymentTypesOffline(compteur));
		}
	});
}

function sendLinesOfRental(divingEventId) {

	// var debug = true;
	var debug = false;

	var paymentByUserAndDivingEventArrayStringify = window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_PAYMENT_BY_USER);

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
			.getItem(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL));

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

						var urlComplete = getConstants().URL_PUT_NEW_RENTAL_RECORD
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
												paymentModeOfTheUser = getConstants().PAYMENT_BY_COIN;
											} else if (paymentModeOfTheUser == false) {
												// CHECK
												paymentModeOfTheUser = getConstants().PAYMENT_BY_CHECK;
											}

											var urlCompleteToPay = getConstants().URL_PUT_TO_PAY_A_RENTAL_RECORDS
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

//function getInfosOfRentedEquipmentsToList() {
//
//	//var debug = true;
//	var debug = false;
//
//	var localStorageEquipments = JSON.parse(window.localStorage
//			.getItem(getConstants().LOCAL_STORAGE_RENTED_EQUIPMENTS));
//
//	if (debug) {
//		alert(debug);
//	}
//
//	var items = "<ul class=\"list-group\">";
//
//	$.each(localStorageEquipments, function(i, oneElement) {
//
//		var jsonOneElement = JSON.parse(oneElement);
//
//		if (debug) {
//			alert(jsonOneElement);
//		}
//
//		// items = items + "<li class=\"list-group-item\"><a
//		// href=\""
//		// + getConstants().URL_GET_EQUIPMENT +
//		// jsonOneElement.reference + "/" +
//		// getConstants().METHOD_TURN_IN + "\">" +
//		// jsonOneElement.reference + " (" +
//		// jsonOneElement.renterFullName + ")"
//		// + "</a></li>";
//		// http://gasmrent-webapp.appspot.com/api/equipment/214/
//
//		// <button type="button" class="btn btn-primary btn-sm"
//		// ng-click="turnIn(item)">Rendre</button>
//
//		items = items
//				+ "<li class=\"list-group-item\"><a href=\"./viewEquipmentDetail.html?equipmentId="
//				+ jsonOneElement.reference
//				+ "\">"
//				+ jsonOneElement.reference
//				+ "("
//				+ jsonOneElement.renterFullName
//				+ ") </a> <button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"turnIn("
//				+ jsonOneElement.reference
//				+ ")\">Rendre</button></li>";
//
//	});
//
//	items = items + "</ul>"
//
//	$("#listOfRentedItems").html(items);
//}

function getInfosOfEquipmentsToList() {

	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));

	// alert(localStorageEquipments);

	var compteur = 0;

	var items = "";

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);

		// alert(jsonOneElement);

		// var typeLocalized;
		//
		// if (jsonOneElement.type == 'Tank') {
		// typeLocalized = tank;
		// } else if (jsonOneElement.type == 'Regulator') {
		// typeLocalized = regulator;
		// } else if (jsonOneElement.type == 'Jacket') {
		// typeLocalized = jacket;
		// } else if (jsonOneElement.type == 'Suit') {
		// typeLocalized = suit;
		// }

		var anEquipment = getEquipmentById(jsonOneElement.reference);
		items = items + "<li><a href=\"#/viewEquipmentDetail/"
				+ anEquipment.equipmentId + "\">" + anEquipment.equipmentId
				+ "</a></li>";

		compteur++;
	});

	$("#equipments").html(items);
}

function getPaymentTypeFromLocalStorage() {

	var localStoragePaymentTypes = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_PAYMENT_TYPE));

	var items = "<select id=\"paymentType\" class=\"form-control\">";

	$.each(localStoragePaymentTypes, function(i, oneElement) {

		items = items + "<option value=\"" + oneElement + "\">" + oneElement
				+ "</option>";
	});

	items = items + "</select>";

	$("#paymentType").html(items);
}

function parseDate(dateObject) {
	var theDate = new Date(parseInt(dateObject));
	return theDate.getDate() + "/" + (theDate.getMonth() + 1) + "/"
			+ theDate.getFullYear(); // jQuery.datepicker.parseDate(
	// "yy-mm-dd", d);
};

function logMessage(message) {
	//var debug = false;
	var debug = true;

	if (debug === true) {
		alert(message);
	}
}

function doScanForEquipmentDetail() {

	logMessage("doScanForEquipmentDetail start");

	cordova.plugins.barcodeScanner.scan(function(result) {
		
		var scanResult = "We got a barcode\n" + "Result: " + result.text + "\n"
		+ "Format: " + result.format + "\n" + "Cancelled: "
		+ result.cancelled;
		
		logMessage(scanResult);
		
		if (result.cancelled == false && result.format == "QR_CODE") {
			viewItemDetail(result.text);
		}else{
			alert("Le scan n''est pas valide : " + scanResult);
		}
	}, function(error) {
		alert("Le scan n''a pas abouti : " + error);
	});

	logMessage("doScanForEquipmentDetail end");

}

function viewItemDetail(equipmentId) {

	// we have to know if this equipment is available for rent
	//if (isEquipmentAvailableForRent(equipmentId)) {
		window.location = "#/viewEquipmentDetail/" + equipmentId;
	//} else {
		// Do not comment or delete this alert, it's use to send feedback
		// message to the user
//		alert(messageErrorEquipmentNotAvailable(equipmentId));
	//}
}

function getEquipmentsByDivingEventId(divingEventId) {

	//alert(divingEventId);
	
	var aDivingEvent = getDivingEventById(divingEventId);

	//alert(aDivingEvent);
	
	$("#summaryByDivingEventDescription").html(
			summaryByDivingEventDescription(aDivingEvent.getPlace(),
					aDivingEvent.getDate()));

	var rentalRecordsStringFromLocalStorage = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL));

	var rentalRecordArrays = new Array();

	$.each(rentalRecordsStringFromLocalStorage,
			function(idx2, oneRentalRecord) {
				rentalRecordArrays.push(oneRentalRecord);
			});

	var listOfPendingRentalRecords = "<ul class=\"list-group\">";

	$
			.each(
					rentalRecordArrays,
					function(i, oneElement) {

						var currentElementJSON = JSON.parse(oneElement);

						// alert(JSON.stringify(currentElementJSON));

						if (currentElementJSON.divingEventId == divingEventId) {

							var aUserObject = getUserById(currentElementJSON.userId);

							var anEquipmentObject = getEquipmentById(currentElementJSON.equipmentId);

							listOfPendingRentalRecords = listOfPendingRentalRecords
									+ "<li class=\"list-group-item\">"
									+ aUserObject.toString()
									+ " : "
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
			// alert(jsonOneElement);
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
					valeurAAfficher = getHtmlForBoolean(jsonValue);
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

			return otherFields;
		}
	}

	/**
	 * brand serialNumber material gaz screw weight buildDate operatingPressure
	 * testPressure punch lastDateOfTIV status type price rented
	 */

	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);

		if (equipmentId == jsonOneElement.reference) {

			result = new NewEquipment(jsonOneElement);

			return false;
		}
	});

	return result;
}

function formatTimestamp(d) {
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

function turnIn(itemReference) {
	var urlToForward = getConstants().URL_GET_EQUIPMENT
			+ itemReference + "/" + getConstants().METHOD_TURN_IN;
	alert("toto=" + urlToForward);
}

function getEquipmentDetail(equipmentId) {
	
	var equiment = getNewEquipmentById(equipmentId);
	
	$("#description").html(equiment.toCompleteString());
}