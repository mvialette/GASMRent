function synchronizeUsers() {
	var urlComplete = "https://mindful-girder-344.appspot.com/api/adherent/";
	
	jQuery
	.ajax({
		type : "GET",
		url : urlComplete,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(data, status, jqXHR) {
			
			//alert("online mode");
			var items = [];
			var compteur = 0;
			
			$.each(data, function(i, item){
				items.push("{\"id\":" + 
						item.id + ",\"firstName\":\"" + item.firstName + "\",\"lastName\":\"" + item.lastName+"\"}");
				compteur++;
	         });
			//alert(items);
			
	        window.localStorage.setItem("users", JSON.stringify(items));
			
			document.getElementById("users").innerHTML = "Online mode : " + compteur + " users updated in local storage";
		},
		error : function(jqXHR, status) {
			
			// alert("offline mode");
			
		 	var localStorageUsers = JSON.parse(window.localStorage.getItem("users"));
		 	
		 	//alert(localStorageUsers);
			var compteur = 0;
			
		 	$.each(localStorageUsers, function(i, oneUser){
		 		
		 		//alert(oneUser);
		 		
		 		var jsonUser = JSON.parse(oneUser);
				//alert("firstName="+jsonUser.firstName);
				compteur++;
	         });

			document.getElementById("users").innerHTML = "Offline mode : Retreive " + compteur + " users from local storage";
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
			
			//alert("online mode");
			var items = [];
			var compteur = 0;
			
			$.each(data, function(i, item){
				items.push("{\"id\":" + 
						item.id + ",\"lieu\":\"" + item.lieu + "\",\"date\":\"" + item.date+"\"}");
				compteur++;
	         });
			//alert(items);
			
	        window.localStorage.setItem("divingEvents", JSON.stringify(items));
			
			document.getElementById("divingEvent").innerHTML = "Online mode : " + compteur + " divingEvents updated in local storage";
		},
		error : function(jqXHR, status) {
			
			// alert("offline mode");
			
		 	var localStorageDivingEvents = JSON.parse(window.localStorage.getItem("divingEvents"));
		 	
		 	//alert(localStorageUsers);
			var compteur = 0;
			
		 	$.each(localStorageDivingEvents, function(i, oneDivingEvent){
		 		
		 		//alert(oneUser);
		 		
		 		var jsonDivingEvent = JSON.parse(oneDivingEvent);
				//alert("lieu="+jsonDivingEvent.lieu);
				compteur++;
	         });

			document.getElementById("divingEvent").innerHTML = "Offline mode : Retreive " + compteur + " divingEvents from local storage";
		}
	});
}

function getInfosOfEquipments(){
	
	var localStorageEquipments = JSON.parse(window.localStorage.getItem("equipments"));
 	
 	//alert(localStorageUsers);
	var compteur = 0;
	
	var items = [];
	
	
	
 	$.each(localStorageEquipments, function(i, oneElement){
 		
 		//alert(oneUser);
 		var jsonOneElement = JSON.parse(oneElement);
 		
 		items.push("<li>id="
				+ jsonOneElement.reference + ", type=" + jsonOneElement.type+"</li>");
 		
 		//var jsonOneElement = JSON.parse(oneElement);
		//alert("reference="+jsonOneElement.reference);
		compteur++;
     });

 	document.getElementById("liste").innerHTML = items;
	//document.getElementById("equipments").innerHTML = "Offline mode : Retreive " + compteur + " equipments from local storage";
}

function getInfosFromJackets(jacketId){

	//alert("offline mode, search item=" + jacketId);
		
 	var localStorageUsers = JSON.parse(window.localStorage.getItem("jackets"));
 	
 	//alert(localStorageUsers);
	
	var itemReference = null;
	var itemType = null;
	
 	$.each(localStorageUsers, function(i, oneElement){
 		
 		//alert(oneUser);
 		
 		var jsonOneElement = JSON.parse(oneElement);
 		
 		var itemReferenceTmp = jsonOneElement.reference;
 		
 		//alert(itemReferenceTmp);
 		
 		if(jacketId == itemReferenceTmp){
 			itemReference = itemReferenceTmp;
 			itemType = jsonOneElement.type;
 			
 			return false;
 		}
 		
		//alert("reference="+jsonOneElement.reference);
     });

 	if(itemReference != null) {
 		document.getElementById("valeurDuQRCode").innerHTML = "Id=" + itemReference + " type=" + itemType;
 	}else{
 		document.getElementById("valeurDuQRCode").innerHTML = "Item not found";
 	}
}

function synchronizeJackets() {
	var urlComplete = "https://mindful-girder-344.appspot.com/api/jacket/";
	//alert(urlComplete);
	
	jQuery
	.ajax({
		type : "GET",
		url : urlComplete,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(data, status, jqXHR) {
			
			//alert("online mode");
			
			var items = [];
			var compteur = 0;
			
			$.each(data, function(i, item){
				
				items.push("{\"reference\":\"" + item.reference + "\",\"type\":\""+ item.reference +"\"}");
				
				compteur++;
	         });
			//alert(JSON.stringify(items));
			
	        window.localStorage.setItem("jackets", JSON.stringify(items));
			
			document.getElementById("jackets").innerHTML = "Online mode : " +  compteur + " jackets updated in local storage";
		},
		error : function(jqXHR, status) {
			
			//alert("offline mode");
			
		 	var localStorageUsers = JSON.parse(window.localStorage.getItem("jackets"));
		 	
		 	//alert(localStorageUsers);
			var compteur = 0;
			
		 	$.each(localStorageUsers, function(i, oneElement){
		 		
		 		//alert(oneUser);
		 		
		 		var jsonOneElement = JSON.parse(oneElement);
				//alert("reference="+jsonOneElement.reference);
				compteur++;
		     });

			document.getElementById("jackets").innerHTML = "Offline mode : Retreive " + compteur + " jackets from local storage";
		}
	});
}

function synchronizeEquipments() {
	var urlComplete = "https://mindful-girder-344.appspot.com/api/equipment";
	//alert(urlComplete);
	
	jQuery
	.ajax({
		type : "GET",
		url : urlComplete,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(data, status, jqXHR) {
			
			//alert("online mode");
			
			var equipments = [];
			var compteur = 0;
			
			$.each(data, function(i, item){
				
				equipments.push("{\"reference\":\"" + item.reference + "\",\"type\":\""+ item.type +"\"}");
				compteur++;
	         });
			//alert(JSON.stringify(items));
			
	        window.localStorage.setItem("equipments", JSON.stringify(equipments));
			
			document.getElementById("equipments").innerHTML = "Online mode : " +  compteur + " equipments updated in local storage";
		},
		error : function(jqXHR, status) {
			
			//alert("offline mode");
			
		 	var localStorageEquipments = JSON.parse(window.localStorage.getItem("equipments"));
		 	
		 	//alert(localStorageUsers);
			var compteur = 0;
			
		 	$.each(localStorageEquipments, function(i, oneElement){
		 		
		 		//alert(oneUser);
		 		
		 		var jsonOneElement = JSON.parse(oneElement);
				//alert("reference="+jsonOneElement.reference);
				compteur++;
		     });

			document.getElementById("equipments").innerHTML = "Offline mode : Retreive " + compteur + " equipments from local storage";
		}
	});
}

function initLanguages() {
    var userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.substring(0,2);
    loadBundles(userLang);
}