app.controller("WebsitesController", ($scope, $http, HelperService) => {
	$scope.colorsSet = [];
	$scope.WebsiteId = 0;
	$scope.website_name = '';
	$scope.icon = '';
	$scope.status = true;
	$scope.onSubmit = () => {
		if ($scope.website_name != '' && $scope.website_name != undefined) {
			let jsonData = {
				websiteid: $scope.WebsiteId,
				website_name: $scope.website_name,
				icon: $scope.icon,
				status: $scope.status,
			};
			let finalJson = angular.copy(jsonData);
			$http({
				url: "/websites/save",
				method: "POST",
				data: finalJson,
				cache: false,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if (response.data.Data == 1) {
							$scope.getWebsites();
							swal({
								title: "Websites",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						} else {
							swal({
								title: "Websites",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						}
						window.location.href = "/websites";
					}
				}, function (error) {
					console.error(error);
				}
			);
		} else {
			swal("Website name can not be empty!");
		}
	};
	$scope.Websites = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getWebsites = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/websites/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.Websites = response.data.Data.results;
					$scope.colorsSet = HelperService.getRandomColors(response.data.Data.results.docs.length);
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.Websites.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
	$scope.getWebsites();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getWebsites();
		sort = sort ? false : true;
	};
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getWebsites();
	};
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getWebsites();
	};
	$scope.onEdit = (wid) => {
		window.location.href = "/websites/edit?wid=" + wid;
	};
	$scope.onEditLoad = () => {
		let wid = HelperService.queryString('wid');
		if (wid != 0 && wid != null && wid != '' && wid != undefined) {
			$scope.WebsiteId = wid;
			$http({
				url: "/websites/getwebsitebyId",
				method: "POST",
				cache: false,
				data: { wid: wid },
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if (response.data.Data != 0) {
							let website = response.data.Data;
							$scope.website_name = website.website_name;
							$scope.icon = website.icon;
							$scope.status = website.status;
						} else {
							window.location.href = "/websites";
						}
					}
				}, function (error) {
					console.error(error);
				}
			);
		}
	};
	$scope.onEditLoad();
	$scope.$watch("page", () => $scope.getWebsites());
});
