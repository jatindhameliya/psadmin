const dotenv = require('dotenv').config();
const routes = require('express').Router();
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
routes.get('/', (req, res, next) => {
	res.render('login', { layout: false, 'ociurl': process.env.S3_IMAGE_URL });
});
routes.post('/', (req, res, next) => {
})
module.exports = routes;
