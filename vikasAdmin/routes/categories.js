var express = require('express');
var router = express.Router();
const CategoryModel = require('../models/categories.model');
const ResponseManager = require('../utilities/response.manager');
var async = require('async');
var mongoose = require('mongoose');
router.get('/', function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('categories/categorieslist', { title: 'categorieslist', activepage: 'CategoryList' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/edit', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.query.cid != '' && req.query.cid != undefined && req.query.cid != 0 && req.query.cid != null){
			res.render('categories/categoriesadd', { title: 'categoriesadd', activepage: 'CategoryList' });
		}else{
			var goto = process.env.APP_URI + '/categories';
			res.redirect(goto);
			res.end();
		}
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
});
router.get('/add', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		res.render('categories/categoriesadd', { title: 'categoriesadd', activepage: 'CategoryList' });
	} else {
		var goto = process.env.APP_URI + '/login';
		res.redirect(goto);
		res.end();
	}
})
router.post('/save', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		const { id, categoryname, description, parentcategory, status, isfinalcategory} = req.body;
		if (id == 0 || id == '') {
			CategoryModel.find({ categoryname: categoryname }).lean().then((result) => {
				if (result.length > 0) {
					return ResponseManager.onSuccess('Category with same name already exist...', 0, res);
				} else {
					let obj = {
						categoryname: categoryname,
						description: description,
						createdBy: req.session.admin_id,
						updatedBy: req.session.admin_id,
						status: status,
						isfinalcategory: isfinalcategory
					}
					if (mongoose.Types.ObjectId.isValid(parentcategory)){
						obj.parentcategory = parentcategory;
					}
					let newCategory = new CategoryModel(obj);
					newCategory.save().then((insertResult) => {
						return ResponseManager.onSuccess('Category added successfully...', 1, res);
					}).catch((err) => {
						return ResponseManager.onError(err, res);
					});
				}
			}).catch((err) => {
				return ResponseManager.onError(err, res);
			});
		} else {
			CategoryModel.findByIdAndUpdate(id, { categoryname: categoryname, description: description, parentcategory: parentcategory, status: status, isfinalcategory: isfinalcategory }, { new: true }).then((result) => {
				if (result != null) {
					return ResponseManager.onSuccess('Category updated successfully...', 1, res);
				} else {
					return ResponseManager.onSuccess('Unable to update Category...', 0, res);
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
				{ categoryname: { '$regex': new RegExp(req.body.search, "i") } },
				{ description: { '$regex': new RegExp(req.body.search, "i") } },
			];
		};
		CategoryModel.paginate(searchObj, {
			page, limit: req.body.limit, sort: req.body.sortBy,
			populate: [
				{
					path: "parentcategory",
					model: "categories",
					select: 'categoryname -_id',
				},{
					path: "createdBy",
					model: "adminusers",
					select: 'name -_id',
				}, {
					path: "updatedBy",
					model: "adminusers",
					select: 'name -_id',
				}
			],
		}).then((category_result) => {
			const aggregatorOpts = [
				{
					$group: {
						"_id": "$status",
						"status": { "$first": "$status" },
						"count": { "$sum": 1 }
					}
				},
			];
			CategoryModel.aggregate(aggregatorOpts).then((results) => {
				let output = {
					count: results,
					results: category_result
				};
				return ResponseManager.onSuccess('Categories list', output, res);
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
var customCategoriesList = [];
function findChild(parentObect, category) {
	if (category.parentcategory == parentObect.itemId) {
		parentObect.items.push({
			itemId: category._id,
			itemName: category.categoryname,
			items: [],
			displayname: parentObect.displayname+ ' > ' +category.categoryname
		});
		customCategoriesList.push({
			itemId: category._id,
			displayname: parentObect.displayname + ' > ' + category.categoryname
		})
		return parentObect;
	} else {
		if (parentObect.items.length > 0) {
			parentObect.items.some((leven, index) => {
				findChild(leven, category);
			});
		} else {
			return 0;
		}
	}
}
router.post('/getCategoryByParent', async (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		var parentSearchObj = { status : true };
		customCategoriesList = [];
		CategoryModel.find(parentSearchObj).sort({ 'parentcategory': 1, 'createdAt': 1 }).lean().then((categoryList) => {
			let results = [];
			for (let i = 0; i < categoryList.length; i++) {
				if (categoryList[i].parentcategory == null) {
					results.push({
						itemId: categoryList[i]._id.toString(),
						itemName: categoryList[i].categoryname,
						items: [],
						displayname : categoryList[i].categoryname
					});
					customCategoriesList.push({
						itemId: categoryList[i]._id.toString(),
						displayname: categoryList[i].categoryname
					})
				} else {
					results.some((level, index) => {
						categoryList[i].parentcategory = categoryList[i].parentcategory.toString();
						findChild(level, categoryList[i]);
					});
				}
			}
			return ResponseManager.onSuccess('Category list...', customCategoriesList, res);
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/getcategorybyId', (req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.body.cid != '' && req.body.cid != undefined && req.body.cid != null && req.body.cid != 0) {
			CategoryModel.findById(req.body.cid).lean().then((category) => {
				if (category != null) {
					category.s3_img_url = process.env.S3_IMAGE_URL;
					return ResponseManager.onSuccess('category', category, res);
				} else {
					return ResponseManager.onSuccess('category', 0, res);
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
