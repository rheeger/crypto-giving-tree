const mongoose = require("mongoose");
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
  claimApprovalDetails: {
    claimApproval: { type: Boolean, default: false },
    dateApproved: { type: Date, default: null },
    transactionHash: { type: String, default: "" }
  }
});

//modelClass
const Claim = mongoose.model("claim", claimSchema);
const RinkebyClaim = mongoose.model("rinkebyclaim", claimSchema);

//export
module.exports = { Claim, RinkebyClaim };
