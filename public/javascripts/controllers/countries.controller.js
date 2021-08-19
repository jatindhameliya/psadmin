app.controller("CountriesController", ($scope, $http, HelperService) => {
	$scope.s3_image_url = '';
	$scope.colorsSet = [];
	$scope.CountryId = 0;
	$scope.name = '';
	$scope.code = '';
	$scope.currency = '';
	$scope.currency_symbole = '';
	$scope.rate = 0;
	$scope.status = true;
	$scope.flag = '';
	$scope.onSubmit = () => {
		if ($scope.name != '' && $scope.name != undefined) {
			let jsonData = {
				countryid: $scope.CountryId,
				name: $scope.name,
				code: $scope.code,
				currency: $scope.currency,
				currency_symbole: $scope.currency_symbole,
				rate: $scope.rate,
				status: $scope.status,
				flag: $scope.flag
			};
			let finalJson = angular.copy(jsonData);
			$http({
				url: "/countries/save",
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
							$scope.getCountries();
							swal({
								title: "Countries",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						} else {
							swal({
								title: "Countries",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						}
						window.location.href = "/countries";
					}
				}, function (error) {
					console.error(error);
				}
			);
		} else {
			swal("Country name can not be empty!");
		}
	};
	$scope.Countries = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getCountries = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/countries/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.Countries = response.data.Data.results;
					$scope.s3_image_url = response.data.Data.s3_image_url;
					$scope.colorsSet = HelperService.getRandomColors(response.data.Data.results.docs.length);
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.Countries.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
	$scope.getCountries();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getCountries();
		sort = sort ? false : true;
	};
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getCountries();
	};
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getCountries();
	};
	$scope.onEdit = (cid) => {
		window.location.href = "/countries/edit?cid=" + cid;
	};
	$scope.onEditLoad = () => {
		let cid = HelperService.queryString('cid');
		if (cid != 0 && cid != null && cid != '' && cid != undefined) {
			$scope.CountryId = cid;
			$http({
				url: "/countries/getcountrybyId",
				method: "POST",
				cache: false,
				data: { cid: cid },
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if (response.data.Data != 0) {
							let country = response.data.Data;
							$scope.name = country.name;
							$scope.code = country.code;
							$scope.currency = country.currency;
							$scope.currency_symbole = country.currency_symbole;
							$scope.rate = country.rate;
							$scope.status = country.status;
							$scope.flag = country.flag;
						} else {
							window.location.href = "/countries";
						}
					}
				}, function (error) {
					console.error(error);
				}
			);
		}
	};
	$scope.onEditLoad();
	$scope.$watch("page", () => $scope.getCountries());
});
