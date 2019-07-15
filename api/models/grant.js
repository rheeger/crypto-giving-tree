const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//model
const grantSchema = new Schema({
	id: { type: String, unique: true },
	selectedOrg: String,
	selectedTree: String,
	grantAmount: String,
	grantDescription: String,
	grantDate: { type: Number, default: Date.now, required: true },
	grantApproval: Boolean,
	grantIndex: Number
});

//modelClass
const ModelClass = mongoose.model('grant', grantSchema);

//export
module.exports = ModelClass;
