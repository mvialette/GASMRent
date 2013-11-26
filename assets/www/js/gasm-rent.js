function initLanguages() {
	var userLang = navigator.language || navigator.userLanguage;
	userLang = userLang.substring(0, 2);
	loadBundles(userLang);
}

function synchronizeUsers() {
	var urlComplete = "https://mindful-girder-344.appspot.com/api/adherent/";

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

			window.localStorage.setItem("users", JSON.stringify(items));

			document.getElementById('users').innerHTML = userOnline(compteur);

			// document.getElementById("users").innerHTML = "Online mode : " +
			// compteur + " users updated in local storage";
		},
		error : function(jqXHR, status) {

			// alert("offline mode");

			var localStorageUsers = JSON.parse(window.localStorage
					.getItem('users'));

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
	var urlComplete = "https://mindful-girder-344.appspot.com/api/divingEvent/";

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

					$.each(data, function(i, item) {
						var threshold = (item.billingThreshold==undefined?-1:item.billingThreshold);
						
						items.push("{\"id\":" + item.id + ",\"place\":\""
								+ item.place + "\",\"date\":\"" + item.date
								+ "\",\"billingThreshold\":" + threshold + "}");
						
						compteur++;
					});
					// alert(items);

					window.localStorage.setItem("divingEvents", JSON
							.stringify(items));
					
					document.getElementById('divingEvent').innerHTML = divingEventOnline(compteur);
				},
				error : function(jqXHR, status) {

					// alert("offline mode");

					var localStorageDivingEvents = JSON
							.parse(window.localStorage.getItem("divingEvents"));

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
	var urlComplete = "https://mindful-girder-344.appspot.com/api/equipment";
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
								+ "\",\"type\":\"" + item.type + "\",\"price\":" + item.price + ",\"rented\":" + item.rented + "}");
						
						compteur++;
					});
					// alert(JSON.stringify(items));

					window.localStorage.setItem("equipments", JSON
							.stringify(equipments));
					
					document.getElementById('equipments').innerHTML = equipmentOnline(compteur);
				},
				error : function(jqXHR, status) {

					// alert("offline mode");

					var localStorageEquipments = JSON.parse(window.localStorage
							.getItem("equipments"));

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

	var rentalRecordsStringFromLocalStorage = JSON
			.parse(window.localStorage.getItem("rentalRecords"));
	
	var rentalRecordArrays = new Array();
	
	$.each(rentalRecordsStringFromLocalStorage, function(idx2,oneRentalRecord) {
		rentalRecordArrays.push(oneRentalRecord);
	});
	
	$.each(rentalRecordArrays, function(i, oneElement) {
		var currentElementJSON = JSON.parse(oneElement);
		alert("dEventId="+currentElementJSON.divingEventId + "&renterId=" + currentElementJSON.userId + "&equipmentId="+currentElementJSON.equipmentId);
		
		/* 
		 var urlComplete = "https://mindful-girder-344.appspot.com/api/rentalRecord/addToDivingEvent";
		alert(urlComplete);
		
		jQuery
			.ajax({
				url : urlComplete,
				type : "PUT",
				contentType : "application/json; charset=utf-8",
				data: "dEventId=5078785942618112&renterId=5644257041842176&equipmentId=931",
				success: function(data) {
					alert('send put ok:' + data);
				},
				error: function(e) {
					alert(JSON.stringify(e));
				    console.log(e); 
				}
			}
		); 
		alert("end");
		*/
	});
}

function getInfosOfEquipments() {

	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem("equipments"));

	//alert(localStorageEquipments);
	var compteur = 0;

	var items = "";

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);
		var typeLocalized;
		
		if(jsonOneElement.type == 'Tank'){
			typeLocalized = tank;
		}else if(jsonOneElement.type == 'Regulator'){
			typeLocalized = regulator;
		} else if(jsonOneElement.type == 'Jacket'){
			typeLocalized = jacket;
		} 
		
		items = items + "<li>" + typeLocalized + " n° <b>" + jsonOneElement.reference + "</b></li>";

		compteur++;
	});
	
	document.getElementById("liste").innerHTML = items;
}

function getInfosOfDivingEvents() {

	var localStorageDivingEvents = JSON.parse(window.localStorage
			.getItem("divingEvents"));

	var items = "<select id=\"selectDivingEvents\">";

	$.each(localStorageDivingEvents, function(i, oneElement) {
		var jsonOneElement = JSON.parse(oneElement);
		items = items + "<option value=\""+ jsonOneElement.id + "\">" + jsonOneElement.place + " le " + parseDate(jsonOneElement.date) +  "</option>";
	});
	
	items = items + "</select>";
	
	document.getElementById("divingEvents").innerHTML = items;
}


function getInfosOfUsers() {

	var localStorageUsers = JSON.parse(window.localStorage
			.getItem("users"));
	var items = "<select id=\"selectUsers\">";

	$.each(localStorageUsers, function(i, oneElement) {
		var jsonOneElement = JSON.parse(oneElement);
		items = items + "<option value=\""+ jsonOneElement.id + "\">" + jsonOneElement.firstName + " " + jsonOneElement.lastName +  "</option>";
	});
	
	items = items + "</select>";
	document.getElementById("users").innerHTML = items;
}


function parseDate(dateObject) {
    var theDate = new Date(parseInt(dateObject));
    return theDate.getDate() + "/" + (theDate.getMonth() + 1) + "/" + theDate.getFullYear(); //jQuery.datepicker.parseDate( "yy-mm-dd", d);
};

function doScan(divingEventId, userId) {
	
	window.plugins.barcodeScanner.scan(function(result) {

			if (result.cancelled == false && result.format == "QR_CODE") {
				var leTextDuQRCode = result.text;
				/* alert("We got a qrcode = " + leTextDuQRCode); */
				
				window.location = "scan.html?equipmentId=" + leTextDuQRCode + "&divingEventId=" + divingEventId + "&userId=" + userId;
			} else {
				//alert("Le scan n'a pas abouti");
			}
		}, function(error) {
			//alert("Scanning failed: " + error);
		});
	
}

function getEquipmentsByDivingEventId(divingEventId) {
	 $("#summaryByDivingEventDescription").html(
			 summaryByDivingEventDescription(divingEventId, '20/11/2013'));

	var rentalRecordsStringFromLocalStorage = JSON
			.parse(window.localStorage.getItem("rentalRecords"));
	
	var rentalRecordArrays = new Array();
	
	$.each(rentalRecordsStringFromLocalStorage, function(idx2,oneRentalRecord) {
		rentalRecordArrays.push(oneRentalRecord);
	});
	
	var listOfPendingRentalRecords = "<ul>";
	
	$.each(rentalRecordArrays, function(i, oneElement) {

		var currentElementJSON = JSON.parse(oneElement);
		
		if (currentElementJSON.divingEventId == divingEventId) {
			listOfPendingRentalRecords = listOfPendingRentalRecords + "<li>" +currentElementJSON.userId + " : " + currentElementJSON.equipmentId + "</li>";
		}
	});
	
	listOfPendingRentalRecords = listOfPendingRentalRecords + "</ul>";
	$("#listOfPendingRentalRecords").html(listOfPendingRentalRecords); 
}

function getURLParameter(key){
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search); 
	return result && unescape(result[1]) || ""; 
}

function getEquipmentById(equipmentId){
	
	var result = null;
	
	var Equipment = function(equipmentId, type, price, rented){
	    this.equipmentId = equipmentId;
	    this.type = type;
	    this.price = price;
	    this.rented = rented;
	    this.getPrice = function(){
	    	return this.price;
	    }
	}
		
	var localStorageEquipments = JSON.parse(window.localStorage
			.getItem("equipments"));

	$.each(localStorageEquipments, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);
		
		if(equipmentId == jsonOneElement.reference){
			result = new Equipment(jsonOneElement.reference,jsonOneElement.type,jsonOneElement.price,jsonOneElement.rented);
			return false;
		}
	});
	
	return result;
}

function getDivingEventById(divingEventId) {
	var result = null;
	
	var DivingEvent = function(divingEventId, place, date, billingThreshold){
	    this.divingEventId = divingEventId;
	    this.place = place;
	    this.date = date;
	    this.billingThreshold = billingThreshold;
	}

	$.extend(DivingEvent.prototype, {
		getDivingEventId: function() {
	    	return this.divingEventId;
		},
		getPlace: function() {
	    	return this.place;
		},
		getDate: function() {
	    	return this.date;
		},
		getBillingThreshold: function() {
	    	return this.billingThreshold;
		},
		getUserPrice: function(userId) {
			var result = 0;
			var theDivingEventId =  this.divingEventId;
			
			var rentalRecordsStringFromLocalStorage = JSON.parse(window.localStorage.getItem("rentalRecords"));
			var rentalRecordArrays = new Array();
				
			$.each(rentalRecordsStringFromLocalStorage, function(idx2,oneRentalRecord) {                    
				rentalRecordArrays.push(oneRentalRecord);
			});
	
			$.each(rentalRecordArrays, function(i, oneElement) {
				var currentElementJSON = JSON.parse(oneElement);
				if (currentElementJSON.divingEventId == theDivingEventId && currentElementJSON.userId == userId) {
					var anEquipment = getEquipmentById(currentElementJSON.equipmentId);
					result = result + anEquipment.getPrice();
				}
			});
			
			alert("diving event ceilling = " + this.billingThreshold);
			alert("result = " + result);
			if(this.billingThreshold == null){
				// there is no ceilling
			}else if(this.billingThreshold == -1){
				// this case the diving event if free.
				result = 0; 
			}else if(result > this.billingThreshold){
				// if the result if greater thant the ceiling of the diving event, then we have to retur the billingThreshold
				result = this.billingThreshold;
			}
			
	    	return result;
		}
	});
	
	var localStorageDivingEvents = JSON.parse(window.localStorage
			.getItem("divingEvents"));
	
	
	$.each(localStorageDivingEvents, function(i, oneElement) {

		var jsonOneElement = JSON.parse(oneElement);
		
		if(divingEventId == jsonOneElement.id){
			result = new DivingEvent(jsonOneElement.id, jsonOneElement.place, parseDate(jsonOneElement.date), jsonOneElement.billingThreshold);
			return false;
		} 
	});

	return result;
}