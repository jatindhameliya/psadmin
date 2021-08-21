const dotenv = require('dotenv').config();
const routes = require('express').Router();
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
routes.get('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined){
		res.render('dashboard', {'ociurl': process.env.S3_IMAGE_URL, 'page' : 'dashboard' });
	}else{
		var goto = appURI;
		res.writeHead(302, { 'Location': goto });
		res.end();
	}
});
module.exports = routes;
