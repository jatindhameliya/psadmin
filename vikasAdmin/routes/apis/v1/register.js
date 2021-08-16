var express = require('express');
var router = express.Router();
const CustomerModel = require('../../../models/customers.model');
const ResponseManager = require('../../../utilities/response.manager');
router.post('/', (req, res, next) => {
	if (req.body.email != '' && req.body.email != undefined && req.body.mobile != '' && req.body.mobile != undefined){
		CustomerModel.find({
			$or: [
				{ 'email': req.body.email },
				{ 'mobile': req.body.email }
			]
		}).lean().then((result) => {
			if (result.length > 0) {
				return ResponseManager.onSuccess('Customer with same email or phone already exist...', 0, res);
			} else {
				let newCustomer = new CustomerModel(req.body);
				newCustomer.save().then((insertCustomerResult) => {
					return ResponseManager.onSuccess('Customer added successfully...', 1, res);
				}).catch((err) => {
					return ResponseManager.badrequest(err, res);
				});
			}
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	}else{
		return ResponseManager.unauthorisedRequest(res);
	}
});
module.exports = router;
