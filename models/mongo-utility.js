/*********************************************************** Required Module And Connection Settings ********************************************************/
var Utility = module.exports = {};
var async = require('async');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGO_URI;
var db;
var dbConn;
var ObjectID = require('mongodb').ObjectID;
/*********************************************************** MongoDB Connection Method *********************************************************************/
MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, (err, connDB) => {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        dbConn = connDB;
        db = connDB.db(process.env.DB_NAME);
    }
});
/*********************************************************** MongoDB Insertion Query Method ****************************************************************/
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
/************************************************************** MongoDB Select-One With Option Query Method ************************************************************/
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
/************************************************************** MongoDB Count Document With Option Query Method ********************************************************/
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
/************************************************************** MongoDB Select Multiple With Option Query Method ********************************************************/
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
/***************************************************************************** MongoDB Get Query Method *************************************************************************/
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
Utility.GetWithSort = (collectionName, sortobj, callback) => {
    var collection = db.collection(collectionName);
    collection.find().sort(sortobj).toArray(((err, result) => {
        if (err) {
            return callback(err);
            dbConn.close();
        } else {
            return callback(null, result);
            dbConn.close();
        }
    }));
};
Utility.GetWithSearch = (collectionName, searchObj, callback) => {
    var collection = db.collection(collectionName);
    collection.find(searchObj).toArray(((err, result) => {
        if (err) {
            return callback(err);
            dbConn.close();
        } else {
            return callback(null, result);
            dbConn.close();
        }
    }));
};
Utility.GetWithSearchSort = (collectionName, searchObj, sortobj, callback) => {
    var collection = db.collection(collectionName);
    collection.find(searchObj).sort(sortobj).toArray(((err, result) => {
        if (err) {
            return callback(err);
            dbConn.close();
        } else {
            return callback(null, result);
            dbConn.close();
        }
    }));
};
Utility.GetCount = (collectionName, callback) => {
    var collection = db.collection(collectionName);
    collection.find().count(((err, result) => {
        if (err) {
            return callback(err);
            dbConn.close();
        } else {
            return callback(null, result);
            dbConn.close();
        }
    }));
};
/**************************************************** MongoDB Select Multiple With Options And Sort Query Method ********************************************/
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
/**************************************************** MongoDB Select Multiple With Options And Sort + Limit Query Method ********************************************/
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
/***************************************************************** MongoDB Aggregate Method *******************************************************************/
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
/******************************************************************* MongoDB Update Query Method **************************************************************/
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
/************************************************************************* MongoDB Delete One Method **********************************************************************/
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
 /************************************************************************* MongoDB Delete Multiple on Condition Method *****************************************************/
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


