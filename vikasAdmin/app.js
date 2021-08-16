const dotenv = require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sizeOf = require('image-size');
var multer = require('multer');
var path = require('path');
let mongoose = require("mongoose");
var expressLayouts = require('express-ejs-layouts');
var app = express();
app.use(session({ resave: true, saveUninitialized: true, secret: 'VIKASSESSRANDOMSSS', cookie: { maxAge: 8 * 60 * 60 * 1000 } }));
app.use(flash());
app.use(function (req, res, next) {
	res.locals.success_messages = req.flash('success_messages');
	res.locals.error_messages = req.flash('error_messages');
	res.locals.additional_charge = req.flash('additional_charge');
	next();
});
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
mongoose.connect(process.env.MONGODB_URI, {
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
	{ pathUrl: '/', routeFile: 'index' },
	{ pathUrl: '/login', routeFile: 'login' },
	{ pathUrl: '/dashboard', routeFile: 'dashboard' },
	{ pathUrl: '/users', routeFile: 'users'},
	{ pathUrl: '/adminroles', routeFile: 'adminroles'},
	{ pathUrl: '/permissions', routeFile: 'permissions'},
	{ pathUrl: '/products', routeFile: 'products' },
	{ pathUrl: '/productset', routeFile: 'productset' },
	{ pathUrl: '/categories', routeFile: 'categories' },
	{ pathUrl: '/customers', routeFile: 'customers' },
	{ pathUrl: '/attributes', routeFile: 'attributes'},
	{ pathUrl: '/tags', routeFile: 'tags' },
	{ pathUrl: '/vendors', routeFile: 'vendors' },
	{ pathUrl: '/upload', routeFile: 'upload'},
	{ pathUrl: '/gst', routeFile: 'gst'}
];
paths.forEach((path) => {
	app.use(path.pathUrl, require('./routes/' + path.routeFile));
});
const apispaths = [
	{ pathUrl: '/', routeFile: 'login' },
	{ pathUrl: '/register', routeFile: 'register' },
	{ pathUrl: '/categories', routeFile: 'categories' },
];
apispaths.forEach((path) => {
	app.use('/apis/v1' + path.pathUrl, require('./routes/apis/v1/' + path.routeFile));
});


app.use(function(req, res, next) {
  next(createError(404));
});

app.post('/tallydata', (req, res, next) => {
	console.log(req);
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
	res.render('error', { layout: false, title: '404'});
});

app.use('/testrepo', (req, res) => {

});
module.exports = app;
