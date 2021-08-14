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
        var orderQueryObj = {'order_status' : { '$in' : ['Placed', 'Processing', 'Completed']}};
        MongoUtility.GetWithSearchSort('orders', orderQueryObj, sortObj, (err, orders_result) => {
            if(err){
                console.log(err);
            }else{
                if(orders_result){
                    var allorder = [];
                    async.forEachSeries(orders_result, function (order, next_order) {
                        var obj = {
                            '_id' : order._id.toString(),
                            'shop' : order.shop,
                            'order_no' : order.order_no,
                            'order_status' : order.order_status,
                            'comment' : order.comment,
                            'no_of_products' : order.no_of_products,
                            'unit_price' : order.unit_price,
                            'total_amount' : order.total_amount,
                            'orderplaceddate' : timestampTodate(order.timestamp),
                            'timestamp' : order.timestamp
                        };
                        allorder.push(obj);
                        next_order();
                    }, function () {
                        res.render('pages/order_list',{'orders' : allorder, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/order_list',{'orders' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                }  
            }
        });
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.get('/edit', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.query.id != "" && req.query.id != undefined){
            var queryObj = { '_id': new ObjectId(req.query.id)};
            MongoUtility.SelectOne('orders', queryObj, (err, order) => {
                if (err) {
                    req.flash("error_messages", "Invalid order please try again to edit.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/order';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    if (order) {
                        var obj = {
                            '_id' : order._id.toString(),
                            'shop' : order.shop,
                            'order_no' : order.order_no,
                            'order_status' : order.order_status,
                            'comment' : order.comment,
                            'no_of_products' : order.no_of_products,
                            'unit_price' : order.unit_price,
                            'total_amount' : order.total_amount,
                            'orderplaceddate' : timestampTodate(order.timestamp),
                            'timestamp' : order.timestamp
                        };
                        var productsQueryObj = {'shop' : order.shop, 'order_id' : order.order_no};
                        var sortObj = {'created_at' : -1};
                        MongoUtility.GetWithSearchSort('niche_products',productsQueryObj, sortObj, (err, product_result) => {
                            if(err){
                                console.log(err);
                            }else{
                                if(product_result){
                                    var allproduct = [];
                                    async.forEachSeries(product_result, function (product, next_product) {
                                        var obj = {
                                            '_id' : product._id.toString(),
                                            'product_main_image' : process.env.S3_IMAGE_URL + product.product_main_image,
                                            'product_name' : product.product_name,
                                            'product_status' : product.product_status,
                                            'created_at' : timestampTodate(product.created_at)
                                        };
                                        allproduct.push(obj);
                                        next_product();
                                    }, function () {
                                        res.render('pages/niche_product_list',{'order' : obj,'products' : allproduct, 'ociurl' : process.env.S3_IMAGE_URL});
                                    });
                                }else{
                                    res.render('pages/niche_product_list',{'order' : obj, 'products' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                                }  
                            }
                        });
                    }else{
                        req.flash("error_messages", "Invalid order please try again to edit.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/order';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                }
            });
        }else{
            req.flash("error_messages", "Invalid order please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/order';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.get('/addproduct', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.query.id != "" && req.query.id != undefined){
            var queryObj = { '_id': new ObjectId(req.query.id)};
            MongoUtility.SelectOne('orders', queryObj, (err, order) => {
                if (err) {
                    req.flash("error_messages", "Invalid order please try again to edit.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/order';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    if (order) {
                        var obj = {
                            '_id' : order._id.toString(),
                            'shop' : order.shop,
                            'order_no' : order.order_no,
                            'order_status' : order.order_status,
                            'comment' : order.comment,
                            'no_of_products' : order.no_of_products,
                            'unit_price' : order.unit_price,
                            'total_amount' : order.total_amount,
                            'orderplaceddate' : timestampTodate(order.timestamp),
                            'timestamp' : order.timestamp
                        };
                        res.render('pages/niche_product_create',{'order' : obj, 's3_image_url' : process.env.S3_IMAGE_URL});
                    }else{
                        req.flash("error_messages", "Invalid order please try again to edit.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/order';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                }
            });
        }else{
            req.flash("error_messages", "Invalid order please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/order';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/addNewNicheproduct', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var obj = qs.parse(req.body); 
        var queryObj_product_name = {
            "product_name": {
                '$regex': '^' + obj.product_name + '$',
                '$options': 'i'
            }
        };
        MongoUtility.SelectOne('niche_products', queryObj_product_name, (err, product_result) => {
            if (err) {
                req.flash("error_messages", "Something went wrong, Product can not be added please try again.");
                req.flash("success_messages", "");
                var goto = appURI + '/order';
                res.writeHead(302, {'Location': goto});
                res.end();
            } else {
                if (product_result) {
                    req.flash("error_messages", "Product with same title already exist! Please try again.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/order';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    var sub_img_arr = [];
                    for (var key in obj.subimage) {
                        sub_img_arr.push(obj.subimage[key]);
                    }
                    var date = new Date();
                    var timestamp = date.getTime().toString();
                    var arr = {
                        product_name : obj.product_name,
                        product_main_image : obj.product_main_image,
                        product_sub_image : sub_img_arr,
                        product_description : obj.product_description,
                        walmart_link : obj.walmart_link ? obj.walmart_link : '-',
                        amazon_link : obj.amazon_link ? obj.amazon_link : '-',
                        ali_express_link : obj.ali_express_link ? obj.ali_express_link : '-',
                        ebay_link : obj.ebay_link ? obj.ebay_link : '-',
                        dhgate_link : obj.dhgate_link ? obj.dhgate_link : '-',
                        etsy_link : obj.etsy_link ? obj.etsy_link : '-',
                        product_price_type : obj.product_price_type,
                        product_price : Number(obj.product_price),
                        product_sales_price : Number(obj.product_sales_price),
                        product_profit : Number(obj.product_profit),
                        product_source : obj.product_source,
                        product_orders : obj.product_orders,
                        product_reviews : obj.product_reviews,
                        product_rating : obj.product_rating,
                        products_likes : obj.products_likes ? obj.products_likes : '-',
                        products_comments : obj.products_comments ? obj.products_comments : '-',
                        products_shares : obj.products_shares ? obj.products_shares : '-',
                        products_views : obj.products_views ? obj.products_views : '-',
                        products_reactions : obj.products_reactions ? obj.products_reactions : '-',
                        youtube_video : obj.youtube_video ? obj.youtube_video : '-',
                        product_interest : obj.product_interest ? obj.product_interest : '-',
                        product_comments : obj.product_comments ? obj.product_comments : '-',
                        product_status : obj.product_status,
                        shop : obj.shop_name,
                        order_id : obj.order_id,
                        created_by : req.session.userid,
                        updated_by : req.session.userid,
                        created_at : Number(timestamp),
                        updated_at : Number(timestamp)
                    };
                    MongoUtility.Insert('niche_products', arr, (err, productresult) => {
                        if (err) {
                            req.flash("error_messages", "Something went wrong, Product can not be added please try again.");
                            req.flash("success_messages", "");
                            var goto = appURI + '/order';
                            res.writeHead(302, {'Location': goto});
                            res.end();
                        } else {
                            req.flash("error_messages", "");
                            req.flash("success_messages", "Product added successfully...");
                            var goto = appURI + '/order';
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
routes.get('/nichepedit', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.query.id != "" && req.query.id != undefined){
            var queryObj = { '_id': new ObjectId(req.query.id)};
            MongoUtility.SelectOne('niche_products', queryObj, (err, product) => {
                if (err) {
                    req.flash("error_messages", "Invalid product please try again to edit.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/order';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    if (product) {
                        var arr = {
                            '_id' : product._id.toString(),
                            'product_name' : product.product_name,
                            'product_main_image' : product.product_main_image,
                            'product_sub_image' : product.product_sub_image,
                            'product_description' : product.product_description,
                            'walmart_link' : product.walmart_link,
                            'amazon_link' : product.amazon_link,
                            'ali_express_link' : product.ali_express_link,
                            'ebay_link' : product.ebay_link,
                            'dhgate_link' : product.dhgate_link,
                            'etsy_link' : product.etsy_link,
                            'product_price_type' : product.product_price_type,
                            'product_price' : product.product_price,
                            'product_sales_price' : product.product_sales_price,
                            'product_profit' : product.product_profit,
                            'product_source' : product.product_source,
                            'product_orders' : product.product_orders,
                            'product_reviews' : product.product_reviews,
                            'product_rating' : product.product_rating,
                            'products_likes' : product.products_likes,
                            'products_comments' : product.products_comments,
                            'products_shares' : product.products_shares,
                            'products_views' : product.products_views,
                            'products_reactions' : product.products_reactions,
                            'youtube_video' : product.youtube_video,
                            'product_interest' : product.product_interest,
                            'product_comments' : product.product_comments,
                            'product_status' : product.product_status,
                        };
                        res.render('pages/niche_product_edit',{'data' : arr, 's3_image_url' : process.env.S3_IMAGE_URL});
                    } else {
                        req.flash("error_messages", "Invalid product please try again to edit.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/order';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                }
            });
        }else{
            req.flash("error_messages", "Invalid product please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/order';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.get('/nichepremove', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.query.id != "" && req.query.id != undefined){
            var queryObj = { '_id': new ObjectId(req.query.id)};
            MongoUtility.Delete('niche_products', queryObj, (err, product) => {
                if (err) {
                    req.flash("error_messages", "Invalid product please try again to delete.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/order';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    req.flash("error_messages", "");
                    req.flash("success_messages", "Product deleted successfully...");
                    var goto = appURI + '/order';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                }
            });
        }else{
            req.flash("error_messages", "Invalid product please try again to delete.");
            req.flash("success_messages", "");
            var goto = appURI + '/order';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/nichepupdate',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var obj = qs.parse(req.body); 
        var sub_img_arr = [];
        for (var key in obj.subimage) {
            sub_img_arr.push(obj.subimage[key]);
        }
        var date = new Date();
        var timestamp = date.getTime().toString();
        var arr = {
            product_name : obj.product_name,
            product_main_image : obj.product_main_image,
            product_sub_image : sub_img_arr,
            product_description : obj.product_description,
            walmart_link : obj.walmart_link ? obj.walmart_link : '-',
            amazon_link : obj.amazon_link ? obj.amazon_link : '-',
            ali_express_link : obj.ali_express_link ? obj.ali_express_link : '-',
            ebay_link : obj.ebay_link ? obj.ebay_link : '-',
            dhgate_link : obj.dhgate_link ? obj.dhgate_link : '-',
            etsy_link : obj.etsy_link ? obj.etsy_link : '-',
            product_price_type : obj.product_price_type,
            product_price : Number(obj.product_price),
            product_sales_price : Number(obj.product_sales_price),
            product_profit : Number(obj.product_profit),
            product_source : obj.product_source,
            product_orders : obj.product_orders,
            product_reviews : obj.product_reviews,
            product_rating : obj.product_rating,
            products_likes : obj.products_likes ? obj.products_likes : '-',
            products_comments : obj.products_comments ? obj.products_comments : '-',
            products_shares : obj.products_shares ? obj.products_shares : '-',
            products_views : obj.products_views ? obj.products_views : '-',
            products_reactions : obj.products_reactions ? obj.products_reactions : '-',
            youtube_video : obj.youtube_video ? obj.youtube_video : '-',
            product_interest : obj.product_interest ? obj.product_interest : '-',
            product_comments : obj.product_comments ? obj.product_comments : '-',
            product_status : obj.product_status,
            updated_by : req.session.userid,
            updated_at : Number(timestamp)
        };
        var updateObj = {'_id' : new ObjectId(obj.productid)};
        MongoUtility.Update('niche_products', updateObj, arr, (err, productresult) => {
            if (err) {
                req.flash("error_messages", "Something went wrong, Product can not be updated please try again.");
                req.flash("success_messages", "");
                var goto = appURI + '/order';
                res.writeHead(302, {'Location': goto});
                res.end();
            } else {
                req.flash("error_messages", "");
                req.flash("success_messages", "Product updated successfully...");
                var goto = appURI + '/order';
                res.writeHead(302, {'Location': goto});
                res.end();
            }
        });
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/updateorderStatus', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.body.order_mongoid != "" && req.body.order_mongoid != undefined && req.body.order_status != "" && req.body.order_status != undefined){
            var arr = {
                'order_status' : req.body.order_status
            };
            var queryObj = {'_id' : ObjectId(req.body.order_mongoid)};
            MongoUtility.Update('orders', queryObj, arr, (err, orderresult) => {
                if (err) {
                    req.flash("error_messages", "Something went wrong, Order can not be updated please try again.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/order';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    req.flash("error_messages", "");
                    req.flash("success_messages", "Order Status updated successfully...");
                    var goto = appURI + '/order';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                }
            });
        }else{
            req.flash("error_messages", "Invalid order please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/order';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
})
module.exports = routes;