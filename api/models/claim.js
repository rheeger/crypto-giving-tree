const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//model
const claimSchema = new Schema({
	id: { type: String },
	selectedOrg: String,
	orgAdminWallet: String,
	orgAdminFirstName: String,
	orgAdminLastName: String,
	orgAdminEmail: String,
	orgAdminAddress: String,
	orgAdminCity: String,
	orgAdminState: String,
	orgAdminZip: Number,
	claimIndex: Number,
	claimDate: { type: Date, default: Date.now, required: true },
	claimApprovalDetails: {}
});

//modelClass
const ModelClass = mongoose.model('claim', claimSchema);

//export
module.exports = ModelClass;
