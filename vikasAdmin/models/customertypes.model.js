let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	customertype: {
		type: String,
		default: '',
		require: true
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: 'adminusers',
		default: null
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		ref: 'adminusers',
		default: null
	},
	status: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('customertypes', schema);
