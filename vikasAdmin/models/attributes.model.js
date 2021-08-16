let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	attributename: {
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
module.exports = mongoose.model('attributes', schema);
