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
        MongoUtility.GetWithSort('supplier', sortObj, (err, supplier_result) => {
            if(err){
                console.log(err);
            }else{
                if(supplier_result){
                    var allsupplier = [];
                    async.forEachSeries(supplier_result, function (supplier, next_supplier) {
                        var obj = {
                            '_id' : supplier._id.toString(),
                            'supplier_name' : supplier.supplier_name,
                            'supplier_category' : supplier.supplier_category,
                            'supplier_email' : supplier.supplier_email,
                            'supplier_phone' : supplier.supplier_phone,
                            'supplier_country' : supplier.supplier_country,
                            'supplier_status' : supplier.supplier_status,
                            'supplier_website' : supplier.supplier_website,
                            'created_at' : timestampTodate(supplier.created_at),
                            'updated_at' : timestampTodate(supplier.updated_at)
                        };
                        allsupplier.push(obj);
                        next_supplier();
                    }, function () {
                        res.render('pages/supplier_list',{'suppliers' : allsupplier, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/supplier_list',{'suppliers' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                }  
            }
        });
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.get('/create', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var sortOrd = {'order' : 1};
        MongoUtility.GetWithSort('supplier_category', sortOrd, (err, scategory) => {
            if(scategory){
                var allscategory = [];
                async.forEachSeries(scategory, function (category, next_category) {
                    var obj = {
                        '_id' : category._id.toString(),
                        'display_name' : category.display_name,
                    };
                    allscategory.push(obj);
                    next_category();
                }, function () {
                    res.render('pages/supplier_create',{'s3_image_url' : process.env.S3_IMAGE_URL, 'categories' : allscategory, 'ociurl' : process.env.S3_IMAGE_URL});
                });
            }else{
                res.render('pages/supplier_create',{'s3_image_url' : process.env.S3_IMAGE_URL, 'categories' : [], 'ociurl' : process.env.S3_IMAGE_URL});
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
            MongoUtility.SelectOne('supplier', queryObj, (err, supplier) => {
                if (err) {
                    req.flash("error_messages", "Invalid supplier please try again to edit.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/supplier';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    if (supplier) {
                        var arr = {
                            '_id' : supplier._id.toString(),
                            'supplier_shop' : supplier.supplier_shop,
                            'supplier_name' : supplier.supplier_name,
                            'supplier_website' : supplier.supplier_website,
                            'supplier_image' : supplier.supplier_image,
                            'supplier_description' : supplier.supplier_description,
                            'supplier_category' : supplier.supplier_category,
                            'supplier_email' : supplier.supplier_email,
                            'supplier_phone' : supplier.supplier_phone,
                            'supplier_country' : supplier.supplier_country,
                            'supplier_state' : supplier.supplier_state,
                            'supplier_status' : supplier.supplier_status,
                            'created_at' : timestampTodate(supplier.created_at),
                            'updated_at' : timestampTodate(supplier.updated_at)
                        };
                        
                        var sortOrd = {'order' : 1};
                        MongoUtility.GetWithSort('supplier_category', sortOrd, (err, scategory) => {
                            if(scategory){
                                var allscategory = [];
                                async.forEachSeries(scategory, function (category, next_category) {
                                    var obj = {
                                        '_id' : category._id.toString(),
                                        'display_name' : category.display_name,
                                    };
                                    allscategory.push(obj);
                                    next_category();
                                }, function () {
                                    var productQuery = {'product_supplier' : req.query.id};
                                    var sortObj = {'created_at' : -1};
                                    MongoUtility.SelectSort('supplier_products', productQuery, sortObj, (err, product_result) => {
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
                                                        'created_at' : timestampTodate(product.created_at)
                                                    };
                                                    allproduct.push(obj);
                                                    next_product();
                                                }, function () {
                                                    res.render('pages/supplier_edit', {'data' : arr,'s3_image_url' : process.env.S3_IMAGE_URL,'products' : allproduct,'categories' : allscategory, 'ociurl' : process.env.S3_IMAGE_URL});
                                                });
                                            }else{
                                                res.render('pages/supplier_edit', {'data' : arr,'s3_image_url' : process.env.S3_IMAGE_URL,'products' : [],'categories' : allscategory, 'ociurl' : process.env.S3_IMAGE_URL});
                                            }  
                                        }
                                    });
                                });
                            }else{
                                var productQuery = {'product_supplier' : req.query.id};
                                var sortObj = {'created_at' : -1};
                                MongoUtility.SelectSort('supplier_products', productQuery, sortObj, (err, product_result) => {
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
                                                    'created_at' : timestampTodate(product.created_at)
                                                };
                                                allproduct.push(obj);
                                                next_product();
                                            }, function () {
                                                res.render('pages/supplier_edit', {'data' : arr,'s3_image_url' : process.env.S3_IMAGE_URL,'products' : allproduct,'categories' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                                            });
                                        }else{
                                            res.render('pages/supplier_edit', {'data' : arr,'s3_image_url' : process.env.S3_IMAGE_URL,'products' : [],'categories' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                                        }  
                                    }
                                });
                            } 
                        });
                    } else {
                        req.flash("error_messages", "Invalid supplier please try again to edit.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/supplier';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                }
            });
        }else{
            req.flash("error_messages", "Invalid supplier please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/supplier';
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
        if(req.body.supplierid != "" && req.body.supplierid != undefined){
            var obj = qs.parse(req.body); 
            var date = new Date();
            var timestamp_my = date.getTime().toString();
            var arr = {
                supplier_shop : obj.supplier_shop ? obj.supplier_shop : '--',
                supplier_name : obj.supplier_name,
                supplier_website : obj.supplier_website,
                supplier_image : obj.supplier_image,
                supplier_description : obj.supplier_description,
                supplier_category : obj.supplier_category,
                supplier_email : obj.supplier_email,
                supplier_phone : obj.supplier_phone,
                supplier_country : obj.supplier_country,
                supplier_state : obj.supplier_state,
                supplier_status : obj.supplier_status,
                updated_at : Number(timestamp_my)
            };
            var queryObj = {'_id' : new ObjectId(req.body.supplierid)};
            MongoUtility.Update('supplier', queryObj, arr, (err, updated_result) => {
                if(err){
                    console.log(err);
                }else{
                    req.flash("error_messages", "");
                    req.flash("success_messages", "Supplier Updated Successfully...");
                    var goto = appURI + '/supplier';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                }
            });
        }else{
            req.flash("error_messages", "Supplier Can Not Update Try Again...");
            req.flash("success_messages", "");
            var goto = appURI + '/supplier';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/addNew', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var obj = qs.parse(req.body); 
        var queryObj_supplier_name = {
            "supplier_name": {
                '$regex': '^' + obj.supplier_name + '$',
                '$options': 'i'
            }
        };
        MongoUtility.SelectOne('supplier', queryObj_supplier_name, (err, supplier_result) => {
            if (err) {
                req.flash("error_messages", "Something went wrong, Supplier can not be added please try again.");
                req.flash("success_messages", "");
                var goto = appURI + '/supplier';
                res.writeHead(302, {'Location': goto});
                res.end();
            } else {
                if (supplier_result) {
                    req.flash("error_messages", "Supplier with same name already exist! Please try again.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/supplier';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    var date = new Date();
                    var timestamp = date.getTime().toString();
                    var arr = {
                        supplier_shop : obj.supplier_shop ? obj.supplier_shop : '--',
                        supplier_name : obj.supplier_name,
                        supplier_website : obj.supplier_website,
                        supplier_image : obj.supplier_image,
                        supplier_description : obj.supplier_description,
                        supplier_category : obj.supplier_category,
                        supplier_email : obj.supplier_email,
                        supplier_phone : obj.supplier_phone,
                        supplier_country : obj.supplier_country,
                        supplier_state : obj.supplier_state,
                        supplier_status : obj.supplier_status,
                        created_at : Number(timestamp),
                        updated_at : Number(timestamp)
                    };
                    MongoUtility.Insert('supplier', arr, (err, supplierresult) => {
                        if (err) {
                            req.flash("error_messages", "Something went wrong, Supplier can not be added please try again.");
                            req.flash("success_messages", "");
                            var goto = appURI + '/supplier';
                            res.writeHead(302, {'Location': goto});
                            res.end();
                        } else {
                            req.flash("error_messages", "");
                            req.flash("success_messages", "Supplier added successfully...");
                            var goto = appURI + '/supplier';
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
            var queryObj = { 'product_supplier': req.query.id};
            MongoUtility.DeleteMany('supplier_products', queryObj, (err, productremoved) => {
                var supplierObjQuery = {'_id' : new ObjectId(req.query.id)};
                MongoUtility.Delete('supplier', supplierObjQuery, (err, supresult) => {
                    if (err) {
                        req.flash("error_messages", "Invalid supplier please try again to delete.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/supplier';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    } else {
                        req.flash("error_messages", "");
                        req.flash("success_messages", "Supplier deleted successfully...");
                        var goto = appURI + '/supplier';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                });
            });
        }else{
            req.flash("error_messages", "Invalid supplier please try again to delete.");
            req.flash("success_messages", "");
            var goto = appURI + '/supplier';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.get('/createProduct',(req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var supid = '';
        if(req.query.id != '' && req.query.id != undefined){
            supid = req.query.id;
        }
        var supplierQuery = {'supplier_status' : 'Approved'};
        var sortObj = {'created_at' : -1};
        MongoUtility.SelectSort('supplier', supplierQuery, sortObj, (err, supplier_result) => {
            if(err){
                console.log(err);
            }else{
                if(supplier_result){
                    var allsupplier = [];
                    async.forEachSeries(supplier_result, function (supplier, next_supplier) {
                        var obj = {
                            '_id' : supplier._id.toString(),
                            'supplier_name' : supplier.supplier_name,
                        };
                        allsupplier.push(obj);
                        next_supplier();
                    }, function () {
                        res.render('pages/supplier_product_create',{'s3_image_url' : process.env.S3_IMAGE_URL, 'suppliers' : allsupplier, 'selectedid' : supid, 'ociurl' : process.env.S3_IMAGE_URL});
                    });
                }else{
                    res.render('pages/supplier_product_create',{'s3_image_url' : process.env.S3_IMAGE_URL, 'suppliers' : [], 'selectedid' : supid, 'ociurl' : process.env.S3_IMAGE_URL});
                } 
            }
        });  
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.get('/editProduct', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.query.id != "" && req.query.id != undefined){
            var queryObj = { '_id': new ObjectId(req.query.id)};
            MongoUtility.SelectOne('supplier_products', queryObj, (err, product) => {
                if (err) {
                    req.flash("error_messages", "Invalid product please try again to edit.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/supplier';
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
                            'product_supplier' : product.product_supplier,
                            'product_main_image' : product.product_main_image,
                            'product_sub_image' : product.product_sub_image,
                            'product_description' : product.product_description,
                            'product_sales_price' : product.product_sales_price,
                            'product_colors' : product_colors,
                            'product_sizes' : product_sizes,
                        };
                        var supplierQuery = {'supplier_status' : 'Approved'};
                        var sortObj = {'created_at' : -1};
                        MongoUtility.SelectSort('supplier', supplierQuery, sortObj, (err, supplier_result) => {
                            if(err){
                                console.log(err);
                            }else{
                                if(supplier_result){
                                    var allsupplier = [];
                                    async.forEachSeries(supplier_result, function (supplier, next_supplier) {
                                        var obj = {
                                            '_id' : supplier._id.toString(),
                                            'supplier_name' : supplier.supplier_name,
                                        };
                                        allsupplier.push(obj);
                                        next_supplier();
                                    }, function () {
                                        res.render('pages/supplier_product_edit',{'data' : arr, 's3_image_url' : process.env.S3_IMAGE_URL, 'suppliers' : allsupplier, 'ociurl' : process.env.S3_IMAGE_URL});
                                    });
                                }else{
                                    res.render('pages/supplier_product_edit',{'data' : arr, 's3_image_url' : process.env.S3_IMAGE_URL, 'suppliers' : [], 'ociurl' : process.env.S3_IMAGE_URL});
                                } 
                            }
                        });  
                    } else {
                        req.flash("error_messages", "Invalid product please try again to edit.");
                        req.flash("success_messages", "");
                        var goto = appURI + '/supplier';
                        res.writeHead(302, {'Location': goto});
                        res.end();
                    }
                }
            });
        }else{
            req.flash("error_messages", "Invalid product please try again to edit.");
            req.flash("success_messages", "");
            var goto = appURI + '/supplier';
            res.writeHead(302, {'Location': goto});
            res.end();
        }
    }else{
        var goto = appURI;
        res.writeHead(302, {'Location' : goto});
        res.end();
    }
});
routes.post('/addNewProduct', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var obj = qs.parse(req.body); 
        var queryObj_product_name = {
            "product_name": {
                '$regex': '^' + obj.product_name + '$',
                '$options': 'i'
            },
            "product_supplier" : obj.product_supplier
        };
        MongoUtility.SelectOne('supplier_products', queryObj_product_name, (err, product_result) => {
            if (err) {
                req.flash("error_messages", "Something went wrong, Product can not be added please try again.");
                req.flash("success_messages", "");
                var goto = appURI + '/supplier';
                res.writeHead(302, {'Location': goto});
                res.end();
            } else {
                if (product_result) {
                    req.flash("error_messages", "Product with same title already exist! Please try again.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/supplier';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    var sub_img_arr = [];
                    for (var key in obj.subimage) {
                        sub_img_arr.push(obj.subimage[key]);
                    }
                    var date = new Date();
                    var timestamp = date.getTime().toString();
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
                        product_supplier : obj.product_supplier,
                        product_main_image : obj.product_main_image,
                        product_sub_image : sub_img_arr,
                        product_description : obj.product_description,
                        product_sales_price : Number(obj.product_sales_price),
                        product_colors : product_colors,
                        product_sizes : product_sizes,
                        created_at : Number(timestamp),
                        updated_at : Number(timestamp)
                    };
                    MongoUtility.Insert('supplier_products', arr, (err, productresult) => {
                        if (err) {
                            req.flash("error_messages", "Something went wrong, Product can not be added please try again.");
                            req.flash("success_messages", "");
                            var goto = appURI + '/supplier';
                            res.writeHead(302, {'Location': goto});
                            res.end();
                        } else {
                            req.flash("error_messages", "");
                            req.flash("success_messages", "Product added successfully...");
                            var goto = appURI + '/supplier';
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
routes.post('/updateProduct', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        var obj = qs.parse(req.body); 
        var sub_img_arr = [];
        for (var key in obj.subimage) {
            sub_img_arr.push(obj.subimage[key]);
        }
        var date = new Date();
        var timestamp = date.getTime().toString();
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
            product_supplier : obj.product_supplier,
            product_main_image : obj.product_main_image,
            product_sub_image : sub_img_arr,
            product_description : obj.product_description,
            product_sales_price : Number(obj.product_sales_price),
            product_colors : product_colors,
            product_sizes : product_sizes,
            updated_at : Number(timestamp)
        };
        var updateObj = {'_id' : new ObjectId(obj.productid)};
        MongoUtility.Update('supplier_products', updateObj, arr, (err, productresult) => {
            if (err) {
                req.flash("error_messages", "Something went wrong, Product can not be updated please try again.");
                req.flash("success_messages", "");
                var goto = appURI + '/supplier';
                res.writeHead(302, {'Location': goto});
                res.end();
            } else {
                req.flash("error_messages", "");
                req.flash("success_messages", "Product updated successfully...");
                var goto = appURI + '/supplier';
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
routes.get('/removeProduct', (req, res) => {
    if(req.session.userid != "" && req.session.userid != undefined){
        if(req.query.id != "" && req.query.id != undefined){
            var queryObj = { '_id': new ObjectId(req.query.id)};
            MongoUtility.Delete('supplier_products', queryObj, (err, product) => {
                if (err) {
                    req.flash("error_messages", "Invalid product please try again to delete.");
                    req.flash("success_messages", "");
                    var goto = appURI + '/supplier';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                } else {
                    req.flash("error_messages", "");
                    req.flash("success_messages", "Product deleted successfully...");
                    var goto = appURI + '/supplier';
                    res.writeHead(302, {'Location': goto});
                    res.end();
                }
            });
        }else{
            req.flash("error_messages", "Invalid product please try again to delete.");
            req.flash("success_messages", "");
            var goto = appURI + '/supplier';
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