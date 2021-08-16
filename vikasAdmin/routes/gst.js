var express = require('express');
var router = express.Router();
const gstModel = require('../models/gsts.model');
const ResponseManager = require('../utilities/response.manager');
var async = require('async');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('gst', { title: 'gst', activepage: 'GstList' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
module.exports = router;
