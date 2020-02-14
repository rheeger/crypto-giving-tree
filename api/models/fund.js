const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//model
const fundSchema = new Schema({
  id: String,
  branchName: String,
  primaryAdvisorFirstName: String,
  primaryAdvisorLastName: String,
  primaryAdvisorEmail: String,
  primaryAdvisorAddress: String,
  primaryAdvisorCity: String,
  primaryAdvisorState: String,
  primaryAdvisorZip: String,
  primaryAdvisorBirthday: String,
  managerAddress: String,
  fundDAI: String,
  datePlanted: { type: Date, default: Date.now, required: true },
  grantableDAI: Number
});

//modelClass
const Fund = mongoose.model("fund", fundSchema);
const RinkebyFund = mongoose.model("rinkebyfund", fundSchema);

//export
module.exports = { Fund, RinkebyFund };
