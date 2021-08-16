var express = require('express');
var router = express.Router();
const CustomerModel = require('../models/customers.model');
const CustomerTypesModel = require('../models/customertypes.model');
const CustomerUsersModel = require('../models/customerusers.model');
const ResponseManager = require('../utilities/response.manager');
router.get('/customertypes', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('customers/customertypes', { title: 'customertypes', activepage: 'CustomerTypes' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/customertypesave', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { id, customertype, status } = req.body;
		if (id == 0 || id == '') {
			CustomerTypesModel.find({ customertype: customertype }).lean().then((result) => {
				if (result.length > 0) {
					return ResponseManager.onSuccess('Customer Type name already exist...', 0, res);
				} else {
					let newcustomertype = new CustomerTypesModel({
						customertype: customertype,
						createdBy: req.session.admin_id,
						updatedBy: req.session.admin_id,
						status: status
					});
					newcustomertype.save().then((insertResult) => {
						return ResponseManager.onSuccess('Customer Type added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			CustomerTypesModel.findByIdAndUpdate(id, { customertype: customertype, status: status }, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('Customer Type updated successfully...', 1, res);
				} else {
					return ResponseManager.onSuccess('Unable to update Customer Type...', 0, res);
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
router.post('/customertypelist', (req, res, next) => {
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
				{ customertype: { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		CustomerTypesModel.paginate(searchObj, {
			page, limit: req.body.limit, sort: req.body.sortBy,
			populate: [{
				path: "createdBy",
				model: "adminusers",
				select: 'name -_id',
			}, {
				path: "updatedBy",
				model: "adminusers",
				select: 'name -_id',
			}],
		}).then((customertype_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			CustomerTypesModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: customertype_result
				};
				return ResponseManager.onSuccess('Customer Type list', output, res);
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
router.post('/customertypedelete', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.id != '' && req.body.id != undefined) {
			CustomerTypesModel.findByIdAndRemove(req.body.id, { new: true }).then((result) => {
				return ResponseManager.onSuccess('Customer Type Deleted', 1, res);
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
router.post('/customertypegetlist', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		CustomerTypesModel.find({ status: true }).lean().then((result) => {
			return ResponseManager.onSuccess('Customer Types List', result, res);
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('customers/customerslist', { title: 'customerslist', activepage: 'CustomersList' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/sync', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('customers/customerssync', { title: 'customerssync', activepage: 'CustomersSync' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('customers/customersadd', { title: 'customersadd', activepage: 'CustomersAdd' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});

module.exports = router;
