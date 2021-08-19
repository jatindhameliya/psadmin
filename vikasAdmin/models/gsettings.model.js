let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	overallmarkup: {
		type: Number,
		trim: true,
		required: true,
		min: [0, 'cannot be less than 0'],
		max: [100, 'cannot be greater than 100'],
	},
	linkbasemarkup: {
		type: Number,
		trim: true,
		required: true,
		min: [0,'cannot be less than 0'],
		max: [100,'cannot be greater than 100'],
	},
	overalldiscount: {
		type: Number,
		trim: true,
		required: true,
		min: [0, 'cannot be less than 0'],
		max: [100, 'cannot be greater than 100'],
	},
	linkbasediscount: {
		type: Number,
		trim: true,
		required: true,
		min: [0, 'cannot be less than 0'],
		max: [100, 'cannot be greater than 100'],
	}
}, {
	timestamps: true,
	strict: false
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('gsettings', schema);
