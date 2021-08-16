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
	if (req.body.username != "" && req.body.username != undefined && req.body.password != "" && req.body.password != undefined) {
		var queryObject = { 'username': req.body.username, 'password': req.body.password };
		MongoUtility.SelectOne('admin_users', queryObject, (err, admin) => {
			if (err) {
				return response.onError(err, res);
			} else {
				if (admin) {
					req.session.admin_id = admin._id.toString();
					req.session.username = user_result.username;
					req.session.role = user_result.role;
					return response.onSuccess("Admin Login Successfull", 1, res);
				} else {
					return response.onSuccess("Invalid Username or Password", 0, res);
				}
			}
		});
	} else {
		return response.onSuccess("Username or Password can not be empty", 0, res);
	}
});
module.exports = routes;
