const dotenv = require('dotenv').config();
const routes = require('express').Router();
const Mongoutility = require('../models/mongo-utility');
const ResponseManager = require('../utilities/response.manager');
const CountryModel = require('../models/countries.model');
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
routes.get('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('countries/list', { 'ociurl': process.env.S3_IMAGE_URL });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('countries/country', { 'ociurl': process.env.S3_IMAGE_URL });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { countryid, name, code, currency, currency_symbole, rate, status, flag } = req.body;
		if (countryid == 0 || countryid == '') {
			CountryModel.find({
				$or: [
					{ 'name': name },
					{ 'code': code }
				]
			}).lean().then((result) => {
				if (result.length > 0) {
					return ResponseManager.onSuccess('Country with same name or code already exist...', 0, res);
				} else {
					let obj = {
						name: name,
						code: code,
						currency: currency,
						currency_symbole: currency_symbole,
						rate: rate,
						status: status,
						flag: flag,
						createdBy: req.session.admin_id,
						updatedBy: req.session.admin_id
					};
					let newCountry = new CountryModel(obj);
					newCountry.save().then((insertResult) => {
						return ResponseManager.onSuccess('Country added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			CountryModel.findByIdAndUpdate(countryid, { name: name, code: code, currency: currency, currency_symbole: currency_symbole, rate: rate, status: status, flag: flag }, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('Country updated successfully...', 1, res);
				} else {
					return ResponseManager.onSuccess('Unable to update Country...', 0, res);
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
routes.get('/edit', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.query.cid != '' && req.query.cid != undefined && req.query.cid != 0 && req.query.cid != null) {
			res.render('countries/country', { 'ociurl': process.env.S3_IMAGE_URL });
		} else {
			var goto = process.env.APP_URI + '/countries';
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
				{ name: { '$regex': new RegExp(req.body.search, "i") } },
				{ code: { '$regex': new RegExp(req.body.search, "i") } },
				{ currency: { '$regex': new RegExp(req.body.search, "i") } },
				{ currency_symbole: { '$regex': new RegExp(req.body.search, "i") } }
			];
		};
		CountryModel.paginate(searchObj, {
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
		}).then((country_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			CountryModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: country_result,
					s3_image_url: process.env.S3_IMAGE_URL
				};
				return ResponseManager.onSuccess('Countries list', output, res);
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
routes.post('/getcountrybyId', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.cid != '' && req.body.cid != undefined && req.body.cid != null && req.body.cid != 0) {
			CountryModel.findById(req.body.cid).lean().then((country) => {
				if (country != null) {
					country.s3_img_url = process.env.S3_IMAGE_URL;
					return ResponseManager.onSuccess('country', country, res);
				} else {
					return ResponseManager.onSuccess('country', 0, res);
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
