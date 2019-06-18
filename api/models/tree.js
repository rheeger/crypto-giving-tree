const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//model
const treeSchema = new Schema({
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
	treeDAI: String,
	datePlanted: String,
	grantableDAI: Number
});

//modelClass
const ModelClass = mongoose.model('tree', treeSchema);

//export
module.exports = ModelClass;
