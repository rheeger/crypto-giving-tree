const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//model
const orgSchema = new Schema({
	id: { type: String, unique: true },
	name: String,
	contractAddress: String,
	lifetimeGrants: String,
	claimed: String
});

//modelClass
const ModelClass = mongoose.model('org', orgSchema);

//export
module.exports = ModelClass;
