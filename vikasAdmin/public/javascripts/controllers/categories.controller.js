app.controller("CategoriesController", ($scope, $http, HelperService) => {
	$scope.Categorylist = [];
	$scope.CategoryId = 0;
	$scope.categoryname = '';
	$scope.description = '';
	$scope.parentcategory = '';
	$scope.status = true;
	$scope.isfinalcategory = false;
	$scope.onSubmit = () => {
		let jsonData = {
			id: $scope.CategoryId,
			categoryname: $scope.categoryname,
			description: $scope.description,
			parentcategory: $scope.parentcategory,
			status: $scope.status,
			isfinalcategory: $scope.isfinalcategory
		};
		$http({
			url: "/categories/save",
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
							title: "Category",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						}).then((willDelete) => {
							if (willDelete) {
								window.location.href = "/categories";
							} else {
								window.location.href = "/categories";
							}
						});
					} else {
						swal({
							title: "Category",
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
	$http({
		url: "/categories/getCategoryByParent",
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
					$scope.Categorylist = response.data.Data;
					$scope.customOptions = {
						placeholder: 'Select Category...',
						dataTextField: 'displayname',
						dataValueField: 'itemId',
						valuePrimitive: true,
						autoBind: false,
						dataSource: $scope.Categorylist,
						filter: "contains",
					};
				}
			}
		}, function (error) {
			console.error(error);
		}
	);
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
	}
	$scope.getCategories();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getCategories();
		sort = sort ? false : true;
	}
	$scope.checkAll = () => {
		$scope.selectAll = $scope.selectAll ? false : true;
		if ($scope.selectAll == null || $scope.selectAll == true) {
			$scope.Categories.docs.forEach(element => {
				element.selected = true;
			});
		} else {
			$scope.Categories.docs.forEach(element => {
				element.selected = false;
			});
		}
	}
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getCategories();
	}
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
							$scope.categoryname = category.categoryname;
							$scope.description = category.description;
							$scope.parentcategory = category.parentcategory;
							$scope.status = category.status;
							$scope.isfinalcategory = category.isfinalcategory;
							$scope.s3_img_url = category.s3_img_url;
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
	$scope.$watch("page", () => $scope.getCategories());
});
