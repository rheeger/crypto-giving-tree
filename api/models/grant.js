const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//model
const grantSchema = new Schema({
	id: { type: String, unique: true },
	selectedOrg: String,
	selectedTree: String,
	grantAmount: String,
	grantDescription: String,
	grantDate: String,
	grantApproval: String,
	grantIndex: String,
	approvalDetails: { approvalId: { type: String, unique: true }, approvalDate: String }
});

//modelClass
const ModelClass = mongoose.model('grant', grantSchema);

//export
module.exports = ModelClass;
