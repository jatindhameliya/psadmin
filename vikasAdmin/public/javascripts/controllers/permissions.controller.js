app.controller("PermissionController", ($scope, $http, HelperService) => {
	$scope.structureList = [];
	$scope.collections = [];
	$scope.getStructure = () => {
		$http({
			url: '/permissions/',
			method: "POST",
			cache: false,
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
			},
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.structureList = response.data.Data.output;
					$scope.collections = response.data.Data.collections;
					$scope.checkOverAll();
				}
			},
			function (error) {
				console.log(error);
				if (error.status == 401) {
					window.location.href = AUTO_LOGOUT;
				}
			}
		);
	};
	$scope.checkOverAll = () => {
		for (let i = 0; i < $scope.structureList.length; i++) {
			let overAllSelected = [];
			for (let j = 0; j < $scope.structureList[i].permission.length; j++) {
				let local = $scope.structureList[i].permission[j];
				if (local.insertUpdate == true && local.view == true && local.delete == true) {
					$scope.structureList[i].permission[j].all = true;
					overAllSelected.push(true);
				} else {
					$scope.structureList[i].permission[j].all = false;
					overAllSelected.push(false);
				}
			}
			if (!overAllSelected.includes(false)) {
				$scope.structureList[i].overAll = true;
			}
		}
	}

	//ALLOW OR DISALLOW ACCORDING TO ROLE
	$scope.allowDisallowOverAll = (roleId) => {
		for (let i = 0; i < $scope.structureList.length; i++) {
			if ($scope.structureList[i].roleId == roleId) {
				let checked = $scope.structureList[i].overAll;
				for (let p = 0; p < $scope.structureList[i].permission.length; p++) {
					$scope.structureList[i].permission[p].all = checked;
					$scope.structureList[i].permission[p].view = checked;
					$scope.structureList[i].permission[p].delete = checked;
					$scope.structureList[i].permission[p].insertUpdate = checked;
				}
			}
		}
	}

	//ALLOW OR DISALLOW ACCORDING TO TOLE AND MODEL
	$scope.allowDisallowAll = (roleId, collectionName) => {
		for (let i = 0; i < $scope.structureList.length; i++) {
			if ($scope.structureList[i].roleId == roleId) {
				for (let p = 0; p < $scope.structureList[i].permission.length; p++) {
					if (collectionName == $scope.structureList[i].permission[p].collectionName) {
						let checked = $scope.structureList[i].permission[p].all;
						$scope.structureList[i].permission[p].view = checked;
						$scope.structureList[i].permission[p].delete = checked;
						$scope.structureList[i].permission[p].insertUpdate = checked;
					}
				}
			}
		}

		let count = -1;
		for (let i = 0; i < $scope.structureList.length; i++) {
			if ($scope.structureList[i].roleId == roleId) {
				for (let p = 0; p < $scope.structureList[i].permission.length; p++) {
					if ($scope.structureList[i].permission[p].all == false) {
						count = i;
						break;
					}
				}
			}
			if (count != -1) {
				$scope.structureList[i].overAll = false;
				break;
			} else {
				$scope.structureList[i].overAll = true;
				break;
			}
		}
	}

	$scope.allowDisallowPurticular = (roleId, collectionName) => {
		for (let i = 0; i < $scope.structureList.length; i++) {
			if ($scope.structureList[i].roleId == roleId) {
				for (let p = 0; p < $scope.structureList[i].permission.length; p++) {
					if (collectionName == $scope.structureList[i].permission[p].collectionName) {
						if ($scope.structureList[i].permission[p].view == true && $scope.structureList[i].permission[p].insertUpdate == true && $scope.structureList[i].permission[p].delete == true) {
							$scope.structureList[i].permission[p].all = true;
						} else {
							$scope.structureList[i].permission[p].all = false;
						}
					}
				}
			}
		}

		let count = -1;
		for (let i = 0; i < $scope.structureList.length; i++) {
			if ($scope.structureList[i].roleId == roleId) {
				for (let p = 0; p < $scope.structureList[i].permission.length; p++) {
					if ($scope.structureList[i].permission[p].all == false) {
						count = i;
						break;
					}
				}
			}
			if (count != -1) {
				$scope.structureList[i].overAll = false;
				break;
			} else {
				$scope.structureList[i].overAll = true;
				break;
			}
		}

	}

	$scope.onSavePermissions = () => {
		let prepareData = [];
		for (let i = 0; i < $scope.structureList.length; i++) {
			prepareData.push({
				roleId: $scope.structureList[i].roleId,
				permission: $scope.structureList[i].permission
			});
		}
		if (prepareData.length > 0)
			$http({
				url: "/permissions/savePermission",
				method: "POST",
				cache: false,
				data: {
					permissions: prepareData
				},
				headers: {
					"Content-Type": "application/json; charset=UTF-8",
				},
			}).then(
				function (response) {
					if (response.data.IsSuccess == true && response.data.Data == 1) {
						console.log("Saved");
						swal({
							title: "Permissions",
							text: "Permissions saved successfully!",
							icon: "success",
							button: "Okay",
						});
					} else {
						console.log(response.data.Message);
					}
				},
				function (error) {
					console.log(error);
				}
			);

	}
	$scope.getStructure();
});
