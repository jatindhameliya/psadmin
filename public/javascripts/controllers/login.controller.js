appLogin.controller("LoginController", ($scope, $http) => {
	$scope.username = '';
	$scope.password = '';
	$scope.onSubmit = () => {
		$http({
			url: "/",
			method: "POST",
			cache: false,
			data: {username: $scope.username, password: $scope.password},
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					if (response.data.Data == 1) {
						window.location.href = "/dashboard";
					} else {
						swal({
							title: "Admin Login",
							text: response.data.Message,
							icon: "warning",
							button: "Okay",
						});
					}
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
});
