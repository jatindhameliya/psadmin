const dotenv = require('dotenv').config();
const routes = require('express').Router();
const ResponseManager = require('../utilities/response.manager');
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
module.exports = routes;
