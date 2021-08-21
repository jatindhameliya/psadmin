const dotenv = require('dotenv').config();
const routes = require('express').Router();
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
const MongoUtility = require('../models/mongo-utility');
const response = require('../utilities/response.manager');
routes.get('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var goto = appURI + '/dashboard';
		res.writeHead(302, { 'Location': goto });
		res.end();
	}else{
		res.render('login', { layout: false, 'ociurl': process.env.S3_IMAGE_URL });
	}
});
routes.post('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var goto = appURI + '/dashboard';
		res.writeHead(302, { 'Location': goto });
		res.end();
	}else{
		if (req.body.username != "" && req.body.username != undefined && req.body.password != "" && req.body.password != undefined) {
			var queryObject = { 'username': req.body.username, 'password': req.body.password };
			MongoUtility.SelectOne('adminusers', queryObject, (err, admin) => {
				if (err) {
					return response.onError(err, res);
				} else {
					if (admin) {
						req.session.admin_id = admin._id.toString();
						req.session.username = admin.username;
						req.session.role = admin.role;
						return response.onSuccess("Admin Login Successfull", 1, res);
					} else {
						return response.onSuccess("Invalid Username or Password", 0, res);
					}
				}
			});
		} else {
			return response.onSuccess("Username or Password can not be empty", 0, res);
		}
	}
});
module.exports = routes;
