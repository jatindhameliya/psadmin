const dotenv = require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var fileSystem = require('fs');
let mongoose = require("mongoose");
var expressLayouts = require('express-ejs-layouts');
const port = process.env.PORT || 3005;
var app = express();
app.use(session({ secret: 'gadminshhh', saveUninitialized: true, resave: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/angular", express.static(__dirname + "/node_modules/angular"));
app.use("/ngdropzone", express.static(__dirname + "/node_modules/ngdropzone/dist"));
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});
mongoose.connection.once('open', () => {
	console.log("Well done! , connected with mongoDB database");
}).on('error', error => {
	console.log("Oops! database connection error:" + error);
});
const paths = [
	{ pathUrl: '/', routeFile: 'login' },
// 	{ pathUrl: '/main', routeFile: 'main' },
// 	{ pathUrl: '/category', routeFile: 'category' },
// 	{ pathUrl: '/product', routeFile: 'product' },
// 	{ pathUrl: '/order', routeFile: 'order' },
// 	{ pathUrl: '/store', routeFile: 'store' },
// 	{ pathUrl: '/awsupload', routeFile: 'awsupload' },
// 	{ pathUrl: '/influencer', routeFile: 'influencer' },
// 	{ pathUrl: '/supplier', routeFile: 'supplier' },
// 	{ pathUrl: '/country', routeFile: 'country' },
// 	{ pathUrl: '/support', routeFile: 'support' },
// 	{ pathUrl: '/specialp', routeFile: 'specialp' },
// 	{ pathUrl: '/trendingp', routeFile: 'trendingp' },
// 	{ pathUrl: '/veriantp', routeFile: 'veriantp' }
];
paths.forEach((path) => {
	app.use(path.pathUrl, require('./routes/' + path.routeFile));
});
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
	res.render('error', { layout: false});
});
module.exports = app;
