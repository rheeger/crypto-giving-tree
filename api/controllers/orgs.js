const Org = require('../models/org');

exports.allOrgs = function(req, res, next) {
	// use mongoose to get all orgs in the database
	Org.find(function(err, orgs) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(orgs); // return all orgs in JSON format
	});
};

exports.oneOrg = function(req, res, next) {
	// use mongoose to get one org in the database
	Org.findOne({ id: req.params.id }, function(err, org) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(org); // return org in JSON format
	});
};

exports.createOrg = function(req, res, next) {
	// use mongoose to create one org in the database
	console.log(req.body);
	Org.create(
		{
			id: req.body.id,
			name: req.body.name,
			contractAddress: req.body.contractAddress,
			lifetimeGrants: req.body.lifetimeGrants,
			claimed: req.body.claimed
		},
		function(err, org) {
			if (err) res.send(err);
			console.log(org);
			res.json(org); // return org in JSON format
		}
	);
};

exports.updateOrg = function(req, res, next) {
	var updateObject = req.body;

	Org.updateOne({ id: req.params.id }, { $set: updateObject }, function(err, org) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);
		res.json(org); // return org in JSON format
	});
};

exports.deleteOrg = function(req, res, next) {
	Org.remove(
		{
			id: req.params.id
		},
		function(err, todo) {
			if (err) res.send(err);
		}
	);
};
