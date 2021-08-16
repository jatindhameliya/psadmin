app.controller("CustomersController", ($scope, $http, HelperService) => {
	let addressIndex = null;
	let taxIndex = null;
	$scope.customerTypes = [];
	$http({
		url: "/customers/customertypegetlist",
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
					$scope.customerTypes = response.data.Data;
				}
			}
		}, function (error) {
			console.error(error);
		}
	);
	$scope.CustomerTypeChange = (id) =>{
		$scope.customerTypes.forEach(element => {
			if(element._id == id){
				element.selected = true;
				$scope.Customer.customertype = element._id;
			}
		});
		$scope.customerTypes.forEach(element => {
			if (element._id != id) {
				element.selected = false;
			}
		});
	}
	$scope.Categorylist = [];
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
						filter: "contains",
						dataSource: $scope.Categorylist,
						dataTextField: "displayname",
						dataValueField: "itemId",
					};
				}
			}
		}, function (error) {
			console.error(error);
		}
	);
	$scope.CustomerId = 0;
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
	$scope.CustomerAdmin = {
		firstname: '',
		lastname:'',
		email:'',
		mobile:''
	}
	$scope.Customer = {
		companyname:'',
		customertype:'',
		icon:'',
		status:'',
		parent:'',
		phone:'',
		isbypass:'',
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
		taxes: [],
		overallmarkup:'',
		linkbasemarkup:'',
		categorymarkup:[],
		overalldiscount:'',
		linkbasediscount:'',
		categorydiscount:[],
		raferalcode:''
	};
	// Local data manager
	$scope.localCategoryMarkup = [{
		categoryid: "",
		markup: 0
	}];
	$scope.addCategorybasedMarkup = () => {
		$scope.localCategoryMarkup.push({
			categoryid: "",
			markup: 0
		});
	};
	$scope.localCategoryDiscount = [{
		categoryid: "",
		discount: 0
	}];
	$scope.addCategorybasedDiscount = () => {
		$scope.localCategoryDiscount.push({
			categoryid: "",
			discount: 0
		});
	};
	// Address management functions
	$scope.onNewAddress = () => {
		if (addressIndex != null) {
			$scope.Customer.addresses[addressIndex] = $scope.Addresses;
		} else {
			$scope.Customer.addresses.push($scope.Addresses);
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
		$scope.Addresses = $scope.Customer.addresses[index];
	};
	$scope.deleteAddressData = (index) => {
		$scope.Customer.addresses.splice(index, 1);
	};
	// Tax management functions
	$scope.onNewTax = () => {
		if (taxIndex != null) {
			$scope.Customer.taxes[taxIndex] = $scope.Taxes;
		} else {
			$scope.Customer.taxes.push($scope.Taxes);
		}
		$scope.Taxes = {
			placename: '',
			gst: ''
		};
		taxIndex = null;
	};
	$scope.editTaxData = (index) => {
		taxIndex = index;
		$scope.Taxes = $scope.Customer.taxes[index];
	};
	$scope.deleteTaxData = (index) => {
		$scope.Customer.taxes.splice(index, 1);
	};
	$scope.onClearTax = (index) => {
		taxIndex = null;
		$scope.Taxes = {
			placename: '',
			gst: ''
		};
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
		if ($scope.Customer.companyname != '' && $scope.Customer.companyname != undefined) {
			console.log('Customer:',$scope.Customer);
			console.log('CustomerAdmin',$scope.CustomerAdmin);
			console.log('Addresses',$scope.Addresses);
			console.log('Taxes', $scope.Taxes);
			console.log('CategoryMarkup', $scope.localCategoryMarkup);
			console.log('CategoryDiscount', $scope.localCategoryDiscount);
			// let formData = new FormData();
			// $scope.Company.id = $scope.VendorId;
			// let Company = angular.copy($scope.Company);
			// formData.append("fields", JSON.stringify(Company));
			// if ($scope.myfile != null) {
			// 	formData.append("myfile", $scope.myfile);
			// }
			// $http({
			// 	url: "/vendors/save",
			// 	method: "POST",
			// 	data: formData,
			// 	transformRequest: angular.identity,
			// 	headers: { "Content-Type": undefined, "Process-Data": false, },
			// }).then(
			// 	function (response) {
			// 		if (response.data.IsSuccess == true) {
			// 			if (response.data.Data == 1) {
			// 				$scope.getVendors();
			// 				swal({
			// 					title: "Vendors",
			// 					text: response.data.Message,
			// 					icon: "success",
			// 					button: "Okay",
			// 				});
			// 			} else {
			// 				swal({
			// 					title: "Vendors",
			// 					text: response.data.Message,
			// 					icon: "success",
			// 					button: "Okay",
			// 				});
			// 			}
			// 			window.location.href = "/vendors";
			// 		}
			// 	}, function (error) {
			// 		console.error(error);
			// 	}
			// );
		} else {
			console.log('Customer:', $scope.Customer);
			console.log('CustomerAdmin', $scope.CustomerAdmin);
			console.log('Addresses', $scope.Addresses);
			console.log('Taxes', $scope.Taxes);
			console.log('CategoryMarkup', $scope.localCategoryMarkup);
			console.log('CategoryDiscount', $scope.localCategoryDiscount);
			// $('#general').addClass('active');
			// $('#addresses').removeClass('active');
			// $('#banking').removeClass('active');
			// $('#taxes').removeClass('active');
			// $('#generalToggle').addClass('active show');
			// $('#addressesToggle').removeClass('active show');
			// $('#bankingToggle').removeClass('active show');
			// $('#taxesToggle').removeClass('active show');
			// swal("General Company Details can not be empty!");
		}
	};
});
