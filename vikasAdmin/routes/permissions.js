var express = require('express');
var router = express.Router();
const MongoUtility = require('../models/mongo-utility');
const permissionHandler = require('../utilities/permission.handler');
const RolesModel = require('../models/roles.model');
const permissionModel = require('../models/permissions.model');
const response = require('../utilities/response.manager');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('permissions', { title: 'permissions', activepage: 'Permissions' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post("/", async (req, res, next) => {
	try {
		if (req.session.admin_id != '' && req.session.admin_id != undefined) {
			const collections = permissionHandler.collections;
			var collect = collections;
			let output = [];
			let rolesList = await RolesModel.find({});

			for (let o = 0; o < rolesList.length; o++) {
				var queryObj = {};
				if (req.session.parentId == 0 || req.session.parentId == null){
					queryObj.roleId = rolesList[o]._id;
				}else{
					queryObj.parentId = req.session.parentId;
					queryObj.roleId = rolesList[o]._id;
				}
				let results = await permissionModel.find(queryObj);
				let permissionSet = [];
				if (results.length > 0) {
					let usedArray = [];
					results.some((data, index) => {
						data.permission.some((element, i) => {
							for (let v = 0; v < collections.length; v++) {
								if (collections[v].value == element.collectionName) {
									permissionSet.push({
										collectionName: element.collectionName,
										insertUpdate: element.insertUpdate,
										delete: element.delete,
										view: element.view
									});
									usedArray.push(element.collectionName);
								}
							}
						})
					});
					let filteredArray = collections.filter(function (x) {
						return !usedArray.includes(x.value);
					});

					filteredArray.some((fData, Dindex) => {
						permissionSet.push({
							collectionName: fData.value,
							insertUpdate: false,
							delete: false,
							view: false
						});
					});
				} else {
					collect.some((collection, cIndex) => {
						permissionSet.push({
							collectionName: collection.value,
							insertUpdate: false,
							delete: false,
							view: false
						});
					});
				}

				output.push({
					roleId: rolesList[o]._id,
					roleName: rolesList[o].roleName,
					permission: permissionSet
				});
			}

			let finalOutput = {
				output: output,
				collections: collections
			};
			console.log(finalOutput);
			return response.onSuccess("GetPermission Structure", finalOutput, res);
		} else {
			return response.unauthorisedRequest(res);
		}
	} catch (err) {
		return response.onError(err, res);
	}
});

router.post("/savePermission", (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { permissions } = req.body;
		if (permissions.length > 0) {
			for (let i = 0; i < permissions.length; i++) {
				var queryObj = {};
				if (req.session.parentId == 0 || req.session.parentId == null) {
					queryObj.roleId = permissions[i].roleId;
				} else {
					queryObj.parentId = req.session.parentId;
					queryObj.roleId = permissions[i].roleId;
				}
				permissionModel.find(queryObj).then((results) => {
					if (results.length == 1) {
						permissionModel.findByIdAndUpdate(results[0]._id, {
							permission: permissions[i].permission,
							updatedAt: Date.now(),
							updatedBy: req.session.admin_id
						}, { new: true }).then((result) => {
							if (result != null) {
								return response.onSuccess("Permissions Saved!", 1, res);
							} else {
								return response.onSuccess("Unable to update Permissions", 0, res);
							}
						}).catch((err) => {
							return response.onError(err, res);
						})
					} else {
						var queryObj = {
							roleId: permissions[i].roleId,
							permission: permissions[i].permission,
							createdBy: req.session.admin_id,
						};
						if (req.session.parentId != 0 && req.session.parentId != null) {
							queryObj.parentId = req.session.parentId;
						}
						let newRolePermission = new permissionModel(queryObj);
						newRolePermission.save().then((result) => {
						}).catch((err) => {
							return response.onError(err, res);
						});
					}
				}).catch((err) => {
					return response.onError(err, res);
				});
			}
			return response.onSuccess("Permissions Saved!", 1, res);
		} else {
			return response.onSuccess("No Permissions Request Detected!", 0, res);
		}
	} else {
		return response.unauthorisedRequest(res);
	}
})
module.exports = router;
