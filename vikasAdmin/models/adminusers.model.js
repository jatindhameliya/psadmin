let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	username: {
		type: String,
		default: '',
		require: true
	},
	email: {
		type: String,
		default: '',
		require: true
	},
	password: {
		type: String,
		default: '',
		require: true
	},
	name: {
		type: String,
		default: '',
		require: true
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	status: {
		type: Boolean,
		default: false
	}
},{
	timestamps: true,
	strict: false
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('adminusers', schema);
