var express = require('express');
var router = express.Router();
const gsettingModel = require('../models/gsettings.model');
const ResponseManager = require('../utilities/response.manager');
var async = require('async');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('gsettings', { title: 'gsettings', activepage: 'Gsettings' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		gsettingModel.find().lean().then((result) => {
			if (result.length == 1) {
				gsettingModel.findByIdAndUpdate(result[0]._id, req.body.jsondata).then((result) => {
					return ResponseManager.onSuccess('Global settings saved successfully...', 1, res);
				}).catch((err)=>{
					return ResponseManager.badrequest(err, res);
				});
			}else{
				let insObj = new gsettingModel(req.body.jsondata);
				insObj.save().then((result) => {
					return ResponseManager.onSuccess('Global settings saved successfully...', 1, res);
				}).catch((err)=>{
					return ResponseManager.badrequest(err, res);
				})
			}
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/getdata', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		gsettingModel.find().lean().then((result) => {
			if (result.length == 1){
				return ResponseManager.onSuccess('Global settings...', result[0], res);
			}else{
				return ResponseManager.onSuccess('Global settings...', 0, res);
			}
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
module.exports = router;
