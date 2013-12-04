function getConstants() {
	var constants = {
		"URL_GET_USERS" : "https://mindful-girder-344.appspot.com/api/adherent/",
		"URL_GET_DIVING_EVENT" : "https://mindful-girder-344.appspot.com/api/divingEvent/",
		"URL_GET_EQUIPMENT" : "https://mindful-girder-344.appspot.com/api/equipment/",
		"URL_SEND_RENTAL_RECORDS" : "https://mindful-girder-344.appspot.com/api/rentalRecord/addToDivingEvent",
		"LOCAL_STORAGE_USERS" : "offlineUsers",
		"LOCAL_STORAGE_DIVING_EVENTS" : "offlineDivingEvents",
		"LOCAL_STORAGE_EQUIPMENTS" : "offlineEquipments",
		"LOCAL_STORAGE_LINE_OF_RENTAL" : "lineOfRental"
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

			// alert("online mode");
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

			// alert("offline mode");

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

					// alert("online mode");
					var items = [];
					var compteur = 0;

					$
							.each(
									data,
									function(i, item) {
										var threshold = (item.billingThreshold == undefined ? -1
												: item.billingThreshold);

										items.push("{\"id\":" + item.id
												+ ",\"place\":\"" + item.place
												+ "\",\"date\":\"" + item.date
												+ "\",\"billingThreshold\":"
												+ threshold + "}");

										compteur++;
									});
					// alert(items);

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
			});
}

function synchronizeEquipments() {
	var urlComplete = getConstants().URL_GET_EQUIPMENT;
	// alert(urlComplete);

	jQuery
			.ajax({
				type : "GET",
				url : urlComplete,
				contentType : "application/json; charset=utf-8",
				dataType : "json",
				success : function(data, status, jqXHR) {

					// alert("online mode");

					var equipments = [];
					var compteur = 0;

					$.each(data, function(i, item) {

						equipments.push("{\"reference\":\"" + item.reference
								+ "\",\"type\":\"" + item.type
								+ "\",\"price\":" + item.price + ",\"rented\":"
								+ item.rented + "}");

						compteur++;
					});
					// alert(JSON.stringify(items));

					window.localStorage.setItem(
							getConstants().LOCAL_STORAGE_EQUIPMENTS, JSON
									.stringify(equipments));

					document.getElementById('equipments').innerHTML = equipmentOnline(compteur);
				},
				error : function(jqXHR, status) {

					// alert("offline mode");

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

function sendRentalRecords(divingEventId) {

	var rentalRecordsStringFromLocalStorage = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL));

	var rentalRecordArrays = new Array();

	$.each(rentalRecordsStringFromLocalStorage,
			function(idx2, oneRentalRecord) {
				rentalRecordArrays.push(oneRentalRecord);
			});

	$.each(rentalRecordArrays, function(i, oneElement) {
		var currentElementJSON = JSON.parse(oneElement);
		var paramToSend = "?dEventId=" + currentElementJSON.divingEventId
				+ "&renterId=" + currentElementJSON.userId + "&equipmentId="
				+ currentElementJSON.equipmentId;
		alert(paramToSend);

		var urlComplete = getConstants().URL_SEND_RENTAL_RECORDS + paramToSend;
		alert(urlComplete);

		jQuery.ajax({
			url : urlComplete,
			type : "PUT",
			contentType : "application/json; charset=utf-8",
			data : "",
			success : function(data) {
				alert('send put ok:' + data);
			},
			error : function(e) {
				alert(JSON.stringify(e));
				console.log(e);
			}
		});
		alert("end");
	});
}

function getInfosOfEquipments() {

	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));

	// alert(localStorageEquipments);
	var compteur = 0;

	var items = "";

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);
		var typeLocalized;

		if (jsonOneElement.type == 'Tank') {
			typeLocalized = tank;
		} else if (jsonOneElement.type == 'Regulator') {
			typeLocalized = regulator;
		} else if (jsonOneElement.type == 'Jacket') {
			typeLocalized = jacket;
		}

		items = items + "<li>" + typeLocalized + " n° <b>"
				+ jsonOneElement.reference + "</b></li>";

		compteur++;
	});

	document.getElementById("liste").innerHTML = items;
}

function getInfosOfDivingEvents() {

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
	// alert("equipment cherche " + equipmentId);
	var localStorageRentalRecords = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL));
	// alert("localStorageRentalRecords" + localStorageRentalRecords);
	if (localStorageRentalRecords != null) {
		$.each(localStorageRentalRecords, function(i, aRentalRecord) {

			var jsonRentalRecord = JSON.parse(aRentalRecord);
			alert(jsonRentalRecord.equipmentId);
			if (jsonRentalRecord.equipmentId == equipmentId) {
				result = false;
				return false;
			}
		});
	}

	// alert("end"+result);
	return result;
}

function doScan(divingEventId, userId) {

	window.plugins.barcodeScanner.scan(function(result) {

		if (result.cancelled == false && result.format == "QR_CODE") {
			var leTextDuQRCode = result.text;
			/* alert("We got a qrcode = " + leTextDuQRCode); */

			// we have to know if this equipment is available for rent
			if (isEquipmentAvailableForRent(leTextDuQRCode)) {
				window.location = "scan.html?equipmentId=" + leTextDuQRCode
						+ "&divingEventId=" + divingEventId + "&userId="
						+ userId;
			} else {
				alert(messageErrorEquipmentNotAvailable(leTextDuQRCode));
			}
		} else {
			// alert("Le scan n'a pas abouti");
		}
	}, function(error) {
		// alert("Scanning failed: " + error);
	});

}

function getEquipmentsByDivingEventId(divingEventId) {
	$("#summaryByDivingEventDescription").html(
			summaryByDivingEventDescription(divingEventId, '20/11/2013'));

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

		if (currentElementJSON.divingEventId == divingEventId) {
			listOfPendingRentalRecords = listOfPendingRentalRecords + "<li>"
					+ currentElementJSON.userId + " : "
					+ currentElementJSON.equipmentId + "</li>";
		}
	});

	listOfPendingRentalRecords = listOfPendingRentalRecords + "</ul>";
	$("#listOfPendingRentalRecords").html(listOfPendingRentalRecords);
}

function getURLParameter(key) {
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
	return result && unescape(result[1]) || "";
}

function getEquipmentById(equipmentId) {

	var result = null;

	var Equipment = function(equipmentId, type, price, rented) {
		this.equipmentId = equipmentId;
		this.type = type;
		this.price = price;
		this.rented = rented;
		this.getPrice = function() {
			return this.price;
		}, this.getType = function() {
			return this.type;
		}
	}

	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);

		if (equipmentId == jsonOneElement.reference) {
			result = new Equipment(jsonOneElement.reference,
					jsonOneElement.type, jsonOneElement.price,
					jsonOneElement.rented);
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

							var regulatorRented = false;
							var tankRented = false;
							var jacketRented = false;

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
																if(tankRented == false){
																	result = result
																	+ anEquipment
																			.getPrice();
																	tankRented = true;
																}
																break;
															case "Regulator":
																if(regulatorRented == false){
																	result = result
																	+ anEquipment
																			.getPrice();
																	regulatorRented = true;
																}
	
																break;
															case "Jacket":
																if(jacketRented == false){
																	result = result
																	+ anEquipment
																			.getPrice();
																	jacketRented = true;
																}
																break;
															default:
																break;
														}
													}
												});
							}

							if (this.billingThreshold != null
									&& this.billingThreshold != -1
									&& result > this.billingThreshold) {
								// if the result if greater thant the ceiling of
								// the diving event, then we have to retur the
								// billingThreshold
								result = this.billingThreshold;
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
