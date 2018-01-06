var MongoClient = require('mongodb').MongoClient, assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/';
var collectionName = 'npl';

class Bean{
	constructor(instance, vars){
		//this.mappingFile = mappingFile;
		this._id = -1;
		this.instance = instance;
		this._className = "";
		this.vars = vars;

		this.values = [];
		for(let instValue in this.instance){
			this.values[instValue] = this.instance['' + instValue];
		}
	}

	saveMongo(){
		var that = this;

		// Use connect method to connect to the server
		MongoClient.connect(url + collectionName, function(err, db) {
		  console.log("Connected successfully to server");

		  	if(that._id != -1){
			  that.findMongo(db, function(obj){
			  	if(obj == null){
			  		console.log("insert");
			  		that.insertMongo(db, function(){});
			  	}
			  	else{
			  		console.log("modify");
			  		that.modifyMongo(db, function(){});
			  	}
			  })
			}
			else{
				console.log("insert first time");
				that.insertMongo(db, function(){});
			}
		});
	}

	findMongo(db, callback){
		var that = this;

		// Get the documents collection
		var collection = db.collection(collectionName);
		// Find some documents
		collection.find({'_id': that._id}).toArray(function(err, docs) {
			callback(docs);
		});
	}

	insertMongo(db, callback) {
		var that = this;

		// Get the documents collection
		var collection = db.collection(collectionName);

		var data = {};
		data._className = that._className;
		//console.log(that.vars);
		for(var i = 0; i < that.vars.length; i++){
			var varName = that.vars[i];
			var varValue = that.values[varName];
			data[varName] = varValue;
		}
		//console.log(data);
		//data.push(that.vars);

		// Insert some documents
		collection.insert([
			data
		], function(err, result){
			that._id = data._id;
			callback(result);
		});
	}

	modifyMongo(db, callback){
		var that = this;

		var collection = db.collection(collectionName);
		
		var data = {};
		for(var i = 0; i < that.vars.length; i++){
			var varName = that.vars[i];
			var varValue = that.values[varName];
			data[varName] = varValue;
		}
		console.log(data);

		collection.updateOne({ '_id' : that._id }, data, function(err, result) {
			callback(result);
		});
	}

	deleteMongo(db, callback){
		var that = this;

		// Get the documents collection
		var collection = db.collection(collectionName);
		// Delete document where a is 3
		collection.deleteOne({ '_id': that._id }, function(err, result) {
			callback(result);
		});
	}
}

module.exports = {
	Bean
}