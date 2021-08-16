let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let productSchema = new mongoose.Schema({
	productid: { type: mongoose.Schema.ObjectId, default: null },
	qty: {
		type: Number,
		default: 0,
	}
}, { _id: false });
let schema = new mongoose.Schema({
	category: {
		type: mongoose.Types.ObjectId,
		require: true
	},
	setname: {
		type: String,
		default: '',
		require: true
	},
	discounttype: {
		type: String,
		default: '',
	},
	discountpercentage: {
		type: Number,
		default: 0,
	},
	discountamount: {
		type: Number,
		default: 0,
	},
	status: {
		type: Boolean,
		default: false
	},
	products: [productSchema],
	totalqty: {
		type: Number,
		default: 0,
	},
	parent_vendor: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		default: null
	}
}, { timestamps: true, strict: false });
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('productsets', schema);
