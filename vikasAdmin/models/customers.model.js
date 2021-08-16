let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let addressSchema = new mongoose.Schema({
	addressid: { type: mongoose.Schema.ObjectId, auto: true },
	locationname: {
		type: String,
		trim: true,
		required: true
	},
	address: {
		type: String,
		trim: true,
		required: true
	},
	city: {
		type: String,
		trim: true,
		required: true
	},
	pincode: {
		type: String,
		trim: true,
		minlength: 6,
		maxlength: 6,
		required: true
	},
	state: {
		type: String,
		trim: true,
		required: true
	},
	district: {
		type: String,
		trim: true,
		required: true
	},
	country: {
		type: String,
		trim: true,
		required: true
	}
}, { _id: false });
let taxesSchema = new mongoose.Schema({
	placetaxid: { type: mongoose.Schema.ObjectId, auto: true },
	placename: {
		type: String,
		trim: true,
		required: true
	},
	gst: {
		type: String,
		trim: true,
		required: true,
		minlength: 15,
		maxlength: 15,
	}
}, { _id: false });
let categorymarkupSchema = new mongoose.Schema({
	categoryid: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	markup: {
		type: Number,
		trim: true,
		required: true,
		min: 0,
		max: 100,
	}
});
let categorydiscountSchema = new mongoose.Schema({
	categoryid: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	discount: {
		type: Number,
		trim: true,
		required: true,
		min: 0,
		max: 100,
	}
});

let schema = new mongoose.Schema({
	companyname: {
		type: String,
		trim: true,
		required: true,
	},
	customertype:{
		type: mongoose.Types.ObjectId,
		required: true
	},
	icon:{
		type: String,
		default: '',
	},
	status: {
		type: Boolean,
		default: true
	},
	parent:{
		type: mongoose.Types.ObjectId,
		default: null
	},
	phone: {
		type: String,
		default: ''
	},
	isbypass:{
		type: Boolean,
		default: false
	},
	addresses: [addressSchema],
	taxes: [taxesSchema],
	createdBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	overallmarkup:{
		type: Number,
		trim: true,
		required: true,
		min: 0,
		max: 100,
	},
	linkbasemarkup:{
		type: Number,
		trim: true,
		required: true,
		min: 0,
		max: 100,
	},
	overalldiscount: {
		type: Number,
		trim: true,
		required: true,
		min: 0,
		max: 100,
	},
	linkbasediscount: {
		type: Number,
		trim: true,
		required: true,
		min: 0,
		max: 100,
	},
	categorymarkup: [categorymarkupSchema],
	categorydiscount: [categorydiscountSchema],
	raferalcode:{
		type: String,
		trim: true,
		required: true,
	}
}, { timestamps: true, strict: false });
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('customers', schema);
