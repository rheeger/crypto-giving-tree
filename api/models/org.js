const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//model
const orgSchema = new Schema({
	id: { type: String, unique: true },
	name: String,
	contractAddress: String,
	lifetimeGrants: String,
	claimed: Boolean,
	claimApprovalDetails: {
		dateApproved: { type: Date, default: null },
		orgAdminWallet: { type: string, default: null },
		claimId: { type: string, default: null },
		transactionHash: { type: String, default: null }
	}
});

//modelClass
const ModelClass = mongoose.model('org', orgSchema);

//export
module.exports = ModelClass;
