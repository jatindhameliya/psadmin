const dotenv = require('dotenv').config();
const routes = require('express').Router();
const ResponseManager = require('../utilities/response.manager');
const WebsiteModel = require('../models/websites.model');
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
routes.get('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('websites/list', { 'ociurl': process.env.S3_IMAGE_URL });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('websites/website', { 'ociurl': process.env.S3_IMAGE_URL });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.get('/edit', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.query.wid != '' && req.query.wid != undefined && req.query.wid != 0 && req.query.wid != null) {
			res.render('websites/website', { 'ociurl': process.env.S3_IMAGE_URL });
		} else {
			var goto = process.env.APP_URI + '/websites';
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
		const { websiteid, website_name, icon, status } = req.body;
		if (websiteid == 0 || websiteid == '') {
			WebsiteModel.find({ 'website_name': website_name }).lean().then((result) => {
				if (result.length > 0) {
					return ResponseManager.onSuccess('Website with same name already exist...', 0, res);
				} else {
					let obj = {
						website_name: website_name,
						icon: icon,
						status: status,
						createdBy: req.session.admin_id,
						updatedBy: req.session.admin_id
					};
					let newWebsite = new WebsiteModel(obj);
					newWebsite.save().then((insertResult) => {
						return ResponseManager.onSuccess('Website added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			WebsiteModel.findByIdAndUpdate(websiteid, { website_name: website_name, icon: icon, status: status }, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('Website updated successfully...', 1, res);
				} else {
					return ResponseManager.onSuccess('Unable to update Website...', 0, res);
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
				{ website_name: { '$regex': new RegExp(req.body.search, "i") } }
			];
		};
		WebsiteModel.paginate(searchObj, {
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
		}).then((website_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			WebsiteModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: website_result,
					s3_image_url: process.env.S3_IMAGE_URL
				};
				return ResponseManager.onSuccess('website list', output, res);
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
routes.post('/getwebsitebyId', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.wid != '' && req.body.wid != undefined && req.body.wid != null && req.body.wid != 0) {
			WebsiteModel.findById(req.body.wid).lean().then((website) => {
				if (website != null) {
					website.s3_img_url = process.env.S3_IMAGE_URL;
					return ResponseManager.onSuccess('website', website, res);
				} else {
					return ResponseManager.onSuccess('website', 0, res);
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
})
module.exports = routes;
