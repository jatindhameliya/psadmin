let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({}, {strict: false});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('common_products', schema);
