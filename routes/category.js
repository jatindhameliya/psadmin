const dotenv = require('dotenv').config();
const routes = require('express').Router();
const async = require('async');
const MongoUtility = require('../models/mongo-utility');
const appURI = process.env.DOMAIN_NAME;
var ObjectId = require('mongoose').Types.ObjectId;
var qs = require('qs');
function dateTotimestamp(date) {
    var timestamp = new Date(date).getTime();
    return timestamp;
};
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
        MongoUtility.GetWithSort('category', sortObj, (err, category_result) => {
            if(err){
                console.log(err);
            }else{
                if(category_result){
                    var allcategory = [];
                    async.forEachSeries(category_result, function (category, next_category) {
                        var obj = {
                            '_id' : category._id.toString(),
                            'category_name' : category.category_name,
                            'category_description' : category.category_description,
                            'created_at' : timestampTodate(category.created_at),
                            'category_status' : category.category_status
                        };
                        allcategory.push(obj);
                        next_category();
                    }, function () {
                        res.render('pages/category_list',{'categorys' : allcategory, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/category_list',{'categorys' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                }  
            }
        });
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.get('/create',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        res.render('pages/category_create', {'ociurl' : process.env.S3_IMAGE_URL});
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.get('/edit',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.query.id != "" && req.query.id != undefined){
            var queryObj = { '_id': new ObjectId(req.query.id)};
            MongoUtility.SelectOne('category', queryObj, (err, category) => {
                if (err) {
                    req.flash("error_messages", "Invalid category please try again to edit.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/category';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    if (category) {
                        var arr = {
                            '_id' : category._id.toString(),
                            'category_name' : category.category_name,
                            'category_description' : category.category_description,
                            'category_status' : category.category_status
                        };
                        res.render('pages/category_edit', {'data' : arr, 'ociurl' : process.env.S3_IMAGE_URL});
                    } else {
                        req.flash("error_messages", "Invalid category please try again to edit.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/category';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                }
            });
        }else{
            req.flash("error_messages", "Invalid category please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/category';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/update',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.body.category_name != "" && req.body.category_name != undefined && req.body.categoryid != "" && req.body.categoryid != undefined){
            var date = new Date();
            var timestamp_my = date.getTime().toString();
            var arr = {
                'category_name' : req.body.category_name,
                'category_description' : req.body.category_description,
                'category_status' : req.body.category_status,
                'updated_at' : Number(timestamp_my),
                'updated_by' : req.session.userid
            };
            var queryObj = {'_id' : new ObjectId(req.body.categoryid)};
            MongoUtility.Update('category', queryObj, arr, (err, updated_result) => {
                if(err){
                    console.log(err);
                }else{
                    req.flash("error_messages", "");
                    req.flash("success_messages", "Category Updated Successfully...");
                    var goto = appURI + '/category';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                }
            });
        }else{
            req.flash("error_messages", "Category Can Not Update Try Again...");
            req.flash("success_messages", "");
            var goto = appURI + '/category';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/addNew',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.body.category_name != "" && req.body.category_name != undefined){
            var date = new Date();
            var timestamp_my = date.getTime().toString();
            var arr = {
                'category_name' : req.body.category_name,
                'category_description' : req.body.category_description,
                'category_status' : req.body.category_status,
                'updated_at' : Number(timestamp_my),
                'created_at' : Number(timestamp_my),
                'added_by' : req.session.userid,
                'updated_by' : req.session.userid
            };
            MongoUtility.Insert('category', arr, (err, insert_result) => {
                if(err){
                    console.log(err);
                }else{
                    req.flash("error_messages", "");
                    req.flash("success_messages", "Category Added Successfully...");
                    var goto = appURI + '/category';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                }
            });
        }else{
            req.flash("error_messages", "Category Can Not Added Try Again...");
            req.flash("success_messages", "");
            var goto = appURI + '/category';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
module.exports = routes;