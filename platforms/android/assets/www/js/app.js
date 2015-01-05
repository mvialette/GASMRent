'use strict';

var app = angular.module('GasmRentApp', ['ngResource', 'ngRoute', 'ngSanitize', 'GasmRentAppControllers', 'GasmRentServices']);

app.constant('URL_GET_USERS', 'https://gasmrent-webapp.appspot.com/api/adherent/');
app.constant('URL_GET_DIVING_EVENT', 'https://gasmrent-webapp.appspot.com/api/divingEvent/');
app.constant('URL_GET_EQUIPMENT', 'https://gasmrent-webapp.appspot.com/api/equipment/');
app.constant('URL_GET_ALL_RENTED_EQUIPMENT', 'http://gasmrent-webapp.appspot.com/api/equipment/findAllRented');
app.constant('URL_GET_PAYMENT_TYPE', 'https://gasmrent-webapp.appspot.com/api/payment');
app.constant('URL_GET_RENTAL_RECORDS', 'https://gasmrent-wbapp.appspot.com/api/rentalRecord/');
app.constant('URL_PUT_NEW_RENTAL_RECORD', 'https://gasmrent-webapp.appspot.com/api/rentalRecord/addToDivingEvent');
app.constant('URL_PUT_TO_PAY_A_RENTAL_RECORDS', 'https://gasmrent-webapp.appspot.com/api/rentalRecord/paid/');
app.constant('URL_PUT_LOGIN', 'https://gasmrent-webapp.appspot.com/api/securityManager/getSecurityKey');

app.constant('METHOD_TURN_IN', 'turnIn');

app.constant('LOCAL_STORAGE_USERS', 'offlineUsers');
app.constant('LOCAL_STORAGE_DIVING_EVENTS', 'offlineDivingEvents');
app.constant('LOCAL_STORAGE_EQUIPMENTS', 'offlineEquipments');
app.constant('LOCAL_STORAGE_RENTED_EQUIPMENTS', 'offlineRentedEquipments');
app.constant('LOCAL_STORAGE_LINE_OF_RENTAL', 'lineOfRental');
app.constant('LOCAL_STORAGE_PAYMENT_TYPE', 'offlinePaymentType');
app.constant('LOCAL_STORAGE_PAYMENT_BY_USER', 'offlinePaymentByUser');
app.constant('LOCAL_SECURITY_KEY', 'securityKey');

app.constant('PAYMENT_BY_COIN', 'Liquide');
app.constant('PAYMENT_BY_CHECK', 'Ch%C3%A8que');

app.config(['$routeProvider', function($routeProvider) {

	$routeProvider
		.when('/home', {
				controller : 'MainController',
				templateUrl : 'partials/main.html'
			}
		).when('/chooseEvent', {
				controller : 'ChooseEventController',
				templateUrl : 'partials/chooseEvent.html'
			}
		).when('/listRentedItems', {
				controller : 'ListRentedItemsController',
				templateUrl : 'partials/listRentedItems.html'
			}
		).when('/chooseEventAndUser', {
				controller : 'ChooseEventAndUserController',
				templateUrl : 'partials/chooseEventAndUser.html'
			}
		).when('/about', {
				controller : 'AboutController',
				templateUrl : 'partials/about.html'
			}
		).when('/login', {
				controller : 'LoginController',
				templateUrl : 'partials/login.html'
			}
		)
		.when('/synchronize', {
				controller : 'SynchronizeController',
				templateUrl : 'partials/synchronize.html'
			}
		).when('/viewEquipments', {
				controller : 'ViewEquipmentsController',
				templateUrl : 'partials/viewEquipments.html'
			}
		).when('/viewEquipmentDetail/:equipmentId', {
				controller : 'ViewEquipmentDetailController',
				templateUrl : 'partials/viewEquipmentDetail.html'
			}
		).when('/scan/:equipmentId/:divingEventId/:userId', {
				controller : 'ScanController',
				templateUrl : 'partials/scan.html'
			}
		).when('/summaryByUser/:divingEventId/:userId', {
				controller : 'SummaryByUserController',
				templateUrl : 'partials/summaryByUser.html'
			}
		).when('/summaryByDivingEvent/:divingEventId', {
				controller : 'SummaryByDivingEventController',
				templateUrl : 'partials/summaryByDivingEvent.html'
			}
		)
		.otherwise(
			{
				redirectTo : '/home'
			}
		);
}]);
