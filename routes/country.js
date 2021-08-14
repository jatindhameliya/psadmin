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
        MongoUtility.GetWithSort('country', sortObj, (err, country_result) => {
            if(err){
                console.log(err);
            }else{
                if(country_result){
                    var allcountry = [];
                    async.forEachSeries(country_result, function (country, next_country) {
                        var obj = {
                            '_id' : country._id.toString(),
                            'name' : country.name,
                            'code' : country.code,
                            'flag' : country.flag,
                            'currency' : country.currency,
                            'currency_symbole' : country.currency_symbole,
                            'rate' : country.rate,
                            'status' : country.status,
                            'created_at' : timestampTodate(country.created_at),
                            'updated_at' : timestampTodate(country.updated_at)
                        };
                        allcountry.push(obj);
                        next_country();
                    }, function () {
                        res.render('pages/country_list',{'countries' : allcountry, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/country_list',{'countries' : [], 'ociurl' : process.env.S3_IMAGE_URL});
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
        if(req.query.id != "" && req.query.id != undefined){
            var queryObj = { '_id': new ObjectId(req.query.id)};
            MongoUtility.SelectOne('country', queryObj, (err, country) => {
                if (err) {
                    req.flash("error_messages", "Invalid country please try again to edit.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/country';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    if (country) {
                        var arr = {
                            '_id' : country._id.toString(),
                            'name' : country.name,
                            'code' : country.code,
                            'flag' : country.flag,
                            'currency' : country.currency,
                            'currency_symbole' : country.currency_symbole,
                            'rate' : country.rate,
                            'status' : country.status,
                            'created_at' : timestampTodate(country.created_at),
                            'updated_at' : timestampTodate(country.updated_at)
                        };
                        res.render('pages/country_edit', {'data' : arr, 'ociurl' : process.env.S3_IMAGE_URL});
                    } else {
                        req.flash("error_messages", "Invalid country please try again to edit.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/country';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                }
            });
        }else{
            req.flash("error_messages", "Invalid country please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/country';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
// routes.post('/update',(req, res) => {
//     if(req.session.userid != "" && req.session.userid != undefined){
//         if(req.body.influencerid != "" && req.body.influencerid != undefined){
//             var date = new Date();
//             var timestamp_my = date.getTime().toString();
//             var arr = {
//             };
//             var queryObj = {'_id' : new ObjectId(req.body.influencerid)};
//             MongoUtility.Update('influencer', queryObj, arr, (err, updated_result) => {
//                 if(err){
//                     console.log(err);
//                 }else{
//                     req.flash("error_messages", "");
//                     req.flash("success_messages", "Influencer Updated Successfully...");
//                     var goto = appURI + '/influencer';
//                     res.writeHead(302, {'Location': goto});
//                     res.end();
//                 }
//             });
//         }else{
//             req.flash("error_messages", "Influencer Can Not Update Try Again...");
//             req.flash("success_messages", "");
//             var goto = appURI + '/influencer';
//             res.writeHead(302, {'Location': goto});
//             res.end();
//         }
//     }else{
//         var goto = appURI;
//         res.writeHead(302, {'Location' : goto});
//         res.end();
//     }
// });
module.exports = routes;