let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	slabname: {
		type: String,
		default: '',
		require: true
	},
	minamount: {
		type: Number,
		default: 0,
		require: true
	},
	maxamount: {
		type: Number,
		default: 0,
		require: true
	},
	percentage: {
		type: Number,
		default: 0,
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
}, {
	timestamps: true,
	strict: false
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('gsts', schema);
