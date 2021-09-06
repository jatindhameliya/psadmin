app.controller("SLStoresController", ($scope, $http, HelperService) => {
	$scope.colorsSet = [];
	$scope.SLStoreId = 0;
	$scope.SLStores = {};
	$scope.Counts = {};
	$scope.sortBy = { 'timestamp': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getSLStores = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/slstores/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.SLStores = response.data.Data.results;
					$scope.colorsSet = HelperService.getRandomColors(response.data.Data.results.docs.length);
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.SLStores.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
	$scope.getSLStores();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getSLStores();
		sort = sort ? false : true;
	};
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getSLStores();
	};
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getSLStores();
	};
	$scope.$watch("page", () => $scope.getSLStores());
});
