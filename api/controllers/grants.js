const Grant = require('../models/grant');

exports.allGrants = function(req, res, next) {
	// use mongoose to get all grants in the database
	Grant.find(function(err, grants) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(grants); // return all grants in JSON format
	});
};

exports.oneGrant = function(req, res, next) {
	// use mongoose to get one grant in the database
	Grant.findOne({ id: req.params.id }, function(err, grant) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(grant); // return grant in JSON format
	});
};

exports.createGrant = function(req, res, next) {
	// use mongoose to create one grant in the database
	Grant.create(req.body, function(err, grant) {
		if (err) res.status(500).send(err);
		return res.status(200).send(grant);
	});
};

exports.updateGrant = function(req, res, next) {
	var updateObject = req.body;

	Grant.updateOne({ id: req.params.id }, { $set: updateObject }, function(err, grant) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);
		res.json(grant); // return grant in JSON format
	});
};

exports.deleteGrant = function(req, res, next) {
	Grant.remove(
		{
			id: req.params.id
		},
		function(err, todo) {
			if (err) res.send(err);
		}
	);
};
