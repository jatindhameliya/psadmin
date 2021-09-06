const dotenv = require('dotenv').config();
const routes = require('express').Router();
const ResponseManager = require('../utilities/response.manager');
const async = require('async');
const appURI = process.env.DOMAIN_NAME;
module.exports = routes;

// DOMAIN_NAME = http://localhost:3005
// PORT = 3005
// MONGO_URI = mongodb+srv://topproducts_user:ToPproDuctSa1b2c3@cluster0.kf0my.mongodb.net/ps?retryWrites=true&w=majority
// DB_NAME = ps
// OLD_AWS_ACCESS_KEY = AKIAZUKCJDIKTRGOTVOU
// OLD_AWS_SECRET_ACCESS_KEY = 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
// AWS_ACCESS_KEY = ac83428f5cae8704cbcf2bc6279cef92f4016b4d
// AWS_SECRET_ACCESS_KEY = BH6g+okIdHkxavefb2RqXWsFsLJPJnqTQJgfcX+6xig=
// S3_BUCKET = positivescript
// OLD_S3_ENDPOINT = https://bm2jbubgz5me.compat.objectstorage.ap-mumbai-1.oraclecloud.com
// S3_IMAGE_URL = https://objectstorage.ap-mumbai-1.oraclecloud.com/n/bm2jbubgz5me/b/positivescript/o/
// S3_ENDPOINT = https://objectstorage.ap-mumbai-1.oraclecloud.com/p/IyzWzV_MXI3Gq6Xcf3K--dCEBy11zzN4tqwEk-bE7SN0zSbHdf8GtSq1WCX1O5gZ/n/bm2jbubgz5me/b/positivescript/o/
