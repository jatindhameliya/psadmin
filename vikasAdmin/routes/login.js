var express = require('express');
var router = express.Router();
const MongoUtility = require('../models/mongo-utility');
var qs = require('qs');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var goto = process.env.APP_URI + '/dashboard';
		res.redirect(goto);
		res.end();
	} else {
		res.render('login', { layout : false, title: 'login' });
	}
});
router.post('/', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var goto = process.env.APP_URI + '/dashboard';
		res.redirect(goto);
		res.end();
	} else {
		var body = qs.parse(req.body);
		if (body.username != '' && body.username != undefined && body.password != '' && body.password != undefined) {
			var queryObj = { username: body.username, password: body.password, status: true };
			MongoUtility.SelectOne('adminusers', queryObj, (err, adminusersdata) => {
				if (err) {
					var goto = process.env.APP_URI;
					res.redirect(goto);
					res.end();
				} else {
					if (adminusersdata) {
						req.session.admin_id = adminusersdata._id.toString();
						req.session.name = adminusersdata.name;
						if (adminusersdata.parentId == 0 || adminusersdata.parentId == null){
							req.session.parentId = 0;
						}else{
							req.session.parentId = adminusersdata.parentId.toString();
						}
						req.session.roleId = adminusersdata.roleId.toString();
						var goto = process.env.APP_URI + '/dashboard';
						res.redirect(goto);
						res.end();
					} else {
						var goto = process.env.APP_URI;
						res.redirect(goto);
						res.end();
					}
				}
			});
		} else {
			var goto = process.env.APP_URI;
			res.redirect(goto);
			res.end();
		}
	}
});
module.exports = router;
