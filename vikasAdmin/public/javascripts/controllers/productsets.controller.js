app.controller("ProductsetController", ($scope, $http, HelperService) => {
	//SAFE APPLY
	$scope.safeApply = function (fn) {
		var phase = this.$root.$$phase;
		if (phase == '$apply' || phase == '$digest') {
			if (fn && (typeof (fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};
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
				if (response.data.Data != 0) {
					$scope.Categorylist = response.data.Data;
					$scope.s3_img_url = response.data.Data.s3_img_url;
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
	$scope.setId = 0;
	$scope.products = [];
	$scope.productsList = [];
	$scope.discounttype = '';
	$scope.discountpercentage = 0;
	$scope.discountamount = 0;
	$scope.finalamount = 0;
	$scope.totalmrp = 0;
	$scope.totalqty = 0;
	$scope.finalamountbefordiscount = 0;
	$scope.finaldiscountamount = 0;
	$scope.customOptions = {
		filter: "startswith",
		dataSource: [],
		dataTextField: "label",
		dataValueField: "value",
		valueTemplate: '<span class="selected-value" style="background-image: url(\'{{dataItem.avatarSrc}}\')"></span><span>{{dataItem.label}}</span>',
		template: '<span class="k-state-default" style="background-image: url(\'{{dataItem.avatarSrc}}\')"></span>' + '<span class="k-state-default"><h3>{{dataItem.label}}</h3><p>MRP : ₹{{dataItem.mrp}}</p></span>',
	};
	$scope.onChangeofCategory = () => {
		$scope.products = [];
		$scope.discounttype = '';
		$scope.discountpercentage = 0;
		$scope.discountamount = 0;
		$scope.finalamount = 0;
		$scope.totalmrp = 0;
		$scope.totalqty = 0;
		$scope.finalamountbefordiscount = 0;
		$scope.finaldiscountamount = 0;
		let category = $scope.category;
		let parent_vendor = $scope.parent_vendor;
		if (category != '' && category != undefined && parent_vendor != '' && parent_vendor != undefined) {
			$http({
				url: "/products/getlistforset",
				method: "POST",
				cache: false,
				data: { category: category, parent_vendor: parent_vendor },
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if (response.data.Data.length > 0) {
							$scope.productsList = response.data.Data;
							$scope.customOptions = {
								filter: "startswith",
								dataSource: $scope.productsList,
								dataTextField: "label",
								dataValueField: "value",
								valueTemplate: '<span class="selected-value" style="background-image: url(\'{{dataItem.avatarSrc}}\')"></span><span>{{dataItem.label}}</span>',
								template: '<span class="k-state-default" style="background-image: url(\'{{dataItem.avatarSrc}}\')"></span>' + '<span class="k-state-default"><h3>{{dataItem.label}}</h3><p>MRP : ₹{{dataItem.mrp}}</p></span>',
							};
						}
					}
				}, function (error) {
					console.error(error);
				}
			);
		}
	};

	$scope.$watch("category", () => $scope.onChangeofCategory());
	$scope.$watch("parent_vendor", () => $scope.onChangeofCategory());



	$scope.selectedProduct = "";
	$scope.productselected = () => {
		var flag = 0;
		$scope.products.forEach(element => {
			if (element.productid == $scope.selectedProduct.value) {
				let index = $scope.products.indexOf(element);
				$scope.products[index].qty += 1;
				flag = 1;
			}
		});
		if (flag == 0) {
			var obj = {
				productid: $scope.selectedProduct.value,
				qty: 1,
				mrp: $scope.selectedProduct.mrp,
				productname: $scope.selectedProduct.label,
				productimage: $scope.selectedProduct.avatarSrc
			};
			$scope.products.push(obj);
		}
		$scope.updateData();
	};
	$scope.minusQty = (index) => {
		if ($scope.products[index].qty > 1) {
			$scope.products[index].qty -= 1;
		}
		$scope.updateData();
	};
	$scope.plusQty = (index) => {
		$scope.products[index].qty += 1;
		$scope.updateData();
	};
	$scope.onDeleterow = (index) => {
		$scope.products.splice(index, 1);
		$scope.updateData();
	};
	$scope.changeInQty = (index) => {
		$scope.products[index].qty = Number($scope.products[index].qty);
		$scope.updateData();
	};
	$scope.updateData = () => {
		let totalmrp = 0;
		let totalqty = 0;
		let totalamount = 0;
		let finalamountbefordiscount = 0;
		let finaldiscountamount = 0;
		$scope.products.forEach(element => {
			totalmrp = totalmrp + element.mrp;
			totalqty = totalqty + element.qty;
			totalamount = totalamount + (element.mrp * element.qty);
		});
		finalamountbefordiscount = totalamount;
		if ($scope.discounttype != '') {
			if ($scope.discounttype == 'byPercentage') {
				$scope.discountamount = 0;
				if ($scope.discountpercentage > 0) {
					finaldiscountamount = (totalamount * Number($scope.discountpercentage)) / 100;
					totalamount = totalamount - finaldiscountamount;
				}
			} else {
				$scope.discountpercentage = 0;
				if ($scope.discountamount > 0) {
					finaldiscountamount = Number($scope.discountamount);
					totalamount = totalamount - finaldiscountamount;
				}
			}
		} else {
			$scope.discountpercentage = 0;
			$scope.discountamount = 0;
			$scope.finalamountbefordiscount = 0;
			$scope.finaldiscountamount = 0;
		}
		$scope.finalamount = Number(totalamount);
		$scope.totalmrp = Number(totalmrp);
		$scope.totalqty = Number(totalqty);
		$scope.finalamountbefordiscount = Number(finalamountbefordiscount);
		$scope.finaldiscountamount = Number(finaldiscountamount);
		$scope.safeApply(function () { });
	};
	$scope.onSubmit = () => {
		let finalProducts = [];
		$scope.products.forEach(element => {
			var obj = {
				productid: element.productid,
				qty: element.qty
			};
			finalProducts.push(obj);
		});
		let jsonData = {
			category: $scope.category,
			parent_vendor: $scope.parent_vendor,
			setname: $scope.setname,
			discounttype: $scope.discounttype,
			discountpercentage: $scope.discountpercentage,
			discountamount: $scope.discountamount,
			status: $scope.status,
			products: finalProducts,
			totalqty: $scope.totalqty,
		};
		$http({
			url: "/productset/save",
			method: "POST",
			cache: false,
			data: { id: $scope.setId, productset: jsonData },
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					if (response.data.Data == 1) {
						$scope.getProductset();
						swal({
							title: "Product Set",
							text: response.data.Message,
							icon: "success",
							button: "Okay",
						});
						window.location.href = "/productset";
					} else {
						swal({
							title: "Product Set",
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
	};
	$scope.ProductSet = {};
	$scope.Counts = {};
	$scope.sortBy = { 'updatedAt': -1 };
	$scope.page = 1;
	$scope.limit = "10";
	$scope.selectAll = false;
	$scope.search = null;
	let sort = false;
	$scope.pageNumberList = [];
	$scope.tabName = 'all';
	$scope.getProductset = () => {
		let jsonData = { sortBy: $scope.sortBy, page: $scope.page, limit: $scope.limit, search: $scope.search, tabName: $scope.tabName };
		$http({
			url: "/productset/list",
			method: "POST",
			cache: false,
			data: jsonData,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}).then(
			function (response) {
				if (response.data.IsSuccess == true) {
					$scope.ProductSet = response.data.Data.results;
					$scope.imgLink = response.data.Data.s3_image_link;
					response.data.Data.count.forEach((element) => {
						if (element.status) {
							$scope.Counts.active = element.count
						} else {
							$scope.Counts.inactive = element.count
						}
					});
					let data = HelperService.paginator($scope.ProductSet.totalPages, $scope.page, 9);
					$scope.pageNumberList = data;
				}
			}, function (error) {
				console.error(error);
			}
		);
	}
	$scope.getProductset();
	$scope.sortByFn = (sortBy) => {
		$scope.sortBy = {};
		$scope.sortBy[sortBy] = sort ? 'asc' : 'desc';
		$scope.getProductset();
		sort = sort ? false : true;
	}
	$scope.checkAll = () => {
		$scope.selectAll = $scope.selectAll ? false : true;
		if ($scope.selectAll == null || $scope.selectAll == true) {
			$scope.ProductSet.docs.forEach(element => {
				element.selected = true;
			});
		} else {
			$scope.ProductSet.docs.forEach(element => {
				element.selected = false;
			});
		}
	}
	$scope.onLimitChange = () => {
		$scope.page = 1;
		$scope.getProductset();
	}
	$scope.switchPage = (page) => {
		$scope.page = page;
	};
	$scope.onTabChange = (tabName) => {
		$scope.page = 1;
		$scope.tabName = tabName;
		$scope.getProductset();
	};
	$scope.onEdit = (sid) => {
		window.location.href = "/productset/edit?sid=" + sid;
	};
	$scope.onEditLoad = () => {
		let sid = HelperService.queryString('sid');
		if (sid != 0 && sid != null && sid != '' && sid != undefined) {
			$scope.setId = sid;
			$http({
				url: "/productset/getproductsetbyId",
				method: "POST",
				cache: false,
				data: { sid: sid },
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if (response.data.Data != 0) {
							let productset = response.data.Data;
							$scope.category = productset.category;
							$scope.parent_vendor = productset.parent_vendor;
							$scope.setname = productset.setname;
							$scope.discounttype = productset.discounttype;
							$scope.discountpercentage = productset.discountpercentage;
							$scope.discountamount = productset.discountamount;
							$scope.status = productset.status;
							productset.products.forEach(element => {
								var obj = {
									productid: element.productid._id,
									qty: element.qty,
									mrp: element.productid.productmrp,
									productname: element.productid.productname,
									productimage: productset.s3_img_url + element.productid.productImages[0]
								};
								$scope.products.push(obj);
							});
							$scope.updateData();
						} else {
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
});
