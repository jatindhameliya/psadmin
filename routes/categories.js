const dotenv = require('dotenv').config();
const routes = require('express').Router();
const CategoryModel = require('../models/categories.model');
const AdminUsers = require('../models/adminusers.model');
const ResponseManager = require('../utilities/response.manager');
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
routes.get('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('categories/list', { 'ociurl': process.env.S3_IMAGE_URL });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('categories/category', { 'ociurl': process.env.S3_IMAGE_URL });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.get('/edit', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.query.cid != '' && req.query.cid != undefined && req.query.cid != 0 && req.query.cid != null){
			res.render('categories/category', { 'ociurl': process.env.S3_IMAGE_URL });
		} else {
			var goto = process.env.APP_URI + '/categories';
			res.redirect(goto);
			res.end();
		}
	} else {
		var goto = appURI;
		res.redirect(goto);
		res.end();
	}
});
routes.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { categoryid, category_name, category_description, category_status } = req.body;
		if (categoryid == 0 || categoryid == '') {
			CategoryModel.find({ category_name: category_name }).lean().then((result) => {
				if (result.length > 0) {
					return ResponseManager.onSuccess('Category with same name already exist...', 0, res);
				} else {
					let obj = {
						category_name: category_name,
						category_description: category_description,
						category_status: category_status,
						createdBy: req.session.admin_id,
						updatedBy: req.session.admin_id
					};
					let newCategory = new CategoryModel(obj);
					newCategory.save().then((insertResult) => {
						return ResponseManager.onSuccess('Category added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			CategoryModel.findByIdAndUpdate(categoryid, { category_name: category_name, category_description: category_description, category_status: category_status }, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('Category updated successfully...', 1, res);
				} else {
					return ResponseManager.onSuccess('Unable to update Category...', 0, res);
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			})
		}
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.post('/list', (req, res, next) => {
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
				{ category_name: { '$regex': new RegExp(req.body.search, "i") } },
				{ category_description: { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		CategoryModel.paginate(searchObj, {
			page, limit: req.body.limit, sort: req.body.sortBy,
			populate: [
				{
					path: "createdBy",
					model: "admin_users",
					select: 'name -_id',
				}, {
					path: "updatedBy",
					model: "admin_users",
					select: 'name -_id',
				}
			],
		}).then((category_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$category_status",
						"category_status": { "$first": "$category_status" },
						"count": { "$sum": 1 }
					}
				},
			];
			CategoryModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: category_result
				};
				return ResponseManager.onSuccess('Categories list', output, res);
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
routes.post('/getcategorybyId', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.cid != '' && req.body.cid != undefined && req.body.cid != null && req.body.cid != 0) {
			CategoryModel.findById(req.body.cid).lean().then((category) => {
				if (category != null) {
					category.s3_img_url = process.env.S3_IMAGE_URL;
					return ResponseManager.onSuccess('category', category, res);
				} else {
					return ResponseManager.onSuccess('category', 0, res);
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
module.exports = routes;
