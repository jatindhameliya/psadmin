var express = require('express');
var router = express.Router();
const MongoUtility = require('../models/mongo-utility');
router.get('/', function(req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined){
		var goto = process.env.APP_URI + '/dashboard';
		res.redirect(goto);
		res.end();
	}else{
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
module.exports = router;
