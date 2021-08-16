var express = require('express');
var router = express.Router();
const ProductModel = require('../models/products.model');
const ResponseManager = require('../utilities/response.manager');
var async = require('async');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('products/productslist', { title: 'productslist', activepage: 'ProductsList' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('products/productsadd', { title: 'productsadd', activepage: 'ProductsAdd' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
})
router.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.id == 0 || req.body.id == '') {
			if (req.body.product) {
				let product = req.body.product;
				ProductModel.find({ productname: product.productname }).lean().then((result) => {
					if (result.length > 0) {
						return ResponseManager.onSuccess('Product with same name already exist...', 0, res);
					} else {
						product.createdBy = req.session.admin_id;
						product.updatedBy = req.session.admin_id;
						let newProduct = new ProductModel(product);
						newProduct.save().then((insertResult) => {
							return ResponseManager.onSuccess('Product added successfully...', 1, res);
						}).catch((err) => {
							return ResponseManager.onError(err, res);
						});
					}
				});
			} else {
				return ResponseManager.unauthorisedRequest(res);
			}
		}else{
			let product = req.body.product;
			product.updatedBy = req.session.admin_id;
			ProductModel.findByIdAndUpdate(req.body.id, product, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('Product updated successfully...', 1, res);
				} else {
					return ResponseManager.onSuccess('Unable to update Product...', 0, res);
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		}
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/list', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var searchObj = {};
		if (req.body.tabName == 'active') {
			searchObj.status = true;
		} else if (req.body.tabName == 'inactive') {
			searchObj.status = false;
		}
		const page = req.body.page;
		if (req.body.search != null && req.body.search != '' && req.body.search != undefined) {
			searchObj['$or'] = [
				{ 'productname': { '$regex': new RegExp(req.body.search, "i") } },
				{ 'productreferenceID': { '$regex': new RegExp(req.body.search, "i") } },
				{ 'producthsncode': { '$regex': new RegExp(req.body.search, "i") } },
				{ 'productsku': { '$regex': new RegExp(req.body.search, "i") } },
				{ 'productdescription': { '$regex': new RegExp(req.body.search, "i") } },
				{ 'company.companyname': { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		ProductModel.paginate(searchObj, {
			page, limit: req.body.limit, sort: req.body.sortBy,
			populate: [
				{
					path: "parent_vendor",
					model: "vendors",
					select: 'company.companyname -_id',
				},{
					path: "createdBy",
					model: "adminusers",
					select: 'name -_id',
				}, {
					path: "updatedBy",
					model: "adminusers",
					select: 'name -_id',
				}
			],
		}).then((products_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			ProductModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: products_result,
					s3_image_link: process.env.S3_IMAGE_URL
				};
				return ResponseManager.onSuccess('Products list', output, res);
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.get('/edit', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.query.pid != '' && req.query.pid != undefined){
			res.render('products/productsadd', { title: 'productsadd', activepage: 'ProductsAdd' });
		}else{
			var goto = process.env.APP_URI + '/products';
			res.redirect(goto);
			res.end();
		}
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/getproductbyId', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.pid != '' && req.body.pid != undefined && req.body.pid != null && req.body.pid != 0){
			ProductModel.findById(req.body.pid).lean().then((product) => {
				if (product != null){
					product.s3_img_url = process.env.S3_IMAGE_URL;
					return ResponseManager.onSuccess('Product', product, res);
				}else{
					return ResponseManager.onSuccess('Product', 0, res);
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		}else{
			return ResponseManager.unauthorisedRequest(res);
		}
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/getlistforset', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var finalresult = [];
		ProductModel.find({ status: true, productcategory: req.body.category, parent_vendor: req.body.parent_vendor }).lean().then((result) => {
			async.forEachSeries(result, function (product, nextproduct) {
				var obj = {
					value: product._id.toString(),
					label: product.productname,
					mrp: product.productmrp,
					avatarSrc: process.env.S3_IMAGE_URL+product.productImages[0]
				};
				finalresult.push(obj);
				nextproduct();
			}, function () {
				return ResponseManager.onSuccess('Product List', finalresult, res);
			});
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	}else{
		return ResponseManager.unauthorisedRequest(res);
	}
});
module.exports = router;
