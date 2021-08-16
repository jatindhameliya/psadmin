var express = require('express');
var router = express.Router();
const TagsModel = require('../models/tags.model');
const ResponseManager = require('../utilities/response.manager');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('tags', { title: 'tags', activepage: 'Tags' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { id, tagname, status } = req.body;
		if (id == 0 || id == '') {
			TagsModel.find({ tagname: tagname }).lean().then((result) => {
				if (result.length > 0) {
					return ResponseManager.onSuccess('Tag name already exist...', 0, res);
				} else {
					let newTag = new TagsModel({
						tagname: tagname,
						createdBy: req.session.admin_id,
						updatedBy: req.session.admin_id,
						status: status
					});
					newTag.save().then((insertResult) => {
						return ResponseManager.onSuccess('Tag added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			TagsModel.findByIdAndUpdate(id, { tagname: tagname, status: status }, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('Tag updated successfully...', 1, res);
				} else {
					return ResponseManager.onSuccess('Unable to update Tag...', 0, res);
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
				{ tagname: { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		TagsModel.paginate(searchObj, {
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
		}).then((tags_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			TagsModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: tags_result
				};
				return ResponseManager.onSuccess('Tags list', output, res);
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
			TagsModel.findByIdAndRemove(req.body.id, { new: true }).then((result) => {
				return ResponseManager.onSuccess('Tag Deleted', 1, res);
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
		TagsModel.find({ status: true }).lean().then((result) => {
			return ResponseManager.onSuccess('Tags List', result, res);
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
module.exports = router;
