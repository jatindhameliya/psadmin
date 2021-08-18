app.controller("CategoriesController", ($scope, $http, HelperService) => {
	$scope.CategoryId = 0;
	$scope.category_name = '';
	$scope.category_description = '';
	$scope.category_status = true;
	$scope.onSubmit = () => {
		if ($scope.category_name != '' && $scope.category_name != undefined) {
			let jsonData = {
				categoryid: $scope.CategoryId,
				category_name: $scope.category_name,
				category_description: $scope.category_description,
				category_status: $scope.category_status,
			};
			let finalJson = angular.copy(jsonData);
			$http({
				url: "/categories/save",
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
							$scope.getCategories();
							swal({
								title: "Categories",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						} else {
							swal({
								title: "Categories",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						}
						window.location.href = "/categories";
					}
				}, function (error) {
					console.error(error);
				}
			);
		} else {
			swal("Category name can not be empty!");
		}
	};
	$scope.Categories = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getCategories = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/categories/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.Categories = response.data.Data.results;
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.Categories.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
	$scope.getCategories();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getCategories();
		sort = sort ? false : true;
	};
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getCategories();
	};
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getCategories();
	};
	$scope.onEdit = (cid) => {
		window.location.href = "/categories/edit?cid=" + cid;
	};
	$scope.onEditLoad = () => {
		let cid = HelperService.queryString('cid');
		if (cid != 0 && cid != null && cid != '' && cid != undefined) {
			$scope.CategoryId = cid;
			$http({
				url: "/categories/getcategorybyId",
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
							let category = response.data.Data;
							$scope.category_name = category.category_name;
							$scope.category_description = category.category_description;
							$scope.category_status = category.category_status;
						} else {
							window.location.href = "/categories";
						}
					}
				}, function (error) {
					console.error(error);
				}
			);
		}
	};
	$scope.onEditLoad();
	$scope.$watch("page", () => $scope.getCategories());
});
