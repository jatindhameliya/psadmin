var Utility = module.exports = {};
var async = require('async');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGODB_URI;
var db;
var dbConn;
var ObjectID = require('mongodb').ObjectID;
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, connDB) => {
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		dbConn = connDB;
		db = connDB.db(process.env.MONGODB);
	}
});
Utility.Insert = (collectionName, data, callback) => {
	var collection = db.collection(collectionName);
	async.forEach(data, function (key, callbackloopInner) {
		callbackloopInner(null);
	}, (loopErr) => {
		collection.insertMany([data], function (err, result) {
			if (err) {
				return callback(err);
				dbConn.close();
			} else {
				return callback(null, result);
				dbConn.close();
			}
		});
	});
};
Utility.SelectOne = (collectionName, queryObject, callback) => {
	var collection = db.collection(collectionName);
	collection.findOne(queryObject, ((err, cursor) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, cursor);
			dbConn.close();
		}
	}));
};
Utility.Select = (collectionName, queryObject, callback) => {
	var collection = db.collection(collectionName);
	collection.find(queryObject).toArray(((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.SelectSort = (collectionName, queryObject, sortobj, callback) => {
	var collection = db.collection(collectionName);
	collection.find(queryObject).sort(sortobj).toArray(((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.SelectSortLimit = (collectionName, queryObject, sortobj, lmt, callback) => {
	var collection = db.collection(collectionName);
	collection.find(queryObject).sort(sortobj).limit(lmt).toArray(((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.SelectWithSearchSortLmtSkip = (collectionName, queryObject, sortobj, lmt, skip, callback) => {
	var collection = db.collection(collectionName);
	collection.find(queryObject).sort(sortobj).limit(lmt).skip(skip).toArray(((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.Count = (collectionName, queryObject, callback) => {
	var collection = db.collection(collectionName);
	collection.find(queryObject).count(((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.Get = (collectionName, callback) => {
	var collection = db.collection(collectionName);
	collection.find().toArray(((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.Aggregate = (collectionName, queryObject, callback) => {
	var collection = db.collection(collectionName);
	collection.aggregate(queryObject, ((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.Update = (collectionName, queryObject, updateData, callback) => {
	var collection = db.collection(collectionName);
	collection.updateMany(queryObject, { $set: updateData }, ((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.UpdateWithPush = (collectionName, queryObject, updateData, callback) => {
	var collection = db.collection(collectionName);
	collection.updateMany(queryObject, { $push: updateData }, ((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.Delete = (collectionName, queryObject, callback) => {
	var collection = db.collection(collectionName);
	collection.deleteOne(queryObject, ((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};
Utility.DeleteMany = (collectionName, queryObject, callback) => {
	var collection = db.collection(collectionName);
	collection.deleteMany(queryObject, ((err, result) => {
		if (err) {
			return callback(err);
			dbConn.close();
		} else {
			return callback(null, result);
			dbConn.close();
		}
	}));
};



