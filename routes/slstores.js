const dotenv = require('dotenv').config();
const routes = require('express').Router();
const ResponseManager = require('../utilities/response.manager');
const SLStoreModel = require('../models/slstores.model');
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
routes.get('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('slstores/list', { 'ociurl': process.env.S3_IMAGE_URL, 'page': 'slstores' });
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
				{ shop: { '$regex': new RegExp(req.body.search, "i") } },
				{ country_name: { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		SLStoreModel.paginate(searchObj, { page, limit: req.body.limit, sort: req.body.sortBy }).then((SLStore_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			SLStoreModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: SLStore_result
				};
				return ResponseManager.onSuccess('SLStores list', output, res);
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
