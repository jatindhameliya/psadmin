app.controller("GstController", ($scope, $http, HelperService) => {
	$scope.id = '0';
	$scope.slabname = '';
	$scope.status = false;
	$scope.openRoleModal = () => {
		onClear();
		$('#addnewroleModel').modal('show');
	};
	$scope.onSubmit = () => {
		let jsonData = {
			id: $scope.id,
			roleName: $scope.roleName,
			status: $scope.status
		};
		$http({
			url: "/adminroles/save",
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
						$scope.getRoles();
						swal({
							title: "Admin Role",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					} else {
						swal({
							title: "Admin Role",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					}
					$('#addnewroleModel').modal('hide');
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	function onClear() {
		$scope.id = '0';
		$scope.roleName = '';
		$scope.status = false;
	}
	$scope.Roles = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getRoles = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/adminroles/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.Roles = response.data.Data.results;
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.Roles.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.getRoles();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getRoles();
		sort = sort ? false : true;
	}
	$scope.checkAll = () => {
		$scope.selectAll = $scope.selectAll ? false : true;
		if ($scope.selectAll == null || $scope.selectAll == true) {
			$scope.Roles.docs.forEach(element => {
				element.selected = true;
			});
		} else {
			$scope.Roles.docs.forEach(element => {
				element.selected = false;
			});
		}
	}
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getRoles();
	}
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getRoles();
	};
	$scope.onEdit = (role) => {
		$scope.id = role._id;
		$scope.roleName = role.roleName;
		$scope.status = role.status;
		$('#addnewroleModel').modal('show');
	};
	$scope.onDelete = (role) => {
		swal({
			title: "Are you sure?",
			text: "Do you really want to delete " + role.roleName + " Role ?",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				$http({
					url: "/adminroles/delete",
					method: "POST",
					cache: false,
					data: { 'id': role._id },
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				}).then(
					function (response) {
						if (response.data.IsSuccess == true) {
							if (response.data.Data == 1) {
								swal('', 'Role Deleted Successfully...', 'success');
								$scope.getRoles();
							}
						}
					}, function (error) {
						console.error(error);
					}
				);
			}
		});
	};
	$scope.$watch("page", () => $scope.getRoles());
});
