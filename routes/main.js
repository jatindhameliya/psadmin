const dotenv = require('dotenv').config();
const routes = require('express').Router();
const async = require('async');
const MongoUtility = require('../models/mongo-utility');
const appURI = process.env.DOMAIN_NAME;
var ObjectId = require('mongoose').Types.ObjectId;
var qs = require('qs');
routes.get('/',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined && req.session.role != "" && req.session.role != undefined){
        res.render('pages/home', {'ociurl' : process.env.S3_IMAGE_URL});
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/login', (req, res) => {
    if(req.body.username != "" && req.body.username != undefined && req.body.password != "" && req.body.password != undefined){
        var queryObject = {'username' : req.body.username, 'password' : req.body.password};
        MongoUtility.SelectOne('admin_users', queryObject, (err, user_result) => {
           if(err){
               req.flash("error_messages", "Invalid Username or Password Please Try Again...");
               req.flash("success_messages","");
               var goto = appURI;
               res.writeHead(302, {'Location' : goto});
               res.end();
           }else{
               if(user_result){
                    req.session.userid = user_result._id.toString();
                    req.session.username = user_result.username;
                    req.session.role = user_result.role;
                    req.flash("error_messages", "");
                    req.flash("success_messages","WelCome "+user_result.username+" You have successfully logged in");
                    var goto = appURI+'/main';
                    res.writeHead(302, {'Location' : goto});
                    res.end();
               }else{
                   req.flash("error_messages", "Invalid Username or Password Please Try Again...");
                   req.flash("success_messages","");
                   var goto = appURI;
                   res.writeHead(302, {'Location' : goto});
                   res.end();
               }
           }
        });
    }else{
        req.flash("error_messages", "Username or Password Can Not Be Empty Please Try Again...");
        req.flash("success_messages","");
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});


routes.get('/getProductsanalytics', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined && req.session.role != "" && req.session.role != undefined){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var final = new Date(month + '/' + day + '/' + year + ' 23:59:00');
        var today = final.getTime().toString();
        var TotalCommonProducts_past = 0;
        var TotalCommonProducts_future = 0;
        var TotalSpecialProducts_past = 0;
        var TotalSpecialProducts_future = 0;
        var TotalTrendingProducts_past = 0;
        var TotalTrendingProducts_future = 0;
        var TotalVeriantsProducts_past = 0;
        var TotalVeriantsProducts_future = 0;
        var productQueryPast = {'product_status': 'Active', 'display_date': { '$lte': Number(today) }};
        MongoUtility.Count('common_products', productQueryPast, (err, popular_products_count_past) => {
            TotalCommonProducts_past = TotalCommonProducts_past + popular_products_count_past;
            var productQueryFuture = {'product_status': 'Active', 'display_date': { '$gt': Number(today) }};
            MongoUtility.Count('common_products', productQueryFuture, (err, popular_products_count_future) => {
                TotalCommonProducts_future = TotalCommonProducts_future + popular_products_count_future;
                var specialProductsQPast = {'product_status': 'Active', 'display_date': { '$lte': Number(today) }};
                MongoUtility.Count('special_products', specialProductsQPast, (err, specialProducts_count_past) => {
                    TotalSpecialProducts_past = TotalSpecialProducts_past + specialProducts_count_past;
                    var specialProductsQFuture = {'product_status': 'Active', 'display_date': { '$gt': Number(today) }};
                    MongoUtility.Count('special_products', specialProductsQFuture, (err, specialProducts_count_future) => {
                        TotalSpecialProducts_future = TotalSpecialProducts_future + specialProducts_count_future;
                        var trendingProductsQPast = {'product_status': 'Active', 'display_date': { '$lte': Number(today) }};
                        MongoUtility.Count('trending_products', trendingProductsQPast, (err, trendingProducts_count_past) => {
                            TotalTrendingProducts_past = TotalTrendingProducts_past + trendingProducts_count_past;
                            var trendingProductsQFuture = {'product_status': 'Active', 'display_date': { '$gt': Number(today) }};
                            MongoUtility.Count('trending_products', trendingProductsQFuture, (err, trendingProducts_count_future) => {
                                TotalTrendingProducts_future = TotalTrendingProducts_future + trendingProducts_count_future;
                                var veriant_productsQPast = {'product_status': 'Active', 'display_date': { '$lte': Number(today) }};
                                MongoUtility.Count('veriant_products', veriant_productsQPast, (err, veriant_products_count_past) => {
                                    TotalVeriantsProducts_past = TotalVeriantsProducts_past + veriant_products_count_past
                                    var veriant_productsQFuture = {'product_status': 'Active', 'display_date': { '$gt': Number(today) }};
                                    MongoUtility.Count('veriant_products', veriant_productsQFuture, (err, veriant_products_count_future) => {
                                        TotalVeriantsProducts_future = TotalVeriantsProducts_future + veriant_products_count_future;
                                        var total = {
                                            'TotalCommonProducts_past' : TotalCommonProducts_past,
                                            'TotalCommonProducts_future' : TotalCommonProducts_future,
                                            'TotalSpecialProducts_past' : TotalSpecialProducts_past,
                                            'TotalSpecialProducts_future' : TotalSpecialProducts_future,
                                            'TotalTrendingProducts_past' : TotalTrendingProducts_past,
                                            'TotalTrendingProducts_future' : TotalTrendingProducts_future,
                                            'TotalVeriantsProducts_past' : TotalVeriantsProducts_past,
                                            'TotalVeriantsProducts_future' : TotalVeriantsProducts_future,
                                            'total_products' : parseFloat(TotalCommonProducts_past+TotalCommonProducts_future+TotalSpecialProducts_past+TotalSpecialProducts_future+TotalTrendingProducts_past+TotalTrendingProducts_future+TotalVeriantsProducts_past+TotalVeriantsProducts_future)
                                        };
                                        res.json({total: total});
                                    });
                                });
                            });
                        }); 
                    });
                });
            });
        });
    }else{
        var total = {'TotalCommonProducts_past' : 0,'TotalCommonProducts_future' : 0,'TotalSpecialProducts_past' : 0,'TotalSpecialProducts_future' : 0,'TotalTrendingProducts_past' : 0,'TotalTrendingProducts_future' : 0,'TotalVeriantsProducts_past' : 0,'TotalVeriantsProducts_future' : 0,'total_products' :0};
        res.json({total: total});
    }
});
routes.get('/getProductsanalyticsbycategory', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined && req.session.role != "" && req.session.role != undefined){
        var productCategoryQuery = {'category_status': 'Active'};
        var sortObj = {'created_at' : -1};
        MongoUtility.GetWithSearchSort('category', productCategoryQuery, sortObj, (err, categories) => {
            if(err){
                res.send({'categories' : []});
            }else{
                if(categories){
                    var allcategory = [];
                    async.forEachSeries(categories, (category, next_category) => {
                        var obj = {
                            '_id' : category._id.toString(),
                            'category_name' : category.category_name    
                        };
                        var Pquery = {'product_category' : category._id.toString()};
                        MongoUtility.Count('common_products', Pquery, (err, commonProductsCount) => {
                            obj.common_products = commonProductsCount;
                            MongoUtility.Count('special_products', Pquery, (err, specialProductsCount) => {
                                obj.special_products = specialProductsCount;
                                MongoUtility.Count('trending_products', Pquery, (err, trendingProductsCount) => {
                                    obj.trending_products = trendingProductsCount;
                                    MongoUtility.Count('veriant_products', Pquery, (err, veriantProductsCount) => {
                                        obj.veriant_products = veriantProductsCount;
                                        allcategory.push(obj);
                                        next_category();
                                    });
                                });
                            });
                        });
                    }, () => {
                        res.send({'categories' : allcategory});
                    });
                }else{
                    res.send({'categories' : []});
                }
            }
        });
    }else{
        res.send({'categories' : []});
    }
});

routes.get('/getProductsanalyticsbycountry', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined && req.session.role != "" && req.session.role != undefined){
        var countrylist = [
            'Worldwide',
            'United States of America',
            'United Kingdom',
            'Australia',
            'Canada',
            'New Zealand',
            'United Arab Emirates',
            'France',
            'Spain',
            'Italy',
            'Rasia',
            'Turkey',
            'India',
            'China',
            'Germany',
            'South Africa'
        ];
        var allcountry = [];
        async.forEachSeries(countrylist, (country, next_country) => {
            var obj = {
                'country_name' : country   
            };
            var Pquery = {'shipment_to' : country};
            MongoUtility.Count('special_products', Pquery, (err, specialProductsCount) => {
                obj.special_products = specialProductsCount;
                MongoUtility.Count('trending_products', Pquery, (err, trendingProductsCount) => {
                    obj.trending_products = trendingProductsCount;
                    MongoUtility.Count('veriant_products', Pquery, (err, veriantProductsCount) => {
                        obj.veriant_products = veriantProductsCount;
                        allcountry.push(obj);
                        next_country();
                    });
                });
            });
        }, () => {
            res.send({'contries' : allcountry});
        });
    }else{
        res.send({'contries' : []});
    }
});

routes.get('/getOrdersanalytics', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var TotalOrders = 0;
        var TotalPaidOrders = 0;
        var TotalInProgressOrders = 0;
        var TotalCompletedOrders = 0;
        var TotalSupportQueries = 0;
        var TotalOrdersQ = {};
        MongoUtility.Count('orders', TotalOrdersQ, (err, TotalOrders_result) => {
            TotalOrders = TotalOrders_result;
            var TotalPaidOrdersQ = {'plan_status' : 'active'};
            MongoUtility.Count('orders', TotalPaidOrdersQ, (err, TotalPaidOrders_result) => {
                TotalPaidOrders = TotalPaidOrders_result;
                var TotalInProgressOrdersQ = {'order_status' : 'InProgress'};
                MongoUtility.Count('orders', TotalInProgressOrdersQ, (err, TotalInProgressOrders_result) => {
                    TotalInProgressOrders = TotalInProgressOrders_result;
                    var TotalCompletedOrdersQ = {'order_status' : 'Completed'};
                    MongoUtility.Count('orders', TotalCompletedOrdersQ, (err, TotalCompletedOrders_result) => {
                        TotalCompletedOrders = TotalCompletedOrders_result;
                        TotalSupportQueriesQ = {};
                        MongoUtility.Count('support', TotalSupportQueriesQ, (err, TotalSupportQueries_result) => {
                            TotalSupportQueries = TotalSupportQueries_result;
                            var total = {'TotalOrders': TotalOrders, 'TotalPaidOrders': TotalPaidOrders, 'TotalInProgressOrders': TotalInProgressOrders, 'TotalCompletedOrders': TotalCompletedOrders, 'TotalSupportQueries' : TotalSupportQueries};
                            res.json({total: total});
                        });
                    });
                });
            });
        });
    }else{
        var total = {'TotalOrders': 0, 'TotalPaidOrders': 0, 'TotalInProgressOrders': 0, 'TotalCompletedOrders': 0, 'TotalSupportQueries' : 0};
        res.json({total: total});
    }
});

routes.get('/getAllalytics', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var TotalProductsCategories = 0;
        var TotalInfluencers = 0;
        var TotalSuppliers = 0;
        var TotalCountries = 0;
        var TotalProductsCategoriesQ = {};
        MongoUtility.Count('category', TotalProductsCategoriesQ, (err, TotalProductsCategories_result) => {
            TotalProductsCategories = TotalProductsCategories_result;
            var TotalInfluencersQ = {};
            MongoUtility.Count('influencer', TotalInfluencersQ, (err, TotalInfluencers_result) => {
                TotalInfluencers = TotalInfluencers_result;
                var TotalSuppliersQ = {};
                MongoUtility.Count('supplier', TotalSuppliersQ, (err, TotalSuppliers_result) => {
                    TotalSuppliers = TotalSuppliers_result;
                    var TotalCountriesQ = {};
                    MongoUtility.Count('country', TotalCountriesQ, (err, TotalCountries_result) => {
                        TotalCountries = TotalCountries_result;
                        var total = {'TotalProductsCategories': TotalProductsCategories, 'TotalInfluencers': TotalInfluencers, 'TotalSuppliers': TotalSuppliers, 'TotalCountries': TotalCountries};
                        res.json({total: total});
                    });
                });
            });
        });
    }else{
        var total = {'TotalProductsCategories': 0, 'TotalInfluencers': 0, 'TotalSuppliers': 0, 'TotalCountries': 0};
        res.json({total: total});
    }
});
       
routes.get('/logout', (req, res) => {
    req.session.destroy(function(err){
        if(err){
            res.redirect(appURI);
        }else{
            res.redirect(appURI);
        }
    });
});
module.exports = routes;