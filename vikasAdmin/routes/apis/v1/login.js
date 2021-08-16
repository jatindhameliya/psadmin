var express = require('express');
var router = express.Router();
const CustomerModel = require('../../../models/customers.model');
const ResponseManager = require('../../../utilities/response.manager');
const commonHelper = require('../../../utilities/common.helper');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp(process.env.OTP_SECRET);
const senderID = process.env.SENDER_ID;
// async function encryptPassword(plainPassword) {
// 	let encPassword = CryptoJS.TripleDES.encrypt(plainPassword, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
// 	return encPassword;
// }
// async function decryptPassword(encryptedPassword) {
// 	let decLayer = CryptoJS.TripleDES.decrypt(encryptedPassword, process.env.PASSWORD_ENCRYPTION_SECRET);
// 	let decPassword = decLayer.toString(CryptoJS.enc.Utf8);
// 	return decPassword;
// }
router.post('/',(req, res, next) => {
	if (req.body.email != '' && req.body.email != undefined && req.body.password != '' && req.body.password != undefined){
		CustomerModel.findOne({ email: req.body.email, password: req.body.password}).lean().then((result) => {
			if(result != null){
				var obj = {
					customerId:result._id,
					firstname: result.firstname,
					lastname: result.lastname,
					parent:result.parent,
					accessToken : commonHelper.generateAccessToken({ customerId: result._id })
				}
				return ResponseManager.onSuccess('Customer loged in successfully...', obj, res);
			}else{
				return ResponseManager.badrequest({ message: 'Invalid username or password...'}, res);
			}
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	}else{
		return ResponseManager.unauthorisedRequest(res);
	}
});
router.post('/getOtp', (req, res, next) => {
	if (req.body.mobile != '' && req.body.mobile != undefined) {
		CustomerModel.findOne({ mobile: req.body.mobile, status:true }).lean().then((result) => {
			if (result != null) {
				sendOtp.send(req.body.mobile, senderID, function (error, data) {
					if (error) {
						return ResponseManager.onSuccess('Unable to send OTP on this Number please enter valid Number, this number is not register with system...', 0, res);
					} else {
						return ResponseManager.onSuccess('OTP send successfully...', 1, res);
					}
				});
			} else {
				return ResponseManager.onSuccess('Unable to send OTP on this Number please enter valid Number, this number is not register with system...',0, res);
			}
		}).catch((err) => {
			return ResponseManager.onError(err, res);
		});
	} else {
		return ResponseManager.badrequest({ message: 'Unable to send OTP on this Number please enter valid Number, this number is not register with system...' }, res);
	}
});
router.post('/verify', (req, res) => {
	if (req.body.mobile != '' && req.body.mobile != undefined && req.body.otp != '' && req.body.otp != undefined) {
		CustomerModel.findOne({ mobile: req.body.mobile, status: true }).lean().then((result) => {
			if (result != null) {
				sendOtp.verify(req.body.mobile, req.body.otp, function (error, data) {
					if (data.type == 'success') {
						var obj = {
							customerId: result._id,
							firstname: result.firstname,
							lastname: result.lastname,
							parent: result.parent,
							accessToken: commonHelper.generateAccessToken({ customerId: result._id })
						}
						return ResponseManager.onSuccess('Customer loged in successfully...', obj, res);
					} else {
						return ResponseManager.onSuccess('Unable to verify OTP on this occasion, this number is not register with system...', 0, res);
					}
				});
			} else {
				return ResponseManager.onSuccess('Unable to verify OTP on this occasion, this number is not register with system...', 0, res);
			}
		});
	} else {
		return ResponseManager.badrequest({ message: 'Unable to verify OTP on this occasion, this number is not register with system...' }, res);
	}
});
module.exports = router;
