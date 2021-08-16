var express = require('express');
var router = express.Router();
const multerFn = require('../utilities/multer.helper');
const OracleCloud = require('../utilities/oraclecloud.helper');
const ResponseManager = require('../utilities/response.manager');
function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};
router.post('/productsimg', multerFn.mUploader.single("productImg"), function (req, res, next) {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.file) {
			var ext = req.file.originalname.split('.').pop();
			var date = new Date();
			var timestamp = date.getTime().toString();
			const fileName = 'vikas/productimg/vqs' + makeid(7) + timestamp + '.' + ext;
			OracleCloud.saveIconToOracle(req.file.buffer, req.file.mimetype, fileName).then(() => {
				res.json({ url: fileName});
			}).catch((err) => {
				res.json({ url:''});
			});
		}else{
			res.json({ url: '' });
		}
	} else {
		res.json({ url: '' });
	}
});
router.post('/productattr', multerFn.mUploader.single("myfile"),(req, res, next) => {
	if (req.session.admin_id != '' && req.session.admin_id != undefined) {
		if (req.file) {
			var ext = req.file.originalname.split('.').pop();
			var date = new Date();
			var timestamp = date.getTime().toString();
			const fileName = 'vikas/productattrimg/vqs' + makeid(7) + timestamp + '.' + ext;
			OracleCloud.saveIconToOracle(req.file.buffer, req.file.mimetype, fileName).then(() => {
				return ResponseManager.onSuccess('file added successfully...', fileName, res);
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
