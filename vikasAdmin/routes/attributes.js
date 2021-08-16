var express = require('express');
var router = express.Router();
const AttributeModel = require('../models/attributes.model');
const ResponseManager = require('../utilities/response.manager');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('attributes/attributeslist', { title: 'attributeslist', activepage: 'AttributesList' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('attributes/attributeadd', { title: 'attributeadd', activepage: 'AttributeAdd' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { id, attributename, status } = req.body;
		if (id == 0 || id == '') {
			AttributeModel.find({ attributename: attributename }).lean().then((result) => {
				if (result.length > 0) {
					return ResponseManager.onSuccess('Attribute name already exist...', 0, res);
				} else {
					let newAttribute = new AttributeModel({
						attributename: attributename,
						createdBy: req.session.admin_id,
						updatedBy: req.session.admin_id,
						status: status
					});
					newAttribute.save().then((insertResult) => {
						return ResponseManager.onSuccess('Attribute added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			AttributeModel.findByIdAndUpdate(id, { attributename: attributename, status: status }, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('Attribute updated successfully...', 1, res);
				} else {
					return ResponseManager.onSuccess('Unable to update Attribute...', 0, res);
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
				{ attributename: { '$regex': new RegExp(req.body.search, "i") } }
			];
		};
		AttributeModel.paginate(searchObj, {
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
		}).then((attribute_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			AttributeModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: attribute_result
				};
				return ResponseManager.onSuccess('Attribute list', output, res);
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
		if (req.body.id != '' && req.body.id != undefined) {
			AttributeModel.findByIdAndRemove(req.body.id, { new: true }).then((result) => {
				return ResponseManager.onSuccess('Attribute Deleted', 1, res);
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
router.post('/getlist', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		AttributeModel.find({ status: true }).lean().then((result) => {
			return ResponseManager.onSuccess('Attribute List', result, res);
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/getattributeList', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		AttributeModel.find({ status: true }).lean().then((result) => {
			return ResponseManager.onSuccess('Attribute List', result, res);
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
module.exports = router;
