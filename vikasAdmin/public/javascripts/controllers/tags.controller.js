app.controller("TagsController", ($scope, $http, HelperService) => {
	$scope.id = '0';
	$scope.tagname = '';
	$scope.status = false;
	$scope.openTagModal = () => {
		onClear();
		$('#addnewtagModel').modal('show');
	};
	$scope.onSubmit = () => {
		let jsonData = {
			id: $scope.id,
			tagname: $scope.tagname,
			status: $scope.status
		};
		$http({
			url: "/tags/save",
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
						$scope.getTags();
						swal({
							title: "Tags",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					} else {
						swal({
							title: "Tags",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					}
					$('#addnewtagModel').modal('hide');
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	function onClear() {
		$scope.id = '0';
		$scope.tagname = '';
		$scope.status = false;
	}
	$scope.Tags = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getTags = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/tags/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.Tags = response.data.Data.results;
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.Tags.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.getTags();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getTags();
		sort = sort ? false : true;
	}
	$scope.checkAll = () => {
		$scope.selectAll = $scope.selectAll ? false : true;
		if ($scope.selectAll == null || $scope.selectAll == true) {
			$scope.Tags.docs.forEach(element => {
				element.selected = true;
			});
		} else {
			$scope.Tags.docs.forEach(element => {
				element.selected = false;
			});
		}
	}
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getTags();
	}
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getTags();
	};
	$scope.onEdit = (tag) => {
		$scope.id = tag._id;
		$scope.tagname = tag.tagname;
		$scope.status = tag.status;
		$('#addnewtagModel').modal('show');
	};
	$scope.onDelete = (tag) => {
		swal({
			title: "Are you sure?",
			text: "Do you really want to delete " + tag.tagname + " Tag ?",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				$http({
					url: "/tags/delete",
					method: "POST",
					cache: false,
					data: { 'id': tag._id },
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				}).then(
					function (response) {
						if (response.data.IsSuccess == true) {
							if (response.data.Data == 1) {
								swal('', 'Tag Deleted Successfully...', 'success');
								$scope.getTags();
							}
						}
					}, function (error) {
						console.error(error);
					}
				);
			}
		});
	};
	$scope.$watch("page", () => $scope.getTags());
});
