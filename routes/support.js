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
        var sortObj = {'created_at' : -1};
        MongoUtility.GetWithSort('support', sortObj, (err, support_result) => {
            if(err){
                console.log(err);
            }else{
                if(support_result){
                    var allsupport = [];
                    async.forEachSeries(support_result, function (support, next_support) {
                        var obj = {
                            '_id' : support._id.toString(),
                            'shop' : support.shop,
                            'name' : support.name,
                            'email' : support.email,
                            'status' : support.status,
                            'created_at' :  timestampTodate(support.created_at)
                        };
                        allsupport.push(obj);
                        next_support();
                    }, function () {
                        res.render('pages/support_list',{'supports' : allsupport, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/support_list',{'shops' : [], 'ociurl' : process.env.S3_IMAGE_URL});
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
        res.render('pages/support_edit', {'ociurl' : process.env.S3_IMAGE_URL});
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/update',(req, res) => {

});
module.exports = routes;