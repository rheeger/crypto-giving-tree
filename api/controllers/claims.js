const Claim = require('../models/claim');

exports.allClaims = function(req, res, next) {
	// use mongoose to get all claims in the database
	Claim.find(function(err, claims) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(claims); // return all claims in JSON format
	});
};

exports.oneClaim = function(req, res, next) {
	// use mongoose to get one claim in the database
	Claim.findOne({ id: req.params.id }, function(err, claim) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(claim); // return claim in JSON format
	});
};

exports.createClaim = function(req, res, next) {
	// use mongoose to create one claim in the database
	Claim.create(
		{
			id: req.body.id,
			branchName: req.body.branchName,
			primaryAdvisorFirstName: req.body.primaryAdvisorFirstName,
			primaryAdvisorLastName: req.body.primaryAdvisorLastName,
			primaryAdvisorEmail: req.body.primaryAdvisorEmail,
			primaryAdvisorAddress: req.body.primaryAdvisorAddress,
			primaryAdvisorCity: req.body.primaryAdvisorCity,
			primaryAdvisorState: req.body.primaryAdvisorState,
			primaryAdvisorZip: req.body.primaryAdvisorZip,
			primaryAdvisorBirthday: req.body.primaryAdvisorBirthday,
			managerAddress: req.body.managerAddress,
			claimDAI: req.body.claimDAI,
			datePlanted: req.body.datePlanted,
			grantableDAI: req.body.grantableDAI
		},
		function(err, claim) {
			if (err) res.send(err);

			res.json(claim); // return claim in JSON format
		}
	);
};

exports.updateClaim = function(req, res, next) {
	var updateObject = req.body;

	Claim.updateOne({ id: req.params.id }, { $set: updateObject }, function(err, tree) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);
	});
};

exports.deleteClaim = function(req, res, next) {
	Claim.remove(
		{
			id: req.params.id
		},
		function(err, todo) {
			if (err) res.send(err);
		}
	);
};
