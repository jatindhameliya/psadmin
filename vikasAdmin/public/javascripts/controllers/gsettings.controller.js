app.controller("GlobalSettingController", ($scope, $http, HelperService) => {
	$scope.onSubmit = () => {
		let jsonData = {
			overallmarkup: $scope.overallmarkup,
			linkbasemarkup: $scope.linkbasemarkup,
			overalldiscount: $scope.overalldiscount,
			linkbasediscount: $scope.linkbasediscount
		};
		$http({
			url: "/gsettings/save",
			method: "POST",
			cache: false,
			data: {jsondata:jsonData},
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					if (response.data.Data == 1) {
						swal({
							title: "Global settings",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					} else {
						swal({
							title: "Global settings",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
					}
				}
			}, function (error) {
				if (error.status == 400){
					swal({
						title: "Global settings",
						text: error.data.Message,
						icon: "error",
						button: "Okay",
					});
				}
			}
		);
	}
	$http({
		url: "/gsettings/getdata",
		method: "POST",
		cache: false,
		data: {},
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
		}
	}).then(
		function (response) {
			if (response.data.IsSuccess == true) {
				if (response.data.Data != 0) {
					let gsetting = response.data.Data;
					$scope.overallmarkup = gsetting.overallmarkup;
					$scope.linkbasemarkup = gsetting.linkbasemarkup;
					$scope.overalldiscount = gsetting.overalldiscount;
					$scope.linkbasediscount = gsetting.linkbasediscount;
				} else {
					$scope.overallmarkup = 0;
					$scope.linkbasemarkup = 0;
					$scope.overalldiscount = 0;
					$scope.linkbasediscount = 0;
				}
			}
		}, function (error) {
			console.error(error);
		}
	);
});
