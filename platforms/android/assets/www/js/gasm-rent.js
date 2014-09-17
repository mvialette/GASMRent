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

function getInfosOfEquipmentsToList() {

	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_EQUIPMENTS));

	// alert(localStorageEquipments);

	var compteur = 0;

	var items = "";

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);

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
	var debug = false;
	//var debug = true;

	if (debug === true) {
		alert(message);
	}
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