app.controller("PProductsController", ($scope, $http, HelperService) => {
	$scope.s3_image_url = '';
	$scope.colorsSet = [];
	$scope.PProducts = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getPProducts = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/pproducts/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.PProducts = response.data.Data.results;
					$scope.s3_image_url = response.data.Data.s3_image_url;
					$scope.colorsSet = HelperService.getRandomColors(response.data.Data.results.docs.length);
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.PProducts.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	};
	$scope.getPProducts();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getPProducts();
		sort = sort ? false : true;
	};
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getPProducts();
	};
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getPProducts();
	};
	$scope.$watch("page", () => $scope.getPProducts());


	$scope.ProductId = 0;
	$scope.uploadIndex = -1;
	$scope.myfile = null;
	$scope.producttags = [];
	$scope.productImages = [];
	$scope.productEditImages = [];
	$scope.dzOptions = {
		url: '/upload/productsimg',
		paramName: 'productImg',
		maxFilesize: '20',
		acceptedFiles: 'image/jpeg, images/jpg, image/png',
		addRemoveLinks: true,
	};
	$scope.dzCallbacks = {
		'addedfile': function (file) {
			$scope.newFile = file;
			$('.dz-image').addClass('avatar');
			$('.dz-image > img').addClass('avatar-img rounded');
		},
		'removedfile': function (file) {
			let imgId = -1;
			for (let i = 0; i < $scope.productImages.length; i++) {
				if ($scope.productImages[i].uniqId == file.upload.uuid) {
					imgId = i;
				}
			}
			if (imgId != -1) {
				$scope.productImages.splice(imgId, 1);;
			}
		},
		'success': function (file, xhr) {
			$scope.productImages.push({ uniqId: file.upload.uuid, uploadUrl: xhr.url });
		},
	};
	$scope.dzMethods = {};


	$scope.productLinksDropDwn = [
		{ key: "Amazon", value: "amazon" },
		{ key: "Ali Express", value: "aliexpress" },
		{ key: "Walmart", value: "walmart" },
	];
	$scope.productLinks = [{ productLink: "", link: "" }];
	$scope.addProductLink = () => $scope.productLinks.push({ productLink: "", link: "" });
	$scope.removeProductLink = (index) => $scope.productLinks.splice(index, 1);

	$scope.forms = {
		productName: "",
		productCategory: "",
		productDesciption: "",
		productLinks: [],
		productPrice:{
			priceType: "",
			price: 0.0,
			salesPrice: 0.0,
			profit: 0.0,
		},
		productAnalytics:{
			source: "",
			nOrders: 0,
			nReviews: 0,
			rating: "",
		},
		productEngagement:{
			nLikes: 0,
			nComments: 0,
			nViews: 0,
		},
		productInterest: "",
		productDisplayRate: "",
		productComments: "",
		productStatus: "",
	}

	$scope.onFormSubmit = () =>{
		let description = $('.ql-editor').html();
		$scope.forms.productDesciption = description;
		$scope.forms.productLinks = $scope.productLinks;
		console.log($scope.forms);
	}



});
