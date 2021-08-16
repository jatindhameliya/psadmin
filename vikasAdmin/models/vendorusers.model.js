let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	name: {
		type: String,
		default: '',
		require: true
	},
	email: {
		type: String,
		default: '',
		require: true
	},
	phone: {
		type: String,
		default: '',
		require: true
	},
	profile:{
		type: String,
		default: ''
	},
	roleid: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	password: {
		type: String,
		default: '',
	},
	status: {
		type: Boolean,
		default: true
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
module.exports = mongoose.model('vendorusers', schema);
