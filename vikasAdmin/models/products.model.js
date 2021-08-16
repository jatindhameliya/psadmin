let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let attributeSchema = new mongoose.Schema({
	attributeid: { type: mongoose.Schema.ObjectId, auto: true },
	attributevalue: {
		type: String,
		default: '',
	},
	attributeimg: {
		type: String,
		default: '',
	}
}, { _id: false });
let schema = new mongoose.Schema({
	parent_vendor: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	productreferenceID:{
		type: String,
		default: '',
		require: true
	},
	productname:{
		type: String,
		default: '',
		require: true
	},
	productcategory: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	producthsncode:{
		type: String,
		default: '',
		require: true
	},
	productsku:{
		type: String,
		default: '',
		require: true
	},
	producttags:[],
	productprice: {
		type: Number,
		default: 0.00
	},
	productmrp: {
		type: Number,
		default: 0.00
	},
	productdescription:{
		type: String,
		default: '',
		require: true
	},
	attributes: [attributeSchema],
	productImages:[],
	status:{
		type: Boolean,
		default: false
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
},{ timestamps: true, strict: false});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('products', schema);
