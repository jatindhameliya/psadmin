let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	roleId: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	permission: [{
		collectionName: {
			type: String,
			default: "",
		},
		insertUpdate: {
			type: Boolean,
			default: true,
		},
		delete: {
			type: Boolean,
			default: true,
		},
		view: {
			type: Boolean,
			default: true,
		},
	}],
	createdBy: {
		type: mongoose.Types.ObjectId,
		default: null,
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		default: null,
	},
	parentId: {
		type: mongoose.Types.ObjectId,
		default: null,
	}
},{ timestamps: true });
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('permissions', schema);
