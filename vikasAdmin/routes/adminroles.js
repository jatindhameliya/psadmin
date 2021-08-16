var express = require('express');
var router = express.Router();
const MongoUtility = require('../models/mongo-utility');
const RolesModel = require('../models/roles.model');
const AdminUsersModel = require('../models/adminusers.model');
const ResponseManager = require('../utilities/response.manager');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('adminroles', { title: 'dashboard', activepage: 'Adminroles' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const {id, roleName, status} = req.body;
		if(id == 0 || id == ''){
			RolesModel.find({ roleName: roleName}).lean().then((result) => {
				if(result.length > 0){
					return ResponseManager.onSuccess('Role name already exist...', 0, res);
				}else{
					let newRole = new RolesModel({
						roleName: roleName,
						createdBy: req.session.admin_id,
						updatedBy: req.session.admin_id,
						status: status
					});
					newRole.save().then((insertResult) => {
						return ResponseManager.onSuccess('Role added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err,res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		}else{
			RolesModel.findByIdAndUpdate(id, { roleName: roleName, status: status },{new : true}).then((result) => {
				if (result != null){
					return ResponseManager.onSuccess('Role updated successfully...', 1, res);
				}else{
					return ResponseManager.onSuccess('Unable to update role...', 0, res);
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			})
		}
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/list', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var searchObj = {};
		if (req.body.tabName == 'active') {
			searchObj.status = true;
		} else if (req.body.tabName == 'inactive') {
			searchObj.status = false;
		}
		const page = req.body.page;
		if (req.body.search != null && req.body.search != '' && req.body.search != undefined) {
			searchObj['$or'] = [
				{ roleName: { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		RolesModel.paginate(searchObj, {
			page, limit: req.body.limit, sort: req.body.sortBy,
			populate:[{
				path: "createdBy",
				model: "adminusers",
				select: 'name -_id',
			}, {
				path: "updatedBy",
				model: "adminusers",
				select: 'name -_id',
			}],
		}).then((roles_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			RolesModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: roles_result
				};
				return ResponseManager.onSuccess('Roles list', output, res);
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/delete', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.id != '' && req.body.id != undefined){
			RolesModel.findByIdAndRemove(req.body.id, {new:true}).then((result) => {
				return ResponseManager.onSuccess('Roles Deleted', 1, res);
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		}else{
			return ResponseManager.unauthorisedRequest(res);
		}
	}else{
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/getlist', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		RolesModel.find({status: true}).lean().then((result) => {
			return ResponseManager.onSuccess('Roles List',result, res);
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
module.exports = router;
