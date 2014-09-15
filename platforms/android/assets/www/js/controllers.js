'use strict';

var appControllers = angular.module('GasmRentAppControllers', []);

appControllers.controller('MainController', ['$scope','$http', function($scope, $http) {
		
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

appControllers.controller('ChooseEventController', ['$scope','$http', 'localStorageService', function($scope, $http, localStorageService) {
	
	var localStorageDivingEvents = localStorageService.read(getConstants().LOCAL_STORAGE_DIVING_EVENTS);
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

appControllers.controller('ChooseEventAndUserController', ['$scope','$http', '$window', 'divingEventService', 'equipmentService', 'userService', 'localStorageService', 'barcodeScannerService', function($scope, $http, $window, divingEventService, equipmentService, userService, localStorageService, barcodeScannerService) {
	
	// clear rentalRecords of the local storage
	localStorageService.clear(getConstants().LOCAL_STORAGE_LINE_OF_RENTAL);
	localStorageService.clear(getConstants().LOCAL_STORAGE_PAYMENT_BY_USER);
	
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