var express = require('express');
var router = express.Router();
const ProductsetsModel = require('../models/productsets.model');
const ResponseManager = require('../utilities/response.manager');
var async = require('async');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('products/productsetlist', { title: 'productsetlist', activepage: 'ProductsetList' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('products/productsetadd', { title: 'productsetadd', activepage: 'ProductsetAdd' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.id == 0 || req.body.id == '') {
			let productset = req.body.productset;
			ProductsetsModel.find({ setname: productset.setname }).lean().then((result) => {
				if (result.length > 0) {
					return ResponseManager.onSuccess('Product Set with same name already exist...', 0, res);
				} else {
					productset.createdBy = req.session.admin_id;
					productset.updatedBy = req.session.admin_id;
					let newProductset = new ProductsetsModel(productset);
					newProductset.save().then((insertResult) => {
						return ResponseManager.onSuccess('Product Set added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			let productset = req.body.productset;
			productset.updatedBy = req.session.admin_id;
			ProductsetsModel.findByIdAndUpdate(req.body.id, productset, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('Product Set updated successfully...', 1, res);
				} else {
					return ResponseManager.onSuccess('Unable to update Product Set...', 0, res);
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
		//parent_vendor: req.session.parent_vendor
		var searchObj = { };
		if (req.body.tabName == 'active') {
			searchObj.status = true;
		} else if (req.body.tabName == 'inactive') {
			searchObj.status = false;
		}
		const page = req.body.page;
		if (req.body.search != null && req.body.search != '' && req.body.search != undefined) {
			searchObj['$or'] = [
				{ 'setname': { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		ProductsetsModel.paginate(searchObj, {
			page, limit: req.body.limit, sort: req.body.sortBy, lean: true,
			populate: [
				{
					path: "category",
					model: "categories",
					select: 'categoryname -_id',
				},{
					path: "parent_vendor",
					model: "vendors",
					select: 'company.companyname -_id',
				}, {
					path: "createdBy",
					model: "vendorusers",
					select: 'name -_id',
					as:'vuser'
				}, {
					path: "updatedBy",
					model: "vendorusers",
					select: 'name -_id',
				},{
					path: "products.productid",
					model: "products",
					select: 'productmrp',
				}
			],
		}).then((productset_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			ProductsetsModel.aggregate(aggregatorOpts).then((results) => {
				var finalproductset = [];
				async.forEachSeries(productset_result.docs, (productset, nextproductset) => {
					var totalamount = 0;
					var totaldiscount = 0;
					var totalfinalamount = 0;
					async.forEachSeries(productset.products, (product, nextproduct) => {
						totalamount = totalamount + (product.productid.productmrp * product.qty);
						nextproduct();
					}, () => {
						if (productset.discounttype != '') {
							if (productset.discounttype == 'byPercentage') {
								totaldiscount = (totalamount * productset.discountpercentage) / 100;
							} else {
								totaldiscount = productset.discountamount;
							}
						} else {
							totaldiscount = 0;
						}
						totalfinalamount = totalamount - totaldiscount;
						productset.totalamount = totalamount;
						productset.totaldiscount = totaldiscount;
						productset.totalfinalamount = totalfinalamount;
						finalproductset.push(productset);
					});
					nextproductset();
				}, () => {
					productset_result.docs = finalproductset;
					let output = {
						count: results,
						results: productset_result,
						s3_image_link: process.env.S3_IMAGE_URL
					};
					return ResponseManager.onSuccess('Product Set list', output, res);
				});
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
		if (req.query.sid != '' && req.query.sid != undefined) {
			res.render('products/productsetadd', { title: 'productsetadd', activepage: 'ProductsetAdd' });
		} else {
			var goto = process.env.APP_URI + '/productset';
			res.redirect(goto);
			res.end();
		}
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/getproductsetbyId', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.sid != '' && req.body.sid != undefined && req.body.sid != null && req.body.sid != 0) {
			ProductsetsModel.findById(req.body.sid).populate({
				path: "products.productid",
				model: "products",
				select: 'productname productmrp productImages'
			}).lean().then((productset) => {
				if (productset != null) {
					productset.s3_img_url = process.env.S3_IMAGE_URL;
					return ResponseManager.onSuccess('Product Set', productset, res);
				} else {
					return ResponseManager.onSuccess('Product Set', 0, res);
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			return ResponseManager.unauthorisedRequest(res);
		}
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
module.exports = router;
