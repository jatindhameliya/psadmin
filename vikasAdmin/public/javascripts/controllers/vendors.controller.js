app.controller("VendorsController", ($scope, $http, HelperService) => {
	let addressIndex = null;
	let taxIndex = null;
	$scope.VendorId = 0;
	$scope.Addresses = {
		locationname: '',
		address: '',
		city: '',
		pincode: '',
		state: '',
		district: '',
		country: ''
	};
	$scope.Taxes = {
		placename: '',
		gst: ''
	};
	$scope.Company = {
		company: {
			firstname: '',
			lastname: '',
			icon: '',
			companyname: '',
			companyemail: '',
			companyphone: '',
			companymobile: '',
			status: false
		},
		addresses: [],
		bank: {
			accountname: '',
			bankname: '',
			accountnumber: '',
			ifscnumber: '',
			bankbranchname: '',
			pannumber: '',
			bankkey: ''
		},
		taxes: []
	};
	$scope.fileSelected = (input) => {
		$scope.myfile = null;
		if (input.files && input.files[0]) {
			var filename = input.files[0].name;
			var valid_extensions = /(\.png|\.PNG|\.jpg|\.JPG|\.jpeg|\.JPEG)$/i;
			if (valid_extensions.test(filename)) {
				$('.imageError').text('');
				$(input.files).each(function () {
					var reader = new FileReader();
					reader.readAsDataURL(this);
					reader.onload = function (e) {
						var image = new Image();
						image.src = e.target.result;
						image.onload = function () {
							var height = this.height;
							var width = this.width;
							if (height >= 200 && width >= 200 && height <= 1000 && width <= 1000) {
								$("#preview-image").attr('src', e.target.result);
								$scope.myfile = input.files[0];
							} else {
								$('.imageError').text('Invalid File Resolution, Valid Resolutions are (Minimum 200 x 200) and (Maximum 1000 x 1000)!');
							}
						}
					}
				});
			} else {
				$('.imageError').text('Invalid File Format, Valid Format is .png | .jpg | .jpeg !');
			}
		}
	};
	// Saving data to DB
	$scope.onSubmit = () => {
		if ($scope.Company.company.companyname != '' && $scope.Company.company.companyname != undefined && $scope.Company.company.companyemail != '' && $scope.Company.company.companyemail != undefined && $scope.Company.company.companyphone != '' && $scope.Company.company.companyphone != undefined) {
			let formData = new FormData();
			$scope.Company.id = $scope.VendorId;
			let Company = angular.copy($scope.Company);
			formData.append("fields", JSON.stringify(Company));
			if ($scope.myfile != null) {
				formData.append("myfile", $scope.myfile);
			}
			$http({
				url: "/vendors/save",
				method: "POST",
				data: formData,
				transformRequest: angular.identity,
				headers: { "Content-Type": undefined, "Process-Data": false, },
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if (response.data.Data == 1) {
							$scope.getVendors();
							swal({
								title: "Vendors",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						} else {
							swal({
								title: "Vendors",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						}
						window.location.href = "/vendors";
					}
				}, function (error) {
					console.error(error);
				}
			);
		} else {
			$('#general').addClass('active');
			$('#addresses').removeClass('active');
			$('#banking').removeClass('active');
			$('#taxes').removeClass('active');
			$('#generalToggle').addClass('active show');
			$('#addressesToggle').removeClass('active show');
			$('#bankingToggle').removeClass('active show');
			$('#taxesToggle').removeClass('active show');
			swal("General Company Details can not be empty!");
		}
	}
	// Table functions
	$scope.Vendors = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getVendors = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/vendors/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.Vendors = response.data.Data.results;
					$scope.imgLink = response.data.Data.s3_image_link;
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.Vendors.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.getVendors();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getVendors();
		sort = sort ? false : true;
	}
	$scope.checkAll = () => {
		$scope.selectAll = $scope.selectAll ? false : true;
		if ($scope.selectAll == null || $scope.selectAll == true) {
			$scope.Vendors.docs.forEach(element => {
				element.selected = true;
			});
		} else {
			$scope.Vendors.docs.forEach(element => {
				element.selected = false;
			});
		}
	}
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getVendors();
	}
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getVendors();
	};
	// Edit data functions
	$scope.onEdit = (vid) => {
		window.location.href = "/vendors/edit?vid=" + vid;
	}
	$scope.onEditLoad = () => {
		let vid = HelperService.queryString('vid');
		if (vid != 0 && vid != null && vid != '' && vid != undefined) {
			$scope.VendorId = vid;
			$http({
				url: "/vendors/getvendorbyId",
				method: "POST",
				cache: false,
				data: { vid: vid },
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if (response.data.Data != 0) {
							let vendor = response.data.Data;
							$scope.Company.company.firstname = vendor.company.firstname;
							$scope.Company.company.lastname = vendor.company.lastname;
							$scope.Company.company.icon = vendor.company.icon;
							$scope.Company.company.companyname = vendor.company.companyname;
							$scope.Company.company.companyemail = vendor.company.companyemail;
							$scope.Company.company.companyphone = vendor.company.companyphone;
							$scope.Company.company.companymobile = vendor.company.companymobile;
							$scope.Company.company.status = vendor.company.status;
							$scope.Company.addresses = vendor.addresses;
							$scope.Company.bank.accountname = vendor.bank.accountname;
							$scope.Company.bank.bankname = vendor.bank.bankname;
							$scope.Company.bank.accountnumber = vendor.bank.accountnumber;
							$scope.Company.bank.ifscnumber = vendor.bank.ifscnumber;
							$scope.Company.bank.bankbranchname = vendor.bank.bankbranchname;
							$scope.Company.bank.pannumber = vendor.bank.pannumber;
							$scope.Company.bank.bankkey = vendor.bank.bankkey;
							$scope.Company.taxes = vendor.taxes;
							$scope.s3_img_url = vendor.s3_img_url;
						} else {
							window.location.href = "/vendors";
						}
					}
				}, function (error) {
					console.error(error);
				}
			);
		}
	};
	$scope.onEditLoad();
	// Address management functions
	$scope.onNewAddress = () => {
		if (addressIndex!=null){
			$scope.Company.addresses[addressIndex] = $scope.Addresses;
		}else{
			$scope.Company.addresses.push($scope.Addresses);
		}
		$scope.Addresses = {
			locationname: '',
			address: '',
			city: '',
			pincode: '',
			state: ''
		};
		addressIndex = null;
	};
	$scope.onClearAddress = () => {
		addressIndex = null;
		$scope.Addresses = {
			locationname: '',
			address: '',
			city: '',
			pincode: '',
			state: ''
		};
	};
	$scope.editAddressData = (index) => {
		addressIndex = index;
		$scope.Addresses = $scope.Company.addresses[index];
	};
	$scope.deleteAddressData = (index) => {
		$scope.Company.addresses.splice(index,1);
	};
	// Tax management functions
	$scope.onNewTax = () => {
		if (taxIndex != null) {
			$scope.Company.taxes[taxIndex] = $scope.Taxes;
		} else {
			$scope.Company.taxes.push($scope.Taxes);
		}
		$scope.Taxes = {
			placename: '',
			gst: ''
		};
		taxIndex = null;
	};
	$scope.editTaxData = (index) => {
		taxIndex = index;
		$scope.Taxes = $scope.Company.taxes[index];
	};
	$scope.deleteTaxData = (index) => {
		$scope.Company.taxes.splice(index,1);
	};
	$scope.onClearTax = (index) => {
		taxIndex = null;
		$scope.Taxes = {
			placename: '',
			gst: ''
		};
	};
	$scope.$watch("page", () => $scope.getVendors());
});
