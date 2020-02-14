const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//model
const grantSchema = new Schema({
  id: { type: String, unique: true },
  selectedOrg: String,
  selectedFund: String,
  grantAmount: String,
  grantDescription: String,
  grantDate: { type: Date, default: Date.now, required: true },
  grantApproval: Boolean,
  grantIndex: Number,
  approvalDetails: {},
  dateApproved: { type: Date, default: Date.now }
});

//modelClass
const Grant = mongoose.model("grant", grantSchema);
const RinkebyGrant = mongoose.model("rinkebygrant", grantSchema);

//export
module.exports = { Grant, RinkebyGrant };
