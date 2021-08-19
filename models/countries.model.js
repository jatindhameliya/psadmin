let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	code:{
		type: String,
		require: true
	},
	currency: {
		type: String,
		require: true
	},
	currency_symbole:{
		type: String,
		require: true
	},
	rate:{
		type: Number,
		require: true
	},
	status:{
		type:Boolean,
		default:true,
		require: true
	},
	flag:{
		type: String,
		require: true
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
module.exports = mongoose.model('countries', schema);
