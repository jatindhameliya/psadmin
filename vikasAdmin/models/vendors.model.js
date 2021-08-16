let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let addressSchema = new mongoose.Schema({
	addressid: { type: mongoose.Schema.ObjectId, auto: true },
	locationname: {
		type: String,
		default: '',
	},
	address: {
		type: String,
		default: '',
	},
	city: {
		type: String,
		default: '',
	},
	pincode: {
		type: String,
		default: '',
	},
	state: {
		type: String,
		default: '',
	},
	district: {
		type: String,
		default: '',
	},
	country: {
		type: String,
		default: '',
	}
}, { _id: false });

let taxesSchema = new mongoose.Schema({
	placetaxid: { type: mongoose.Schema.ObjectId, auto: true },
	placename: {
		type: String,
		default: '',
	},
	gst: {
		type: String,
		default: '',
	}
}, { _id: false });
let schema = new mongoose.Schema({
	company: {
		icon: {
			type: String,
			default: '',
		},
		firstname: {
			type: String,
			default: '',
			require: true
		},
		lastname: {
			type: String,
			default: '',
			require: true
		},
		companyname: {
			type: String,
			default: '',
			require: true
		},
		companyemail: {
			type: String,
			default: '',
			require: true
		},
		companyphone: {
			type: String,
			default: '',
			require: true
		},
		companymobile: {
			type: String,
			default: '',
			require: true
		},
	},
	addresses: [addressSchema],
	bank: {
		accountname: {
			type: String,
			default: '',
		},
		bankname: {
			type: String,
			default: '',
		},
		accountnumber: {
			type: String,
			default: '',
		},
		ifscnumber: {
			type: String,
			default: '',
		},
		bankbranchname: {
			type: String,
			default: '',
		},
		pannumber: {
			type: String,
			default: '',
		},
		bankkey: {
			type: String,
			default: '',
		},
	},
	taxes: [taxesSchema],
	createdBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		default: null
	},
}, { timestamps: true, strict: false });
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('vendors', schema);
