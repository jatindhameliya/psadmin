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
        MongoUtility.GetWithSort('influencer', sortObj, (err, influencer_result) => {
            if(err){
                console.log(err);
            }else{
                if(influencer_result){
                    var allinfluencer = [];
                    async.forEachSeries(influencer_result, function (influencer, next_influencer) {
                        var obj = {
                            '_id' : influencer._id.toString(),
                            'shop' : influencer.shop,
                            'inf_image' : influencer.influencer_image,
                            'inf_name' : influencer.inf_name,
                            'inf_email' : influencer.inf_email,
                            'inf_instagram' : influencer.inf_instagram,
                            'inf_youtube_chennel' : influencer.inf_youtube_chennel,
                            'inf_twitter' : influencer.inf_twitter,
                            'inf_facebook' : influencer.inf_facebook,
                            'inf_country' : influencer.inf_country,
                            'inf_instagram_followers' : influencer.inf_instagram_followers,
                            'inf_youtube_subscribers' : influencer.inf_youtube_subscribers,
                            'inf_twitter_followers' : influencer.inf_twitter_followers,
                            'inf_facebook_followers' : influencer.inf_facebook_followers,
                            'inf_status' : influencer.inf_status,
                            'created_at' : timestampTodate(influencer.created_at),
                            'updated_at' : timestampTodate(influencer.updated_at)
                        };
                        allinfluencer.push(obj);
                        next_influencer();
                    }, function () {
                        res.render('pages/influencer_list',{'influencers' : allinfluencer, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/influencer_list',{'influencers' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                }  
            }
        });
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/addNew',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var obj = qs.parse(req.body); 
        var queryObj_influencer_name = {
            "inf_name": {
                '$regex': '^' + obj.inf_name + '$',
                '$options': 'i'
            }
        };
        MongoUtility.SelectOne('influencer', queryObj_influencer_name, (err, influencer_result) => {
            if (err) {
                req.flash("error_messages", "Something went wrong, Influencer can not be added please try again.");
                req.flash("success_messages", "");
                var goto = appURI + '/influencer';
                res.writeHead(302, {'Location': goto});
                res.end();
            } else {
                if (influencer_result) {
                    req.flash("error_messages", "Influencer with same name already exist! Please try again.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/influencer';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    var date = new Date();
                    var timestamp = date.getTime().toString();
                    var arr = {
                        shop : '--',
                        inf_image : obj.influencer_image,
                        inf_name : obj.inf_name,
                        inf_email : obj.inf_email,
                        inf_instagram : obj.inf_instagram,
                        inf_youtube_chennel : obj.inf_youtube_chennel,
                        inf_twitter : obj.inf_twitter,
                        inf_facebook : obj.inf_facebook,
                        inf_country : obj.inf_country,
                        inf_instagram_followers : obj.inf_instagram_followers,
                        inf_youtube_subscribers : obj.inf_youtube_subscribers,
                        inf_twitter_followers : obj.inf_twitter_followers,
                        inf_facebook_followers : obj.inf_facebook_followers,
                        inf_status : obj.inf_status,
                        created_at : Number(timestamp),
                        updated_at : Number(timestamp)
                    };
                    MongoUtility.Insert('influencer', arr, (err, influencerresult) => {
                        if (err) {
                            req.flash("error_messages", "Something went wrong, Influencer can not be added please try again.");
                            req.flash("success_messages", "");
                            var goto = appURI + '/influencer';
                            res.writeHead(302, {'Location': goto});
                            res.end();
                        } else {
                            req.flash("error_messages", "");
                            req.flash("success_messages", "Influencer added successfully...");
                            var goto = appURI + '/influencer';
                            res.writeHead(302, {'Location': goto});
                            res.end();
                        }
                    });
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
        res.render('pages/influencer_create',{'s3_image_url' : process.env.S3_IMAGE_URL});
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
            MongoUtility.SelectOne('influencer', queryObj, (err, influencer) => {
                if (err) {
                    req.flash("error_messages", "Invalid influencer please try again to edit.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/influencer';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    if (influencer) {
                        var arr = {
                            '_id' : influencer._id.toString(),
                            'shop' : influencer.shop,
                            'inf_image' : influencer.inf_image,
                            'inf_name' : influencer.inf_name,
                            'inf_email' : influencer.inf_email,
                            'inf_instagram' : influencer.inf_instagram,
                            'inf_youtube_chennel' : influencer.inf_youtube_chennel,
                            'inf_twitter' : influencer.inf_twitter,
                            'inf_facebook' : influencer.inf_facebook,
                            'inf_country' : influencer.inf_country,
                            'inf_instagram_followers' : influencer.inf_instagram_followers,
                            'inf_youtube_subscribers' : influencer.inf_youtube_subscribers,
                            'inf_twitter_followers' : influencer.inf_twitter_followers,
                            'inf_facebook_followers' : influencer.inf_facebook_followers,
                            'inf_status' : influencer.inf_status,
                            'created_at' : timestampTodate(influencer.created_at),
                            'updated_at' : timestampTodate(influencer.updated_at)
                        };
                        res.render('pages/influencer_edit', {'data' : arr,'s3_image_url' : process.env.S3_IMAGE_URL});
                    } else {
                        req.flash("error_messages", "Invalid influencer please try again to edit.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/influencer';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                }
            });
        }else{
            req.flash("error_messages", "Invalid influencer please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/influencer';
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
        var obj = qs.parse(req.body); 
        if(obj.influencerid != "" && obj.influencerid != undefined){
            var date = new Date();
            var timestamp_my = date.getTime().toString();
            var arr = {
                shop : (obj.shop) ? obj.shop : '--',
                inf_image : obj.influencer_image,
                inf_name : obj.inf_name,
                inf_email : obj.inf_email,
                inf_instagram : obj.inf_instagram,
                inf_youtube_chennel : obj.inf_youtube_chennel,
                inf_twitter : obj.inf_twitter,
                inf_facebook : obj.inf_facebook,
                inf_country : obj.inf_country,
                inf_instagram_followers : obj.inf_instagram_followers,
                inf_youtube_subscribers : obj.inf_youtube_subscribers,
                inf_twitter_followers : obj.inf_twitter_followers,
                inf_facebook_followers : obj.inf_facebook_followers,
                inf_status : obj.inf_status,
                updated_at : Number(timestamp_my)
            };
            var queryObj = {'_id' : new ObjectId(obj.influencerid)};
            MongoUtility.Update('influencer', queryObj, arr, (err, updated_result) => {
                if(err){
                    console.log(err);
                }else{
                    req.flash("error_messages", "");
                    req.flash("success_messages", "Influencer Updated Successfully...");
                    var goto = appURI + '/influencer';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                }
            });
        }else{
            req.flash("error_messages", "Influencer Can Not Update Try Again...");
            req.flash("success_messages", "");
            var goto = appURI + '/influencer';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.get('/remove', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.query.id != "" && req.query.id != undefined){
            var influencerObjQuery = {'_id' : new ObjectId(req.query.id)};
            MongoUtility.Delete('influencer', influencerObjQuery, (err, infresult) => {
                if (err) {
                    req.flash("error_messages", "Invalid influencer please try again to delete.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/influencer';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    req.flash("error_messages", "");
                    req.flash("success_messages", "Influencer deleted successfully...");
                    var goto = appURI + '/influencer';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                }
            });
        }else{
            req.flash("error_messages", "Invalid Influencer please try again to delete.");
            req.flash("success_messages", "");
            var goto = appURI + '/influencer';
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