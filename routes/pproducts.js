const dotenv = require('dotenv').config();
const routes = require('express').Router();
const ResponseManager = require('../utilities/response.manager');
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
routes.get('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('pproducts/list', { 'ociurl': process.env.S3_IMAGE_URL });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('pproducts/product', { 'ociurl': process.env.S3_IMAGE_URL });
	} else {
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
routes.get('/edit', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.query.cid != '' && req.query.cid != undefined && req.query.cid != 0 && req.query.cid != null) {
			res.render('pproducts/product', { 'ociurl': process.env.S3_IMAGE_URL });
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
module.exports = routes;
