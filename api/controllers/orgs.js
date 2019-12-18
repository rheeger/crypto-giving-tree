const Org = require('../models/org');

exports.allOrgs = function (req, res, next) {
	// use mongoose to get all orgs in the database
	Org.find(function (err, orgs) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(orgs); // return all orgs in JSON format
	});
};

exports.oneOrg = function (req, res, next) {
	// use mongoose to get one org in the database
	Org.findOne({ id: req.params.id }, function (err, org) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(org); // return org in JSON format
	});
};

exports.createOrg = function (req, res, next) {
	// use mongoose to create one Org in the database
	Org.create(req.body, function (err, org) {
		if (err) res.send(err);

		res.json(org); // return Org in JSON format
	});
};

exports.updateOrg = function (req, res, next) {
	var updateObject = req.body;

	Org.updateOne({ id: req.params.id }, { $set: updateObject }, function (err, org) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);
		res.json(org); // return org in JSON format
	});
};

exports.deleteOrg = function (req, res, next) {
	Org.remove(
		{
			id: req.params.id
		},
		function (err, todo) {
			if (err) res.send(err);
		}
	);
};
