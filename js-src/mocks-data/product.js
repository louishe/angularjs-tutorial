var mongodb = require('mongodb');
var format = require('util').format;
var Db = mongodb.Db;
var Connection = mongodb.Connection;
var Server = mongodb.Server;
var BSON = mongodb.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('crm', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'crm' database");
        db.collection('products', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'products' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving product: ' + id);
    db.collection('products', function(err, collection) {
        if (err) {

        } else {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                res.send(item);
            });
        }
    });
};

exports.findAll = function(req, res) {
    db.collection('products', function(err, collection) {
        if (err) {
            res.status(500);
            res.end;
        } else {
            collection.find().toArray(function(err, items) {
                res.status(200); 
                res.send(items);
            });
        }
    });
};

exports.addProduct = function(req, res) {
    var product = req.body;
    db.collection('products', function(err, collection) {
        collection.insert(product, {safe: true}, function(err, result) {
            console.log(product);
            if (err) {
                res.status(500);
                res.end();
            } else {
                res.status(201);
                res.set('Location', '/products/' + product._id);
                res.end();
            }
        });
    });
}

//exports.updateWine = function(req, res) {
    //var id = req.params.id;
//}
