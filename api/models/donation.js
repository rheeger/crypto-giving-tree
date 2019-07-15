const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//model
const donationSchema = new Schema({
	id: { type: String, unique: true, lowercase: true },
	to: String,
	from: String,
	inputCurrency: String,
	inputAmount: String,
	finalTradeOutput: String,
	donationDate: { type: Date, default: Date.now, required: true }
});

//modelClass
const ModelClass = mongoose.model('donation', donationSchema);

//export
module.exports = ModelClass;
