'use strict';

var appControllers = angular.module('GasmRentAppControllers', []);

appControllers.controller('MainController', ['$scope','$http', 'barcodeScannerService', 'URL_GET_EQUIPMENT', 'METHOD_TURN_IN', 'LOCAL_STORAGE_RENTED_EQUIPMENTS', 
                                             function($scope, $http, barcodeScannerService, URL_GET_EQUIPMENT, METHOD_TURN_IN, LOCAL_STORAGE_RENTED_EQUIPMENTS) {
		
	//alert(URL_GET_USERS);
	
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
			
			var urlToForward = URL_GET_EQUIPMENT
					+ jsonOneElement.reference + "/" + METHOD_TURN_IN;
			
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
				window.localStorage.setItem(LOCAL_STORAGE_RENTED_EQUIPMENTS, JSON
								.stringify($scope.rentedEquipments));
				
			}).error(function(data,status,headers,config) {
				if(debug === true){
					alert("handle failure");
				}
			});
		}
		
		$scope.sendInfoToDoScan = function(){
			barcodeScannerService.scanAnEquipmentId(undefined, undefined);
		}
	}]);

appControllers.controller('ChooseEventController', ['$scope','$http', 'localStorageService', 'LOCAL_STORAGE_DIVING_EVENTS', 
                                                    function($scope, $http, localStorageService, LOCAL_STORAGE_DIVING_EVENTS) {
	
	var localStorageDivingEvents = localStorageService.read(LOCAL_STORAGE_DIVING_EVENTS);
	$scope.divingEvents = [];
	
	$.each(localStorageDivingEvents, function(i, oneElement) {
		var jsonOneElement = JSON.parse(oneElement);
		$scope.divingEvents.push(getDivingEventById(jsonOneElement.id));
	});
	
	$scope.selectedDivingEvent = $scope.divingEvents[0];
	
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

appControllers.controller('ListRentedItemsController', ['$scope','$http', 'URL_GET_EQUIPMENT', 'METHOD_TURN_IN', function($scope, $http, URL_GET_EQUIPMENT, METHOD_TURN_IN) {
	
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
	
	$scope.turnIn = function(itemReference) {
		var urlToForward = URL_GET_EQUIPMENT
				+ itemReference + "/" + METHOD_TURN_IN;
		alert("toto=" + urlToForward);
		alert("not yet implemented");
	}
}]);

appControllers.controller('ChooseEventAndUserController', ['$scope','$http', '$window', 'divingEventService', 'equipmentService', 'userService', 'localStorageService', 'barcodeScannerService', 
                                                           'LOCAL_STORAGE_LINE_OF_RENTAL', 'LOCAL_STORAGE_PAYMENT_BY_USER', 
                                                           function($scope, $http, $window, divingEventService, equipmentService, userService, localStorageService, barcodeScannerService, LOCAL_STORAGE_LINE_OF_RENTAL, LOCAL_STORAGE_PAYMENT_BY_USER) {
	
	// clear rentalRecords of the local storage
	localStorageService.clear(LOCAL_STORAGE_LINE_OF_RENTAL);
	localStorageService.clear(LOCAL_STORAGE_PAYMENT_BY_USER);
	
	// We retreive informations about the diving events
	$scope.divingEvents = divingEventService.getAllDivingEvents();
	$scope.selectedDivingEvent = $scope.divingEvents[0];

	// We retreive informations about the users
	$scope.users = userService.getAllUsers();
	$scope.selectedUser = $scope.users[0];
	
	// We retreive informations about equipments
	$scope.equipments = equipmentService.getAllEquipments();
	$scope.selectedEquipment = $scope.equipments[0];
	
	
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

				//
				$("#pageTitle").html(jQuery.i18n.prop(pageTitle));

				//jQuery.i18n.prop("viewItems");
				$("#viewItems").html(viewItems);

				//jQuery.i18n.prop("scanToViewItemDetail");
				$("#scanToViewItemDetail").html(scanToViewItemDetail);

				//jQuery.i18n.prop("synchronize");
				$("#synchronize").html(synchronize);

				//jQuery.i18n.prop("about");
				$("#about").html(about);
			}
		});
	}
	
	$scope.sendInfoToDoScan = function(){	
		barcodeScannerService.scanAnEquipmentId($scope.selectedDivingEvent.id, $scope.selectedUser.id);
	}
	
	$scope.sendInfoWithoutScan = function(){
		equipmentService.rent($scope.selectedDivingEvent.id, $scope.selectedUser.id, $scope.selectedEquipment.equipmentId);
	}
	
	$scope.sendInfoForSummaryByUser = function(){
		// redirect
		$window.location = "#/summaryByUser/" + $scope.selectedDivingEvent.id + "/" + $scope.selectedUser.id;
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

appControllers.controller('SynchronizeController', ['$scope','$http', 'backendService', function($scope, $http, backendService) {
	
	$('#pageDescription').html("Synchronizing...");
	
	$scope.users = backendService.pullUsers();
	
	$scope.divingEvents = backendService.pullDivingEvents();
	
	$scope.equipments = backendService.pullEquipments();
	
	$scope.rentedEquipments = backendService.pullRentedEquipments();
	
	$scope.paymentType = backendService.pullPaymentType();
	
	//backendService.pushLinesOfRental();
	
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

appControllers.controller('ViewEquipmentsController', ['$scope','$http', 'equipmentService', function($scope, $http, equipmentService) {

	$scope.equipments = equipmentService.getAllEquipments();
	//getInfosOfEquipmentsToList();
	
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

appControllers.controller('ViewEquipmentDetailController', ['$scope','$routeParams', 'equipmentService', function($scope, $routeParams, equipmentService) {

	$scope.equipment = equipmentService.getById($routeParams.equipmentId);
	
	$scope.theHtmlString = $scope.equipment.toCompleteString(); 
	
	alert($scope.theHtmlString);
	//getEquipmentDetail();
	
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

appControllers.controller('ScanController', ['$scope','$routeParams', '$window', 'divingEventService', 'userService', 'equipmentService', 'lineOfRentalService', 'barcodeScannerService', function($scope, $routeParams, $window, divingEventService, userService, equipmentService, lineOfRentalService, barcodeScannerService) {
	
	$scope.theNewLineOfRental = lineOfRentalService.save($routeParams.divingEventId, $routeParams.userId, $routeParams.equipmentId)
	
	$scope.divingEvent = divingEventService.getById($scope.theNewLineOfRental.divingEventId);
	$scope.user =  userService.getById($scope.theNewLineOfRental.userId);
	$scope.equipment = equipmentService.getById($scope.theNewLineOfRental.equipmentId);
	
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
	
	$scope.scanAgain = function() {
		barcodeScannerService.scanAnEquipmentId($scope.divingEvent.id, $scope.user.id);
	}
}]);

appControllers.controller('SummaryByUserController', ['$scope','$routeParams', '$window', 'lineOfRentalService', 'divingEventService', 'userService', 'billingRecordService', function($scope, $routeParams, $window, lineOfRentalService, divingEventService, userService, billingRecordService) {
	
	$scope.divingEvent =  divingEventService.getById($routeParams.divingEventId);
	$scope.user =  userService.getById($routeParams.userId);
	
	$scope.lineOfRentals = lineOfRentalService.getAllRentalsByDivingIdAndUserId($routeParams.divingEventId, $routeParams.userId);
	
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
			
			$("#summaryByUserDescription").html(summaryByUserDescription($scope.user.toString(), $scope.divingEvent.getPlace() , $scope.divingEvent.getDate(), $scope.divingEvent.getUserPrice($scope.user.id)));
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
	
	$scope.savePaymentTypeForThisUser = function(paymentMode) {
		billingRecordService.save($scope.divingEvent.id,$scope.user.id, paymentMode);
	}
	
	$scope.sendInfoForSummaryByDivingEvent = function(paymentMode) {
		$window.location = "#/summaryByDivingEvent/" + $scope.divingEvent.id;
	}
	
}]);

appControllers.controller('SummaryByDivingEventController', ['$scope','$routeParams', 'divingEventService', 'localStorageService', 'userService' , 'equipmentService', 'LOCAL_STORAGE_LINE_OF_RENTAL', function($scope, $routeParams, divingEventService, localStorageService, userService , equipmentService, LOCAL_STORAGE_LINE_OF_RENTAL) {
	
	$scope.aDivingEvent = divingEventService.getById($routeParams.divingEventId);
	
	//alert('aDivingEvent=' + $scope.aDivingEvent);
	
	$scope.rentalRecordsStringFromLocalStorage = localStorageService.read(LOCAL_STORAGE_LINE_OF_RENTAL);

	//alert('rentalRecordsStringFromLocalStorage=' + $scope.rentalRecordsStringFromLocalStorage);
	
	$scope.rentalRecordArrays = new Array();
	
	$.each($scope.rentalRecordsStringFromLocalStorage, function(idx2, oneRentalRecord) {

		//alert('oneRentalRecord=' + oneRentalRecord);
		
		//alert('oneRentalRecord.divingEventId=' + oneRentalRecord.divingEventId);
		
		var jsonOneElement = JSON.parse(oneRentalRecord);
		
		//alert('jsonOneElementdivingEventId=' + jsonOneElement.divingEventId);
		
		//alert('aDivingEvent=' + $scope.aDivingEvent);
		//alert('$scope.aDivingEvent=' + $scope.aDivingEvent.id);
		//alert('test==' + (jsonOneElement.divingEventId == $scope.aDivingEvent.id));
		
		if (jsonOneElement.divingEventId == $scope.aDivingEvent.id) {
			
			var aUserObject = userService.getById(jsonOneElement.userId);
			var anEquipmentObject = equipmentService.getById(jsonOneElement.equipmentId);

			//alert('aUserObject=' + aUserObject);
			//alert('anEquipmentObject=' + anEquipmentObject);
			
			var stringBuffer = aUserObject.toString() + " : " + anEquipmentObject.toString();
			
			//alert('stringBuffer=' + stringBuffer);
			
			$scope.rentalRecordArrays.push(stringBuffer);
		}
	});

	//alert('rentalRecordArrays=' + $scope.rentalRecordArrays);
	
	
	jQuery.i18n.properties({
		name : 'gasmrent',
		path : 'i18n/',
		mode : 'both',
		language : 'fr',
		callback : function() {
			$("#sendForSynchronization").html(sendForSynchronization);
			
			$("#summaryByDivingEventDescription").html(summaryByDivingEventDescription($scope.aDivingEvent.getPlace(), $scope.aDivingEvent.getDate()));
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