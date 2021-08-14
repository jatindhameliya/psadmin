const dotenv = require('dotenv').config();
const routes = require('express').Router();
const async = require('async');
const MongoUtility = require('../models/mongo-utility');
const appURI = process.env.DOMAIN_NAME;
var ObjectId = require('mongoose').Types.ObjectId;
var qs = require('qs');
function timestampTodate(timestamp) {
    if(timestamp == '--' || timestamp == undefined || timestamp == ""){
        return '--';
    }else{
        var timestamp = parseInt(timestamp);
        var a = new Date(timestamp);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = date + '-' + month + '-' + year;
        return time;
    }
};
routes.get('/',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var sortObj = {'timestamp' : -1};
        MongoUtility.GetWithSort('shop', sortObj, (err, shop_result) => {
            if(err){
                console.log(err);
            }else{
                if(shop_result){
                    var allshop = [];
                    async.forEachSeries(shop_result, function (shop, next_shop) {
                        var obj = {
                            '_id' : shop._id.toString(),
                            'shop' : shop.shop,
                            'country' : shop.country_name,
                            'status' : shop.status,
                            'email' : shop.email,
                            'plan' : shop.plan,
                            'trial_in_days' : shop.trial_in_days,
                            'appstatus' : shop.appstatus,
                            'installdate' :  timestampTodate(shop.timestamp),
                            'timestamp' : shop.timestamp,
                        };
                        allshop.push(obj);
                        next_shop();
                    }, function () {
                        res.render('pages/store_list',{'shops' : allshop, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/store_list',{'shops' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                }  
            }
        });
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }

});
routes.get('/edit',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        res.render('pages/store_edit', {'ociurl' : process.env.S3_IMAGE_URL});
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/update',(req, res) => {

});
module.exports = routes;