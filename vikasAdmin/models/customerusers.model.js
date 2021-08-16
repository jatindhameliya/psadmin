let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	firstname: {
		type: String,
		trim: true,
		required: true,
	},
	lastname: {
		type: String,
		trim: true,
		required: true,
	},
	mobile:{
		type: String,
		trim: true,
		required: true,
		minlength: 10,
		maxlength: 10
	},
	email:{
		type: String,
		trim: true,
		required: true
	},
	status: {
		type: Boolean,
		default: true
	},
	parent_customer: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	permission:{
		purchase:{
			type: Boolean,
			default: false
		},
		customers:{
			type: Boolean,
			default: false
		},
		orders:{
			type: Boolean,
			default: false
		}
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
module.exports = mongoose.model('customerusers', schema);
