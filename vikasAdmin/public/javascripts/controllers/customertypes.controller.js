app.controller("CustomertypesController", ($scope, $http, HelperService) => {
	$scope.id = '0';
	$scope.customertype = '';
	$scope.status = false;
	$scope.opencustomertypesModal = () => {
		onClear();
		$('#addnewcustomertypesModel').modal('show');
	};
	$scope.onSubmit = () => {
		let jsonData = {
			id: $scope.id,
			customertype: $scope.customertype,
			status: $scope.status
		};
		$http({
			url: "/customers/customertypesave",
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
						$scope.getcustomertypes();
						swal({
							title: "Customer Type",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					} else {
						swal({
							title: "Customer Type",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					}
					$('#addnewcustomertypesModel').modal('hide');
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	function onClear() {
		$scope.id = '0';
		$scope.customertype = '';
		$scope.status = false;
	}
	$scope.customertypes = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getcustomertypes = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/customers/customertypelist",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.customertypes = response.data.Data.results;
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.customertypes.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.getcustomertypes();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getcustomertypes();
		sort = sort ? false : true;
	}
	$scope.checkAll = () => {
		$scope.selectAll = $scope.selectAll ? false : true;
		if ($scope.selectAll == null || $scope.selectAll == true) {
			$scope.customertypes.docs.forEach(element => {
				element.selected = true;
			});
		} else {
			$scope.customertypes.docs.forEach(element => {
				element.selected = false;
			});
		}
	}
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getcustomertypes();
	}
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getcustomertypes();
	};
	$scope.onEdit = (customertype) => {
		$scope.id = customertype._id;
		$scope.customertype = customertype.customertype;
		$scope.status = customertype.status;
		$('#addnewcustomertypesModel').modal('show');
	};
	$scope.onDelete = (customertype) => {
		swal({
			title: "Are you sure?",
			text: "Do you really want to delete " + customertype.customertype + " Customer Type ?",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				$http({
					url: "/customers/customertypedelete",
					method: "POST",
					cache: false,
					data: { 'id': customertype._id },
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				}).then(
					function (response) {
						if (response.data.IsSuccess == true) {
							if (response.data.Data == 1) {
								swal('', 'Customer Type Deleted Successfully...', 'success');
								$scope.getcustomertypes();
							}
						}
					}, function (error) {
						console.error(error);
					}
				);
			}
		});
	};
	$scope.$watch("page", () => $scope.getcustomertypes());
});
