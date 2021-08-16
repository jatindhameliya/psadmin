var express = require('express');
var router = express.Router();
const VendorsModel = require('../models/vendors.model');
const VendorsUserModel = require('../models/vendorusers.model');
const ResponseManager = require('../utilities/response.manager');
let mongoose = require("mongoose");
const multerFn = require('../utilities/multer.helper');
const OracleCloud = require('../utilities/oraclecloud.helper');
function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('vendors/vendorlist', { title: 'vendorlist', activepage: 'VendorList' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('vendors/vendoradd', { title: 'vendoradd', activepage: 'VendorAdd' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/edit', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.query.vid != '' && req.query.vid != undefined) {
			res.render('vendors/vendoradd', { title: 'vendoradd', activepage: 'VendorAdd' });
		} else {
			var goto = process.env.APP_URI + '/vendors';
			res.redirect(goto);
			res.end();
		}
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/save', multerFn.mUploader.single("myfile") , (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var insertData = JSON.parse(req.body.fields);
		if (req.file){
			var ext = req.file.originalname.split('.').pop();
			var date = new Date();
			var timestamp = date.getTime().toString();
			const fileName = 'vikas/vendorprofile/vqs' + makeid(7) + timestamp + '.' + ext;
			OracleCloud.saveIconToOracle(req.file.buffer, req.file.mimetype, fileName).then(() => {
				insertData.company.icon = fileName;
				const id = insertData.id;
				delete insertData.id;
				if (id == 0 || id == '' || id == null){
					VendorsModel.find({ $or: [
						{ 'company.companyemail': insertData.company.companyemail },
						{ 'company.companyphone': insertData.company.companyphone},
						{ 'company.companymobile': insertData.company.companymobile}
					] }).lean().then((result) => {
						if (result.length > 0) {
							return ResponseManager.onSuccess('Vendor with same email or phone already exist...', 0, res);
						} else {
							insertData.createdBy = req.session.admin_id;
							insertData.updatedBy = req.session.admin_id;
							let newVendor = new VendorsModel(insertData);
							newVendor.save().then((insertResult) => {
								let newVendorUser = new VendorsUserModel({
									name: insertResult.company.firstname + ' ' + insertResult.company.lastname,
									email: insertResult.company.companyemail,
									phone: insertResult.company.companymobile,
									profile: insertResult.company.icon,
									roleid: null,
									password: '',
									status: true,
									parent_vendor: insertResult._id,
									createdBy: req.session.admin_id,
									updatedBy: req.session.admin_id
								});
								newVendorUser.save().then((insertUserResult) => {
									return ResponseManager.onSuccess('Vendor added successfully...', 1, res);
								}).catch((err) => {
									return ResponseManager.onError(err, res);
								});
							}).catch((err) => {
								return ResponseManager.onError(err, res);
							});
						}
					}).catch((err)=> {
						return ResponseManager.onError(err, res);
					});
				}else{
					insertData.updatedBy = req.session.admin_id;
					VendorsModel.findByIdAndUpdate(id, insertData, { new: true }).then((result) => {
						if (result != null) {
							return ResponseManager.onSuccess('Vendor updated successfully...', 1, res);
						} else {
							return ResponseManager.onSuccess('Unable to update Vendor...', 0, res);
						}
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					})
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		}else{
			const id = insertData.id;
			delete insertData.id;
			if (id == 0 || id == '' || id == null) {
				VendorsModel.find({
					$or: [
						{ 'company.companyemail': insertData.company.companyemail },
						{ 'company.companyphone': insertData.company.companyphone },
						{ 'company.companymobile': insertData.company.companymobile }
					]
				}).lean().then((result) => {
					if (result.length > 0) {
						return ResponseManager.onSuccess('Vendor with same email or phone already exist...', 0, res);
					} else {
						insertData.createdBy = req.session.admin_id;
						insertData.updatedBy = req.session.admin_id;
						let newVendor = new VendorsModel(insertData);
						newVendor.save().then((insertResult) => {
							let newVendorUser = new VendorsUserModel({
								name: insertResult.company.firstname + ' ' + insertResult.company.lastname,
								email: insertResult.company.companyemail,
								phone: insertResult.company.companymobile,
								profile: insertResult.company.icon,
								roleid: null,
								password: '',
								status: true,
								parent_vendor: insertResult._id,
								createdBy: req.session.admin_id,
								updatedBy: req.session.admin_id
							});
							newVendorUser.save().then((insertUserResult) => {
								return ResponseManager.onSuccess('Vendor added successfully...', 1, res);
							}).catch((err) => {
								return ResponseManager.onError(err, res);
							});
						}).catch((err) => {
							return ResponseManager.onError(err, res);
						});
					}
				}).catch((err) => {
					return ResponseManager.onError(err, res);
				});
			} else {
				insertData.updatedBy = req.session.admin_id;
				VendorsModel.findByIdAndUpdate(id, insertData, { new: true }).then((result) => {
					if (result != null) {
						return ResponseManager.onSuccess('Vendor updated successfully...', 1, res);
					} else {
						return ResponseManager.onSuccess('Unable to update Vendor...', 0, res);
					}
				}).catch((err) => {
					return ResponseManager.onError(err, res);
				})
			}
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
				{ 'company.companyname': { '$regex': new RegExp(req.body.search, "i") } },
				{ 'company.companyemail': { '$regex': new RegExp(req.body.search, "i") } },
				{ 'company.companyphone': { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		VendorsModel.paginate(searchObj, {
			page, limit: req.body.limit, sort: req.body.sortBy, select: '-password',
			populate: [{
				path: "createdBy",
				model: "adminusers",
				select: 'name -_id',
			}, {
				path: "updatedBy",
				model: "adminusers",
				select: 'name -_id',
			}],
		}).then((vendors_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$company.status",
						"status": { "$first": "$company.status" },
						"count": { "$sum": 1 }
					}
				},
			];
			VendorsModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: vendors_result,
					s3_image_link: process.env.S3_IMAGE_URL
				};
				return ResponseManager.onSuccess('Vendors list', output, res);
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
router.post('/getlist', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		VendorsModel.find({ 'company.status': true }).lean().then((result) => {
			return ResponseManager.onSuccess('Vendor List', result, res);
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	}else{
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/getvendorbyId', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.vid != '' && req.body.vid != undefined && req.body.vid != null && req.body.vid != 0) {
			VendorsModel.findById(req.body.vid).lean().then((vendor) => {
				if (vendor != null) {
					vendor.s3_img_url = process.env.S3_IMAGE_URL;
					return ResponseManager.onSuccess('Vendor', vendor, res);
				} else {
					return ResponseManager.onSuccess('Vendor', 0, res);
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			return ResponseManager.unauthorisedRequest(res);
		}
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
module.exports = router;
