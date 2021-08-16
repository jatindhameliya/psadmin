var express = require('express');
var router = express.Router();
const CategoryModel = require('../../../models/categories.model');
const ResponseManager = require('../../../utilities/response.manager');
const commonHelper = require('../../../utilities/common.helper');
router.post('/', commonHelper.authenticateToken,(req, res, next) => {
	var searchObj = {status:true};
	const page = req.body.page;
	if (req.body.search != null && req.body.search != '' && req.body.search != undefined) {
		searchObj['$or'] = [
			{ categoryname: { '$regex': new RegExp(req.body.search, "i") } },
			{ description: { '$regex': new RegExp(req.body.search, "i") } },
		];
	};
	CategoryModel.paginate(searchObj, {
		page, limit: req.body.limit, sort: req.body.sortBy,
		populate: ({
			path: "parentcategory",
			model: "categories",
			select: 'categoryname',
		})
	}).then((category_result) => {
		return ResponseManager.onSuccess('Categories list', category_result, res);
	}).catch((err) => {
		return ResponseManager.onError(err, res);
	});
});
module.exports = router;
