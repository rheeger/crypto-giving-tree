const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//model
const withdrawlSchema = new Schema({
  id: { type: String },
  selectedOrg: String,
  orgAdminWallet: String,
  withdrawlAmount: Number,
  withdrawlDate: { type: Date, default: Date.now, required: true }
});

//modelClass
const Withdrawl = mongoose.model("withdrawl", withdrawlSchema);
const RinkebyWithdrawl = mongoose.model("rinkebywithdrawl", withdrawlSchema);

//export
module.exports = { Withdrawl, RinkebyWithdrawl };
