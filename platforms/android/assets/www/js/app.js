'use strict';

var app = angular.module('GasmRentApp', ['ngRoute', 'GasmRentAppControllers']);

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
		).when('/synchronize', {
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
