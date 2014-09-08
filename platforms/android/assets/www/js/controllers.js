'use strict';

var appControllers = angular.module('GasmRentAppControllers', []);

appControllers.controller('MainController', ['$scope','$http', function($scope, $http) {
		
		// Magie du contrôleur
		
		jQuery.i18n
		.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {
				
				$("#applicationDescription").html(applicationDescription);

				$("#startRentSession").html(startRentSession);

				$("#resumeRentSession").html(resumeRentSession);
				
				$("#chooseAnEvent").html(chooseAnEvent);
				
				$("#returnEvent").html(returnEvent);
			}
		});
		
		$scope.rentedEquipments = JSON.parse(window.localStorage
				.getItem(getConstants().LOCAL_STORAGE_RENTED_EQUIPMENTS));

		$scope.getRentedEquipmentsDisplay = function(item){
	        var jsonOneElement = JSON.parse(item);
			return jsonOneElement.reference + " ("+jsonOneElement.renterFullName + ")";
	    }
		
		$scope.initHeader = function(pageTitle) {
			jQuery.i18n.properties({
				name : 'gasmrent',
				path : 'i18n/',
				mode : 'both',
				language : 'fr',
				callback : function() {

					$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

					jQuery.i18n.prop("viewItems");
					$("#viewItems").html(viewItems);

					jQuery.i18n.prop("scanToViewItemDetail");
					$("#scanToViewItemDetail").html(scanToViewItemDetail);

					jQuery.i18n.prop("synchronize");
					$("#synchronize").html(synchronize);

					jQuery.i18n.prop("about");
					$("#about").html(about);
				}
			});
		}

		$scope.initBackToHome = function() {
			jQuery.i18n.properties({
				name : 'gasmrent',
				path : 'i18n/',
				mode : 'both',
				language : 'fr',
				callback : function() {
					$("#backToHome").html(jQuery.i18n.prop("backToHome"));
				}
			});
		}

		$scope.turnIn = function(item) {
			//var debug = true;
			var debug = false;
			
			var jsonOneElement = JSON.parse(item);
			
			var urlToForward = getConstants().URL_GET_EQUIPMENT
					+ jsonOneElement.reference + "/" + getConstants().METHOD_TURN_IN;
			
			if(debug === true){
				alert(urlToForward);
			}
			
			$http.put(urlToForward, "").success(function(data,status,headers,config){
				if(debug === true){
					alert(" handle success");
				}
				
				// cas ou le retour a été fait ok. Il faut raffraichir le localstorage & la page
				// remove element from scope array
				var index = $scope.rentedEquipments.indexOf(item)
				$scope.rentedEquipments.splice(index, 1);
				
				// mise à jour du local storage
				window.localStorage.setItem(
						getConstants().LOCAL_STORAGE_RENTED_EQUIPMENTS, JSON
								.stringify($scope.rentedEquipments));
				
			}).error(function(data,status,headers,config) {
				if(debug === true){
					alert("handle failure");
				}
			});
		}
	}]);

appControllers.controller('ChooseEventController', ['$scope','$http', function($scope, $http) {
	
	var localStorageDivingEvents = JSON.parse(window.localStorage
			.getItem(getConstants().LOCAL_STORAGE_DIVING_EVENTS));

	$scope.divingEvents = [];
	
	$.each(localStorageDivingEvents, function(i, oneElement) {
		var jsonOneElement = JSON.parse(oneElement);
		$scope.divingEvents.push(jsonOneElement);
		
//		items = items + "<option value=\"" + jsonOneElement.id + "\">"
//				+ jsonOneElement.place + " le "
//				+ parseDate(jsonOneElement.date) + "</option>";
	});
	
	$scope.selectedDivingEvent = $scope.divingEvents[0];
	
	//$scope.divingEvents = localStorageDivingEvents;
	
	$scope.sendInfoForSummaryByDivingEvent = function(selectedDivingEvent){
		//alert(selectedDivingEvent);
//		alert(selectedDivingEvent.id);
		
		// send rented equipements to the server
		window.location = "#/summaryByDivingEvent/" + selectedDivingEvent.id;
    }
	
	jQuery.i18n
			.properties({
				name : 'gasmrent',
				path : 'i18n/',
				mode : 'both',
				language : 'fr',
				callback : function() {

					$("#chooseEventDescription").html(chooseEventDescription);
					
					$("#summaryByDivingEvent").html(summaryByDivingEvent);
				}
			});
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
}]);

appControllers.controller('ListRentedItemsController', ['$scope','$http', function($scope, $http) {
	
	jQuery.i18n
	.properties({
		name : 'gasmrent',
		path : 'i18n/',
		mode : 'both',
		language : 'fr',
		callback : function() {
			$("#listRentedItemsDescription").html(listRentedItemsDescription);
		}
	});
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
}]);

appControllers.controller('ChooseEventAndUserController', ['$scope','$http', function($scope, $http) {
	
	// clear rentalRecords of the local storage
	clearLineOfRental();
	clearPaymentByUser();
	
	// We retreive informations about the diving events
	$scope.divingEvents = getAllDivingEvents();
	$scope.selectedDivingEvent = $scope.divingEvents[0];

	// We retreive informations about the users
	$scope.users = getAllUsers();
	$scope.selectedUser = $scope.users[0];
	
	// We retreive informations about equipments
	$scope.equipments = getAllEquipments();
	//$scope.selectedEquipment = $scope.equipments[0];
	
	
	jQuery.i18n
	.properties({
		name : 'gasmrent',
		path : 'i18n/',
		mode : 'both',
		language : 'fr',
		callback : function() {

			$("#chooseEventAndUserDescription").html(chooseEventAndUserDescription);

			$("#user").html(user + " :");

			$("#divingEvent").html(divingEvent + " :");
			
			$("#equipment").html(equipment + " :");

			$("#scanQRCode").html(scanQRCode);
			
			$("#rentWithoutScan").html(rentWithoutScan);
			
    		 $("#summaryByUser").html(summaryByUser);
		}
	});
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
	
	$scope.sendInfoToDoScan = function(){	
		
		var debug = false;

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
	    		  rentAnEquipment($scope.selectedDivingEvent.id, $scope.selectedUser.id, result.text);
	    	  } else {
	    		  alert("Le scan n'a pas abouti");
	    	  }
	      }, 
	      function (error) {
	          alert("Scanning failed: " + error);
	      }
	   );
	}
}]);

appControllers.controller('AboutController', ['$scope','$http', function($scope, $http) {
	
	jQuery.i18n.properties({
		 name:'gasmrent',
		 path:'i18n/',
		 mode:'both',
		 language:'fr',
		 callback: function() {
			 
			 $("#aboutDescription").html(jQuery.i18n.prop("aboutDescription"));
		 }
	 });
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
}]);

appControllers.controller('SynchronizeController', ['$scope','$http', function($scope, $http) {
	
	importDatas();
	
	// Send informations of rented equipments to the server
	//sendRentalRecords();
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
}]);

appControllers.controller('ViewEquipmentsController', ['$scope','$http', function($scope, $http) {
	
	getInfosOfEquipmentsToList();
	
    jQuery.i18n.properties({
  	 name:'gasmrent',
  	 path:'i18n/',
  	 mode:'both',
  	 language:'fr',
  	 callback: function() {
  		 
  		 $("#description").html(jQuery.i18n.prop("viewEquipmentsDescription"));
	 }
    });
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
}]);

appControllers.controller('ViewEquipmentDetailController', ['$scope','$routeParams', function($scope, $routeParams) {
	
	getEquipmentDetail($routeParams.equipmentId);
	
    jQuery.i18n.properties({
  	 name:'gasmrent',
  	 path:'i18n/',
  	 mode:'both',
  	 language:'fr',
  	 callback: function() {
  		 	$("#backToHome").html(jQuery.i18n.prop("backToHome"));
 		 }
   });
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
}]);

appControllers.controller('ScanController', ['$scope','$routeParams', function($scope, $routeParams) {
	
	getInfosOfQRCodeScan($routeParams.equipmentId, $routeParams.divingEventId, $routeParams.userId);
	
	jQuery.i18n.properties({
		name : 'gasmrent',
		path : 'i18n/',
		mode : 'both',
		language : 'fr',
		callback : function() {

			$("#scanDescription").html(scanDescription);

			$("#continueScan").html(continueScan);
			
			$("#continueWithoutScan").html(rentWithoutScan);

			$("#summaryByUser").html(summaryByUser);
		}
	});
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
}]);

appControllers.controller('SummaryByUserController', ['$scope','$routeParams', function($scope, $routeParams) {
	
	getEquipmentsForTheUser($routeParams.divingEventId, $routeParams.userId);
	
	jQuery.i18n.properties({
		name : 'gasmrent',
		path : 'i18n/',
		mode : 'both',
		language : 'fr',
		callback : function() {
			
			$("#continueRentalForSomeoneElse").html(continueRentalForSomeoneElse);
			
			$("#hasPaidByCoin").html(hasPaidByCoin);
			
			$("#hasPaidByCheck").html(hasPaidByCheck);
			
			$("#hasNotPaid").html(hasNotPaid);
			
			$("#summaryByDivingEvent").html(summaryByDivingEvent);
		}
	});
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
}]);

appControllers.controller('SummaryByDivingEventController', ['$scope','$routeParams', function($scope, $routeParams) {
	
	getEquipmentsByDivingEventId($routeParams.divingEventId);

	jQuery.i18n.properties({
		name : 'gasmrent',
		path : 'i18n/',
		mode : 'both',
		language : 'fr',
		callback : function() {
			$("#sendForSynchronization").html(sendForSynchronization);
		}
	});
	
	$scope.initHeader = function(pageTitle) {
		jQuery.i18n.properties({
			name : 'gasmrent',
			path : 'i18n/',
			mode : 'both',
			language : 'fr',
			callback : function() {

				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
}]);