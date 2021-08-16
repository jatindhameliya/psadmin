var express = require('express');
var router = express.Router();
const MongoUtility = require('../models/mongo-utility');
const AdminUsersModel = require('../models/adminusers.model');
const ResponseManager = require('../utilities/response.manager');
let mongoose = require("mongoose");
var generator = require('generate-password');
router.get('/', function(req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('users/user-list', { title: 'userlist', activepage: 'UserList' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('users/user-add', { title: 'userlist', activepage: 'Useradd' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const {id, name, email, phone, Roleid, status } = req.body;
		if (id == 0 || id == '') {
			AdminUsersModel.find({ email: email }).lean().then((result) => {
				if (result.length > 0) {
					return ResponseManager.onSuccess('Admin User already exist with email...', 0, res);
				} else {
					let newUser = new AdminUsersModel({
						username: email,
						email: email,
						password: generator.generate({
							length: 15,
							numbers: true,
							symbols: true
						}),
						name: name,
						phone: phone,
						createdBy: req.session.admin_id,
						updatedBy: req.session.admin_id,
						status: status,
						parentId: mongoose.Types.ObjectId(req.session.admin_id),
						roleId: mongoose.Types.ObjectId(Roleid)
					});
					newUser.save().then((insertResult) => {
						return ResponseManager.onSuccess('Admin User added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			AdminUsersModel.findByIdAndUpdate(id, {
				username: email,
				email: email,
				name: name,
				phone: phone,
				updatedBy: req.session.admin_id,
				status: status,
				roleId: mongoose.Types.ObjectId(Roleid)
			}, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('User updated successfully...', 1, res);
				} else {
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
				{ name: { '$regex': new RegExp(req.body.search, "i") } },
				{ email: { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		AdminUsersModel.paginate(searchObj, {
			page, limit: req.body.limit, sort: req.body.sortBy, select:'-password',
			populate: [{
				path: "createdBy",
				model: "adminusers",
				select: 'name -_id',
			}, {
				path: "updatedBy",
				model: "adminusers",
				select: 'name -_id',
			}, {
				path: "roleId",
				model: "adminroles",
				select: 'roleName',
			}
		],
		}).then((adminusers_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			AdminUsersModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: adminusers_result
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
module.exports = router;
