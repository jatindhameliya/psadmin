app.controller("AttributeController", ($scope, $http, HelperService) => {
	$scope.Attributelist = [];
	$scope.id = 0;
	$http({
		url: "/attributes/getlist",
		method: "POST",
		cache: false,
		data: {},
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
		}
	}).then(
		function (response) {
			if (response.data.IsSuccess == true) {
				if (response.data.Data.length > 0) {
					$scope.Attributelist = response.data.Data;
				}
			}
		}, function (error) {
			console.error(error);
		}
	);
	$scope.onSubmit = () => {
		let jsonData = {
			id: $scope.id,
			attributename: $scope.attributename,
			status: $scope.status
		};
		$http({
			url: "/attributes/save",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					if (response.data.Data == 1) {
						$scope.getAttributes();
						swal({
							title: "Attributes",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					} else {
						swal({
							title: "Attributes",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					}
				}
				$('#addnewAttributeModel').modal('hide');
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.Attributes = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getAttributes = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/attributes/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.Attributes = response.data.Data.results;
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.Attributes.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.getAttributes();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getAttributes();
		sort = sort ? false : true;
	}
	$scope.checkAll = () => {
		$scope.selectAll = $scope.selectAll ? false : true;
		if ($scope.selectAll == null || $scope.selectAll == true) {
			$scope.Attributes.docs.forEach(element => {
				element.selected = true;
			});
		} else {
			$scope.Attributes.docs.forEach(element => {
				element.selected = false;
			});
		}
	}
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getAttributes();
	}
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getAttributes();
	};
	$scope.onEdit = (Attributes) => {
		$scope.id = Attributes._id;
		$scope.attributename = Attributes.attributename;
		$scope.status = Attributes.status;
		$('#addnewAttributeModel').modal('show');
	};
	$scope.onDelete = (Attributes) => {
		$scope.id = Attributes._id;
	};
	$scope.openAttributeModal = () => {
		onClear();
		$('#addnewAttributeModel').modal('show');
	}
	function onClear() {
		$scope.id = '0';
		$scope.attributename = '';
		$scope.status = false;
	}
	$scope.$watch("page", () => $scope.getAttributes());
});
