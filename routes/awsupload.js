const dotenv = require('dotenv').config();
const routes = require('express').Router();
const async = require('async');
const MongoUtility = require('../models/mongo-utility');
const appURI = process.env.DOMAIN_NAME;
var ObjectId = require('mongoose').Types.ObjectId;
var qs = require('qs');
const AWS = require('aws-sdk');
var path = require('path');
var fileSystem = require('fs');
const s3 = new AWS.S3({
	region: 'ap-mumbai-1',
	endpoint: process.env.S3_ENDPOINT,
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	s3ForcePathStyle: true,
	signatureVersion: 'v4',
});
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 };

 routes.get('/supplierproductm-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/supplierproductm/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
		const s3Params = {
			Bucket: process.env.S3_BUCKET,
			Key: filename,
			ContentType: fileType,
		};
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

routes.get('/supplierproducts-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/supplierproducts/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

 routes.get('/specialmain-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/specialmain/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

routes.get('/specialsub-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/specialsub/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

routes.get('/trendingmain-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/trendingmain/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

routes.get('/trendingsub-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/trendingsub/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

routes.get('/veriantmain-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/veriantmain/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

routes.get('/veriantsub-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/veriantsub/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

routes.get('/main-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/main/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});
routes.get('/sub-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/sub/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});
routes.get('/fb-sign-s3', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/fb/tp'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});
routes.get('/supplierPro',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/supplier/'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

routes.get('/infProfile', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var filenamea  = req.query['file-name'];
        var ext = filenamea.split('.').pop();
        var date = new Date();
        var timestamp = date.getTime().toString();
        const filename = 'topproducts/influencer/'+makeid(7)+timestamp+'.'+ext;
        const fileType = req.query['file-type'];
        const s3Params = {
            Bucket : process.env.S3_BUCKET,
            Key : filename,
            Expires : 60,
            ContentType : fileType,
            ACL : 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest : data,
                url : `${filename}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }
});

module.exports = routes;
