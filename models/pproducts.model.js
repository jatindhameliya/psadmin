let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	name:{type: String,require: [true,'Product name can not be empty']},
	category:{type: mongoose.Types.ObjectId,require: [true, 'Product category can not be empty']},
	main_image:{type: String,require: [true, 'Product main image can not be empty']},
	sub_image:[{type: String}],
	description:{type: String,default: ''},
	links:[{key: { type: String },value: { type: String }}],
	price:{type: Number,default: 0},
	sales_price:{type: Number,default: 0},
	profit:{type: Number,default: 0},
	source:{type: mongoose.Types.ObjectId,require: [true, 'Product source can not be empty']},
	orders:{type: String,default: ''},
	reviews: {type: String,default: ''},
	rating: {type: String,default: ''},
	daily_people_reach:{type: String,default: ''},
	conversions:{type: String,default: ''},
	likes:{type: String,default: ''},
	comments:{type: String,default: ''},
	shares:{type: String,default: ''},
	views: {type: String,default: ''},
	reactions:{type: String,default: ''},
	youtube_video:{type: String,default: ''},
	interest:{type: String,default: ''},
	display_date:{type: Number},
	productcomment:{type: String,default: ''},
	status:{type: Boolean,default: true},
	createdBy: {type: mongoose.Types.ObjectId,default: null},
	updatedBy: {type: mongoose.Types.ObjectId,default: null}
}, { timestamps: true, strict: false });
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('top_pproducts', schema);
