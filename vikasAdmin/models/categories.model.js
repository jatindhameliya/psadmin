let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	categoryname : {
		type: String,
		default: '',
		require: true
	},
	description : {
		type: String,
		default: ''
	},
	parentcategory : {
		type: mongoose.Types.ObjectId,
		default: null
	},
	status : {
		type: Boolean,
		default: true
	},
	isfinalcategory:{
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
	}
},{ timestamps: true });
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('categories', schema);
