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
function timestampTodateFordatePicker(timestamp) {
    if(timestamp == '--' || timestamp == undefined || timestamp == ""){
        return '--';
    }else{
        var timestamp = parseInt(timestamp);
        var a = new Date(timestamp);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = a.getMonth()+1;
        var date = a.getDate();
        var time = month+ '/' + date + '/' + year;
        return time;
    }
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
        MongoUtility.GetWithSort('veriant_products', sortObj, (err, product_result) => {
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
                            'created_at' : timestampTodate(product.created_at),
                            'display_date' : timestampTodate(product.display_date)
                        };
                        allproduct.push(obj);
                        next_product();
                    }, function () {
                        res.render('pages/veriantproduct_list',{'products' : allproduct, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/veriantproduct_list',{'products' : [], 'ociurl' : process.env.S3_IMAGE_URL});
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
        var searchObj = {'category_status' : 'Active'};
        var sortObj = {'created_at' : -1};
        MongoUtility.GetWithSearchSort('category', searchObj, sortObj, (err, category_result) => {
            if(err){
                console.log(err);
            }else{
                if(category_result){
                    var allcategory = [];
                    async.forEachSeries(category_result, function (category, next_category) {
                        var obj = {
                            '_id' : category._id.toString(),
                            'category_name' : category.category_name
                        };
                        allcategory.push(obj);
                        next_category();
                    }, function () {
                        res.render('pages/veriantproduct_create',{'s3_image_url' : process.env.S3_IMAGE_URL, 'categorys' : allcategory, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/veriantproduct_create',{'s3_image_url' : process.env.S3_IMAGE_URL, 'categorys' : [], 'ociurl' : process.env.S3_IMAGE_URL});
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
            MongoUtility.SelectOne('veriant_products', queryObj, (err, product) => {
                if (err) {
                    req.flash("error_messages", "Invalid product please try again to edit.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/veriantp';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    if (product) {
                        var product_colors = [];
                        var product_sizes = [];
                        if(Array.isArray(product.product_colors)){
                            product_colors = product.product_colors;
                        }
                        if(Array.isArray(product.product_sizes)){
                            product_sizes = product.product_sizes;
                        }
                        var arr = {
                            '_id' : product._id.toString(),
                            'product_name' : product.product_name,
                            'product_category' : product.product_category,
                            'product_main_image' : product.product_main_image,
                            'product_sub_image' : product.product_sub_image,
                            'product_description' : product.product_description,
                            'product_link' : product.product_link,
                            'product_price_type' : product.product_price_type,
                            'product_price' : product.product_price,
                            'product_sales_price' : product.product_sales_price,
                            'product_profit' : product.product_profit,
                            'product_source' : product.product_source,
                            'product_orders' : product.product_orders,
                            'product_reviews' : product.product_reviews,
                            'product_rating' : product.product_rating,
                            'product_type' : product.product_type,
                            'product_colors' : product_colors,
                            'product_sizes' : product_sizes,
                            'seller_name' : product.seller_name,
                            'return_policy' : product.return_policy,
                            'shipment_to' : product.shipment_to,
                            'products_likes' : product.products_likes,
                            'products_comments' : product.products_comments,
                            'products_views' : product.products_views,
                            'display_date' : timestampTodateFordatePicker(product.display_date),
                            'product_comments' : product.product_comments,
                            'product_status' : product.product_status,
                            'estimated_delivery_time' : product.estimated_delivery_time,
                            'min_delivery_charge' : product.min_delivery_charge,
                            'is_replace_available' : product.is_replace_available
                        };
                        var searchObj = {'category_status' : 'Active'};
                        var sortObj = {'created_at' : -1};
                        MongoUtility.GetWithSearchSort('category', searchObj, sortObj, (err, category_result) => {
                            if(err){
                                console.log(err);
                            }else{
                                if(category_result){
                                    var allcategory = [];
                                    async.forEachSeries(category_result, function (category, next_category) {
                                        var obj = {
                                            '_id' : category._id.toString(),
                                            'category_name' : category.category_name
                                        };
                                        allcategory.push(obj);
                                        next_category();
                                    }, function () {
                                        res.render('pages/veriantproduct_edit',{'data' : arr, 's3_image_url' : process.env.S3_IMAGE_URL, 'categorys' : allcategory, 'ociurl' : process.env.S3_IMAGE_URL});
                                    });
                                }else{
                                    res.render('pages/veriantproduct_edit',{'data' : arr, 's3_image_url' : process.env.S3_IMAGE_URL, 'categorys' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                                }  
                            }
                        });
                    } else {
                        req.flash("error_messages", "Invalid product please try again to edit.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/veriantp';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                }
            });
        }else{
            req.flash("error_messages", "Invalid product please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/veriantp';
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
        var sub_img_arr = [];
        for (var key in obj.subimage) {
            sub_img_arr.push(obj.subimage[key]);
        }
        var date = new Date();
        var timestampforhms = date.getTime();
        var a = new Date(timestampforhms);
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var timestamp = date.getTime().toString();
        var displaydate_input = obj.display_date + ' ' + hour + ':' + min + ':' + sec;
        var newDisplayDate = dateTotimestamp(displaydate_input);
        var product_colors = [];
        if(Array.isArray(obj.product_colors)){
            product_colors = obj.product_colors;
        }else{
            if(obj.product_colors != null && obj.product_colors != undefined && obj.product_colors != ''){
                product_colors.push(obj.product_colors);
            }
        }
        var product_sizes = [];
        if(Array.isArray(obj.product_sizes)){
            product_sizes = obj.product_sizes;
        }else{
            if(obj.product_sizes != null && obj.product_sizes != undefined && obj.product_sizes != ''){
                product_sizes.push(obj.product_sizes);
            }
        }
        var arr = {
            product_name : obj.product_name,
            product_category : obj.product_category,
            product_main_image : obj.product_main_image,
            product_sub_image : sub_img_arr,
            product_description : obj.product_description,
            product_link : obj.product_link,
            product_price_type : obj.product_price_type,
            product_price : Number(obj.product_price),
            product_sales_price : Number(obj.product_sales_price),
            product_profit : Number(obj.product_profit),
            product_source : obj.product_source,
            product_orders : obj.product_orders,
            product_reviews : obj.product_reviews,
            product_rating : obj.product_rating,
            product_type : obj.product_type,
            product_colors : product_colors,
            product_sizes : product_sizes,
            seller_name : obj.seller_name,
            return_policy : obj.return_policy,
            shipment_to : obj.shipment_to,
            products_likes : obj.products_likes ? obj.products_likes : '-',
            products_comments : obj.products_comments ? obj.products_comments : '-',
            products_views : obj.products_views ? obj.products_views : '-',
            display_date : Number(newDisplayDate),
            product_comments : obj.product_comments ? obj.product_comments : '-',
            estimated_delivery_time : obj.estimated_delivery_time_name ? obj.estimated_delivery_time_name : '-',
            min_delivery_charge : obj.min_delivery_charge_name ? obj.min_delivery_charge_name : 0.00,
            is_replace_available : obj.is_replace_available_name,
            product_status : obj.product_status,
            updated_by : req.session.userid,
            updated_at : Number(timestamp)
        };
        var updateObj = {'_id' : new ObjectId(obj.productid)};
        MongoUtility.Update('veriant_products', updateObj, arr, (err, productresult) => {
            if (err) {
                req.flash("error_messages", "Something went wrong, Product can not be updated please try again.");
                req.flash("success_messages", "");
                var goto = appURI + '/veriantp';
                res.writeHead(302, {'Location': goto});
                res.end();
            } else {
                req.flash("error_messages", "");
                req.flash("success_messages", "Product updated successfully...");
                var goto = appURI + '/veriantp';
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
routes.post('/addNew',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var obj = qs.parse(req.body); 
        var queryObj_product_name = {
            "product_name": {
                '$regex': '^' + obj.product_name + '$',
                '$options': 'i'
            }
        };
        MongoUtility.SelectOne('veriant_products', queryObj_product_name, (err, product_result) => {
            if (err) {
                req.flash("error_messages", "Something went wrong, Product can not be added please try again.");
                req.flash("success_messages", "");
                var goto = appURI + '/veriantp';
                res.writeHead(302, {'Location': goto});
                res.end();
            } else {
                if (product_result) {
                    req.flash("error_messages", "Product with same title already exist! Please try again.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/veriantp';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    var sub_img_arr = [];
                    for (var key in obj.subimage) {
                        sub_img_arr.push(obj.subimage[key]);
                    }
                    var date = new Date();
                    var timestampforhms = date.getTime();
                    var a = new Date(timestampforhms);
                    var hour = a.getHours();
                    var min = a.getMinutes();
                    var sec = a.getSeconds();
                    var timestamp = date.getTime().toString();
                    var displaydate_input = obj.display_date + ' ' + hour + ':' + min + ':' + sec;
                    var newDisplayDate = dateTotimestamp(displaydate_input);
                    
                    var b = new Date(newDisplayDate);
                    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    var year = b.getFullYear();
                    var month = months[b.getMonth()];
                    var date = b.getDate();
                    if (date < 10) {
                        date = '0' + date
                    } 
                    var product_colors = [];
                    if(Array.isArray(obj.product_colors)){
                        product_colors = obj.product_colors;
                    }else{
                        if(obj.product_colors != null && obj.product_colors != undefined && obj.product_colors != ''){
                            product_colors.push(obj.product_colors);
                        }
                    }
                    var product_sizes = [];
                    if(Array.isArray(obj.product_sizes)){
                        product_sizes = obj.product_sizes;
                    }else{
                        if(obj.product_sizes != null && obj.product_sizes != undefined && obj.product_sizes != ''){
                            product_sizes.push(obj.product_sizes);
                        }
                    }
                    var arr = {
                        product_name : obj.product_name,
                        product_category : obj.product_category,
                        product_main_image : obj.product_main_image,
                        product_sub_image : sub_img_arr,
                        product_description : obj.product_description,
                        product_link : obj.product_link,
                        product_price_type : obj.product_price_type,
                        product_price : Number(obj.product_price),
                        product_sales_price : Number(obj.product_sales_price),
                        product_profit : Number(obj.product_profit),
                        product_source : obj.product_source,
                        product_orders : obj.product_orders,
                        product_reviews : obj.product_reviews,
                        product_rating : obj.product_rating,
                        product_type : obj.product_type,
                        product_colors : product_colors,
                        product_sizes : product_sizes,
                        seller_name : obj.seller_name,
                        return_policy : obj.return_policy,
                        shipment_to : obj.shipment_to,
                        products_likes : obj.products_likes ? obj.products_likes : '-',
                        products_comments : obj.products_comments ? obj.products_comments : '-',
                        products_views : obj.products_views ? obj.products_views : '-',
                        display_date : Number(newDisplayDate),
                        product_comments : obj.product_comments ? obj.product_comments : '-',
                        estimated_delivery_time : obj.estimated_delivery_time_name ? obj.estimated_delivery_time_name : '-',
                        min_delivery_charge : obj.min_delivery_charge_name ? obj.min_delivery_charge_name : 0.00,
                        is_replace_available : obj.is_replace_available_name,
                        product_status : obj.product_status,
                        created_by : req.session.userid,
                        updated_by : req.session.userid,
                        created_at : Number(timestamp),
                        updated_at : Number(timestamp)
                    };
                    MongoUtility.Insert('veriant_products', arr, (err, productresult) => {
                        if (err) {
                            req.flash("error_messages", "Something went wrong, Product can not be added please try again.");
                            req.flash("success_messages", "");
                            var goto = appURI + '/veriantp';
                            res.writeHead(302, {'Location': goto});
                            res.end();
                        } else {
                            req.flash("error_messages", "");
                            req.flash("success_messages", "Product added successfully...");
                            var goto = appURI + '/veriantp';
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
routes.get('/remove', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.query.id != "" && req.query.id != undefined){
            var queryObj = { '_id': new ObjectId(req.query.id)};
            MongoUtility.Delete('veriant_products', queryObj, (err, product) => {
                if (err) {
                    req.flash("error_messages", "Invalid product please try again to delete.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/veriantp';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    req.flash("error_messages", "");
                    req.flash("success_messages", "Product deleted successfully...");
                    var goto = appURI + '/veriantp';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                }
            });
        }else{
            req.flash("error_messages", "Invalid product please try again to delete.");
            req.flash("success_messages", "");
            var goto = appURI + '/veriantp';
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