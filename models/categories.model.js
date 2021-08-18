let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	category_name:{
		type: String,
		default: '',
		require: true
	},
	category_description:{
		type: String,
		default: ''
	},
	category_status:{
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
module.exports = mongoose.model('categories', schema);
