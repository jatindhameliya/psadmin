const dotenv = require('dotenv').config();
const routes = require('express').Router();
const ResponseManager = require('../utilities/response.manager');
const PProductModel = require('../models/pproducts.model');
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
routes.get('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('pproducts/list', { 'ociurl': process.env.S3_IMAGE_URL, 'page': 'pproducts' });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('pproducts/product', { 'ociurl': process.env.S3_IMAGE_URL, 'page': 'pproducts' });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.get('/edit', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.query.cid != '' && req.query.cid != undefined && req.query.cid != 0 && req.query.cid != null) {
			res.render('pproducts/product', { 'ociurl': process.env.S3_IMAGE_URL, 'page': 'pproducts' });
		} else {
			var goto = process.env.APP_URI + '/pproducts';
			res.redirect(goto);
			res.end();
		}
	} else {
		var goto = appURI;
		res.redirect(goto);
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
				{ product_name: { '$regex': new RegExp(req.body.search, "i") } },
				{ product_description: { '$regex': new RegExp(req.body.search, "i") } },
				{ product_interest: { '$regex': new RegExp(req.body.search, "i") } }
			];
		};
		PProductModel.paginate(searchObj, {
			page, limit: req.body.limit, sort: req.body.sortBy
			// populate: [
			// 	{
			// 		path: "createdBy",
			// 		model: "admin_users",
			// 		select: 'name -_id',
			// 	}, {
			// 		path: "updatedBy",
			// 		model: "admin_users",
			// 		select: 'name -_id',
			// 	}
			// ],
		}).then((pproduct_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			PProductModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: pproduct_result,
					s3_image_url: process.env.S3_IMAGE_URL
				};
				return ResponseManager.onSuccess('PProduct list', output, res);
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
module.exports = routes;
