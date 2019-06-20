const Tree = require('../models/tree');

exports.allTrees = function(req, res, next) {
	// use mongoose to get all trees in the database
	Tree.find(function(err, trees) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(trees); // return all trees in JSON format
	});
};

exports.oneTree = function(req, res, next) {
	// use mongoose to get one tree in the database
	Tree.find({ id: req.params.id }, function(err, tree) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		res.json(tree); // return tree in JSON format
	});
};

exports.createTree = function(req, res, next) {
	// use mongoose to create one tree in the database
	Tree.create(
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
			treeDAI: req.body.treeDAI,
			datePlanted: req.body.datePlanted,
			grantableDAI: req.body.grantableDAI
		},
		function(err, todo) {
			if (err) res.send(err);
			// use mongoose to get one tree in the database
			Tree.findById(req.body.id, function(err, tree) {
				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err) res.send(err);

				res.json(tree); // return tree in JSON format
			});
		}
	);
};

exports.updateTree = function(req, res, next) {
	var updateObject = req.body;

	Tree.find({ id: req.params.id }, function(err, tree) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) res.send(err);

		tree.update({ $set: updateObject });
	});
};

exports.deleteTree = function(req, res, next) {
	Tree.remove(
		{
			id: req.params.id
		},
		function(err, todo) {
			if (err) res.send(err);
		}
	);
};
