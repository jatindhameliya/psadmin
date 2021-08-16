app.controller("AdminUserController", ($scope, $http, HelperService) => {
	$scope.Roleslist = [];
	$scope.id = 0;
	$http({
		url: "/adminroles/getlist",
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
					$scope.Roleslist = response.data.Data;
				}
			}
		}, function (error) {
			console.error(error);
		}
	);
	$scope.onSubmit = () => {
		let jsonData = {
			id: $scope.id,
			name: $scope.name,
			email: $scope.email,
			phone: $scope.phone,
			Roleid: $scope.Roleid,
			status: $scope.status
		};
		$http({
			url: "/users/save",
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
						swal({
							title: "Admin Users",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						}).then((willDelete) => {
							if (willDelete) {
								window.location.href = "/users";
							}else{
								window.location.href = "/users";
							}
						});
					} else {
						swal({
							title: "Admin Users",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					}
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.AdminUsers = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getAdminUsers = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/users/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.AdminUsers = response.data.Data.results;
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.AdminUsers.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.getAdminUsers();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getAdminUsers();
		sort = sort ? false : true;
	}
	$scope.checkAll = () => {
		$scope.selectAll = $scope.selectAll ? false : true;
		if ($scope.selectAll == null || $scope.selectAll == true) {
			$scope.AdminUsers.docs.forEach(element => {
				element.selected = true;
			});
		} else {
			$scope.AdminUsers.docs.forEach(element => {
				element.selected = false;
			});
		}
	}
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getAdminUsers();
	}
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getAdminUsers();
	};
	$scope.onEdit = (AdminUsers) => {
		$scope.id = AdminUsers._id;
		$scope.name = AdminUsers.name;
		$scope.email = AdminUsers.email;
		$scope.phone = AdminUsers.phone;
		$scope.Roleid = AdminUsers.roleId._id;
		$scope.status = AdminUsers.status;
		$('#editadminuserModel').modal('show');
	};
	$scope.onDelete = (AdminUsers) => {
		$scope.id = AdminUsers._id;
		console.log(AdminUsers._id);
	};
	$scope.$watch("page", () => $scope.getAdminUsers());
});
