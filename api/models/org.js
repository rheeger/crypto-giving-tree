const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//model
const orgSchema = new Schema({
  id: { type: String },
  name: String,
  contractAddress: String,
  lifetimeGrants: String,
  claimed: Boolean,
  claimApprovalDetails: {
    dateApproved: { type: Date, default: null },
    orgAdminWallet: { type: String, default: null },
    claimId: { type: String, default: null },
    transactionHash: { type: String, default: null }
  }
});

//modelClass
const Org = mongoose.model("org", orgSchema);
const RinkebyOrg = mongoose.model("rinkebyorg", orgSchema);

//export
module.exports = { Org, RinkebyOrg };
