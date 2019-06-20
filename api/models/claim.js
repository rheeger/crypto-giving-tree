const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//model
const claimSchema = new Schema({
	id: { type: String, unique: true },
	selectedOrg: String,
	selectedTree: String,
	claimAmount: String,
	claimDescription: String,
	claimDate: String,
	claimApproval: String,
	claimIndex: String,
	approvalDetails: { approvalId: { type: String, unique: true }, approvalDate: String }
});

//modelClass
const ModelClass = mongoose.model('claim', claimSchema);

//export
module.exports = ModelClass;
