app.controller("ProductsController", ($scope, $http, HelperService) => {
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
					$scope.customOptionsCategories = {
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
	$scope.Attributelist = [];
	$http({
		url: "/attributes/getattributeList",
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
					$scope.Attributelist = response.data.Data;
					$scope.customOptionsAttributes = {
						placeholder: 'Select Attribute...',
						dataTextField: 'attributename',
						dataValueField: '_id',
						valuePrimitive: true,
						autoBind: false,
						dataSource: $scope.Attributelist,
						filter: "contains",
					};
				}
			}
		}, function (error) {
			console.error(error);
		}
	);
	$scope.Tagslist = [];
	$http({
		url: "/tags/getlist",
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
					$scope.Tagslist = response.data.Data;
				}
			}
		}, function (error) {
			console.error(error);
		}
	);
	$scope.Vendorlist = [];
	$http({
		url: "/vendors/getlist",
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
					$scope.Vendorlist = response.data.Data;
					$scope.customOptionsVendors = {
						placeholder: 'Select Vendor...',
						dataTextField: 'company.companyname',
						dataValueField: '_id',
						valuePrimitive: true,
						autoBind: false,
						dataSource: $scope.Vendorlist,
						filter: "contains",
					};
				}
			}
		}, function (error) {
			console.error(error);
		}
	);
	$scope.localAttr = [{
		attributeid: "",
		attributevalue: "",
		attributeimg: null
	}];
	$scope.addAttribute = () => {
		$scope.localAttr.push({
			attributeid: "",
			attributevalue: "",
			attributeimg: null
		});
	}
	$scope.fileSelected = (input) => {
		$scope.myfile = null;
		if (input.files && input.files[0]) {
			var filename = input.files[0].name;
			var valid_extensions = /(\.png|\.PNG|\.jpg|\.JPG|\.jpeg|\.JPEG)$/i;
			if (valid_extensions.test(filename)) {
				$('.imageError' + $scope.uploadIndex).text('');
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
								$("#preview-image" + $scope.uploadIndex).attr('src', e.target.result);
								$scope.myfile = input.files[0];
								$scope.attributeImgUploader();
							} else {
								$('.imageError' + $scope.uploadIndex).text('Invalid File Resolution, Valid Resolutions are (Minimum 200 x 200) and (Maximum 1000 x 1000)!');
							}
						}
					}
				});
			} else {
				$('.imageError').text('Invalid File Format, Valid Format is .png | .jpg | .jpeg !');
			}
		}
	};
	$scope.uploadFileview = (index) => {
		$scope.uploadIndex = index;
		$('#fileupForAttribute' + index).trigger('click');
	};
	$scope.attributeImgUploader = () => {
		if ($scope.myfile != null) {
			let formData = new FormData();
			formData.append("myfile", $scope.myfile);
			$http({
				url: "/upload/productattr",
				method: "POST",
				data: formData,
				transformRequest: angular.identity,
				headers: { "Content-Type": undefined, "Process-Data": false, },
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if (response.data.Data != 0) {
							$scope.localAttr[$scope.uploadIndex].attributeimg = response.data.Data;
							$scope.myfile = null;
							$scope.uploadIndex = -1;
						}
					}
				}, function (error) {
					console.error(error);
				}
			);
		}
	}
	//DEFINED IN FOOTER
	$scope.changeProductTags = (e) =>{
		//TO REFRESH A PURTICULAR SCOPED CODE
		$scope.$apply(function () {
			$scope.producttags = $('#prodTags').val();
		});
	}
	$scope.onSubmit = () => {
		if ($scope.parent_vendor != '' && $scope.parent_vendor != undefined &&
			$scope.productreferenceID != '' && $scope.productreferenceID != undefined &&
			$scope.productname != '' && $scope.productname != undefined &&
			$scope.productcategory != '' && $scope.productcategory != undefined &&
			$scope.producthsncode != '' && $scope.producthsncode != undefined &&
			$scope.productsku != '' && $scope.productsku != undefined &&
			$scope.productprice != '' && $scope.productprice != undefined &&
			$scope.productmrp != '' && $scope.productmrp != undefined) {
			let productdescription = $('.ql-editor').html();
			let pImages = [];
			$scope.productImages.forEach(element => {
				pImages.push(element.uploadUrl);
			});
			let finalPImage = [...$scope.productEditImages, ...pImages];
			let jsonData = {
				parent_vendor: $scope.parent_vendor,
				productreferenceID: $scope.productreferenceID,
				productname: $scope.productname,
				productcategory: $scope.productcategory,
				producthsncode: $scope.producthsncode,
				productsku: $scope.productsku,
				productprice: $scope.productprice,
				productmrp: $scope.productmrp,
				productdescription: productdescription,
				producttags: $scope.producttags,
				productImages: finalPImage,
				attributes: $scope.localAttr,
				status: $scope.status
			};
			let finalJson = angular.copy(jsonData);
			$http({
				url: "/products/save",
				method: "POST",
				data: { product: finalJson, id: $scope.ProductId},
				cache: false,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if (response.data.Data == 1) {
							//$scope.getVendors();
							swal({
								title: "Products",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						} else {
							swal({
								title: "Products",
								text: response.data.Message,
								icon: "success",
								button: "Okay",
							});
						}
						window.location.href = "/products";
					}
				}, function (error) {
					console.error(error);
				}
			);
		} else {
			swal("General Company Details can not be empty!");
		}
	}
	$scope.Products = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getProducts = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/products/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.Products = response.data.Data.results;
					$scope.imgLink = response.data.Data.s3_image_link;
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.Products.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.getProducts();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getProducts();
		sort = sort ? false : true;
	}
	$scope.checkAll = () => {
		$scope.selectAll = $scope.selectAll ? false : true;
		if ($scope.selectAll == null || $scope.selectAll == true) {
			$scope.Products.docs.forEach(element => {
				element.selected = true;
			});
		} else {
			$scope.Products.docs.forEach(element => {
				element.selected = false;
			});
		}
	}
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getProducts();
	}
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getProducts();
	};
	$scope.onEdit = (pid) => {
		window.location.href = "/products/edit?pid=" + pid;
	};

	$scope.onEditLoad = () => {
		let pid = HelperService.queryString('pid');
		if (pid != 0 && pid != null && pid != '' && pid != undefined){
			$scope.ProductId = pid;
			$http({
				url: "/products/getproductbyId",
				method: "POST",
				cache: false,
				data: {pid:pid},
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if(response.data.Data != 0){
							let product = response.data.Data;
							$scope.parent_vendor = product.parent_vendor;
							$scope.productreferenceID = product.productreferenceID;
							$scope.productname = product.productname;
							$scope.productcategory = product.productcategory;
							$scope.producthsncode = product.producthsncode;
							$scope.productsku = product.productsku;
							$scope.productprice = product.productprice;
							$scope.productmrp = product.productmrp;
							$scope.selectedtags = product.producttags;
							$('.ql-editor').html(product.productdescription);
							$scope.producttags = product.producttags;
							$scope.productEditImages = product.productImages;
							console.log(product.attributes);
							$scope.localAttr = product.attributes;
							$scope.status = product.status;
							$scope.s3_img_url = product.s3_img_url;
						}else{
							window.location.href = "/products";
						}
					}
				}, function (error) {
					console.error(error);
				}
			);
		}
	};
	$scope.onEditLoad();
	$scope.removeEditedFile = (index) => {
		$scope.productEditImages.splice(index,1);
	}
	$scope.$watch("page", () => $scope.getProducts());
});
