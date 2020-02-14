const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//model
const donationSchema = new Schema({
  id: { type: String, lowercase: true },
  to: String,
  from: String,
  inputCurrency: String,
  inputAmount: String,
  finalTradeOutput: String,
  donationDate: { type: Date, default: Date.now, required: true },
  transStatus: String
});

//modelClass
const Donation = mongoose.model("donation", donationSchema);
const RinkebyDonation = mongoose.model("rinkebydonation", donationSchema);

//export
module.exports = { Donation, RinkebyDonation };
