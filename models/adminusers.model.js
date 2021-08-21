let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	username: {
		type: String,
		require: true
	},
	password: {
		type: String,
		default: ''
	},
	role: {
		type: String,
		require: true
	},
	name:{
		type: String,
		require: true
	},
	status:{
		type: Boolean,
		default: true
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
module.exports = mongoose.model('adminusers', schema);
