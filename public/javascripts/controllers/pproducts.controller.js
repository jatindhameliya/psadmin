app.controller("PProductsController", ($scope, $http, HelperService) => {
	$scope.s3_image_url = '';
	$scope.colorsSet = [];
	$scope.PProducts = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getPProducts = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/pproducts/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.PProducts = response.data.Data.results;
					$scope.s3_image_url = response.data.Data.s3_image_url;
					$scope.colorsSet = HelperService.getRandomColors(response.data.Data.results.docs.length);
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.PProducts.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
	$scope.getPProducts();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getPProducts();
		sort = sort ? false : true;
	};
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getPProducts();
	};
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getPProducts();
	};
	$scope.$watch("page", () => $scope.getPProducts());
});
