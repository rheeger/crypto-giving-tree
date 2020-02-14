const models = require("../models/grant");

exports.allGrants = function(req, res, next) {
  // use mongoose to get all grants in the database
  models.Grant.find(function(err, grants) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(grants); // return all grants in JSON format
  });
};

exports.orgGrants = function(req, res, next) {
  // use mongoose to get all grants in the database
  models.Grant.find({ org: req.params.org }, function(err, grants) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(grants); // return all grants in JSON format
  });
};

exports.fundGrants = function(req, res, next) {
  // use mongoose to get all grants in the database
  models.Grant.find({ fund: req.params.fund }, function(err, grants) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(grants); // return all grants in JSON format
  });
};

exports.oneGrant = function(req, res, next) {
  // use mongoose to get one grant in the database
  models.Grant.findOne({ id: req.params.id }, function(err, grant) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(grant); // return grant in JSON format
  });
};

exports.createGrant = function(req, res, next) {
  // use mongoose to create one grant in the database
  models.Grant.create(req.body, function(err, grant) {
    if (err) res.status(500).send(err);
    return res.status(200).send(grant);
  });
};

exports.updateGrant = function(req, res, next) {
  var updateObject = req.body;

  models.Grant.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, grant) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(grant); // return grant in JSON format
    }
  );
};

exports.deleteGrant = function(req, res, next) {
  models.Grant.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};

exports.allRinkebyGrants = function(req, res, next) {
  // use mongoose to get all grants in the database
  models.RinkebyGrant.find(function(err, grants) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(grants); // return all grants in JSON format
  });
};

exports.orgRinkebyGrants = function(req, res, next) {
  // use mongoose to get all grants in the database
  models.RinkebyGrant.find({ org: req.params.org }, function(err, grants) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(grants); // return all grants in JSON format
  });
};

exports.fundRinkebyGrants = function(req, res, next) {
  // use mongoose to get all grants in the database
  models.RinkebyGrant.find({ fund: req.params.fund }, function(err, grants) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(grants); // return all grants in JSON format
  });
};

exports.oneRinkebyGrant = function(req, res, next) {
  // use mongoose to get one grant in the database
  models.RinkebyGrant.findOne({ id: req.params.id }, function(err, grant) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(grant); // return grant in JSON format
  });
};

exports.createRinkebyGrant = function(req, res, next) {
  // use mongoose to create one grant in the database
  models.RinkebyGrant.create(req.body, function(err, grant) {
    if (err) res.status(500).send(err);
    return res.status(200).send(grant);
  });
};

exports.updateRinkebyGrant = function(req, res, next) {
  var updateObject = req.body;

  models.RinkebyGrant.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, grant) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(grant); // return grant in JSON format
    }
  );
};

exports.deleteRinkebyGrant = function(req, res, next) {
  models.RinkebyGrant.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
