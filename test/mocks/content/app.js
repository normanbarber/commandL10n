"use strict";

cai.module("cai.inventory", [
	"ngCookies",
	"ngRoute",
	"cai.services",
	"cai.inventory.services",
	"cai.inventory.controllers",
	"cai.inventory.directives",
	"cai.inventory.filters",
	"ui.bootstrap"
]).
	config([
	"$routeProvider",
	"$locationProvider",
	"localize",
	function ($routeProvider, $locationProvider, localize) {
		$routeProvider.
			when("/", {
				redirectTo: function () {
					return "/location";
				}
			}).
			when("/location", {
				templateUrl: "location-dashboard",
				controller: "LocationDashboardCtrl",
				label: localize["Location Dashboard"]
			}).
			when("/material", {
				templateUrl: "material-dashboard",
				controller: "MaterialDashboardCtrl",
				label: localize["Material Dashboard"]
			}).
			when("/:dashboard", {
				dynamicLabel: true
			}).
			when("/:dashboard/vendor", {
				templateUrl: "vendor",
				controller: "vendorController",
				label: localize["lblVendorAdmin"]
			}).
			when('/:dashboard/vendor/vendorEdit/:code', {
				templateUrl: 'vendorEdit',
				controller: 'vendorEditController'
			}).
			when("/:dashboard/materialAcrossLocation/material/:material", {
				templateUrl: "inventoryAcrossLocations",
				controller: "inventoryAcrossLocationController"
			}).
			when("/:dashboard/materialAtLocation/location/:location", {
				templateUrl: "inventoryAtLocation",
				controller: "inventoryAtLocationController"
			}).
			when("/:dashboard/planningAcrossLocations/material/:material", {
				templateUrl: "planningAcrossLocations",
				controller: "planningAcrossLocationsController"
			}).
			when("/:dashboard/planningAtLocation/location/:location", {
				templateUrl: "planningAtLocation",
				controller: "PlanningAtLocationCtrl",
				label: localize["Planning At Location"]
			}).
			when("/:dashboard/materialDetail/location/:location", {
				label: localize["Material Detail"]
			}).
			when("/:dashboard/materialDetail/location/:location/material/:material", {
				templateUrl: "materialDetail",
				controller: "materialDetailCtrl"
			}).
			when("/:dashboard/materialDetail/location/:location/material/:material/export", {
				templateUrl: "export-schedule",
				controller: "ExportScheduleCtrl",
				label: localize["Export Schedule"]
			}).
			when("/:dashboard/locationConfiguration/", {
				label: localize["Location Configuration"]
			}).
			when("/:dashboard/materialConfiguration/location/:location", {
				label: localize["Material Configuration"]
			}).
			when("/:dashboard/materialDetail/location/:location/material/:material/device/:device", {
				templateUrl: "materialDetail",
				controller: "materialDetailCtrl",
				label: localize["Device"]
			}).
			when('/:dashboard/materialConfiguration/location/:location/material/:material', {
				templateUrl: 'materialConfiguration',
				controller: 'materialConfigurationController'
			}).
			when('/:dashboard/locationConfiguration/location/:location', {
				templateUrl: 'locationConfiguration',
				controller: 'locationConfigurationController'
			}).
			when('/:dashboard/locationAdmin', {
				templateUrl: 'locationAdmin',
				controller: 'locationAdminCtrl'
			}).
			when('/:dashboard/actionAdd', {
				templateUrl: 'locationAdminAdd',
				controller: 'locationAdminAddCtrl'
			}).
			when('/:dashboard/actionEdit/:code', {
				templateUrl: 'locationAdminAdd',
				controller: 'locationAdminAddCtrl'
			});

		$locationProvider.html5Mode(true);
	}
]).
	filter('customNumber',[
	'$filter',
	function($filter) {
		function empty(str) {
			return str==null||!/[^\s]+/.test(str);
		}

		return function(text,fractionSize) {
			if(empty(text)||isNaN(text)) {
				return "-";
			}
			else {
				return $filter('number')(text,fractionSize);
			}
		}
	}
]).
	run([
	"$rootScope",
	"$log",
	function (root, $log) {
		root.g = {
			search: {
				visible: false,
				query: ""
			},
			dashboard: "",
			materials: [],
			plannedData: {
				meta: {location: '', material: {name: '', desc: '', po:''}},
				buckets: []
			}
		};

		root.back = function () {
			$log.info("Return to previous screen");
			window.history.back();
		};
	}
]);
