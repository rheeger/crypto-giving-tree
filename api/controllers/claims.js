const models = require("../models/claim");

exports.allClaims = function(req, res, next) {
  // use mongoose to get all claims in the database
  models.Claim.find(function(err, claims) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(claims); // return all claims in JSON format
  });
};

exports.oneClaim = function(req, res, next) {
  // use mongoose to get one claim in the database
  models.Claim.findOne({ id: req.params.id }, function(err, claim) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(claim); // return claim in JSON format
  });
};

exports.createClaim = function(req, res, next) {
  // use mongoose to create one claim in the database
  models.Claim.create(req.body, function(err, claim) {
    if (err) res.send(err);

    res.json(claim); // return claim in JSON format
  });
};

exports.updateClaim = function(req, res, next) {
  var updateObject = req.body;

  models.Claim.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, claim) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(claim); // return claim in JSON format
    }
  );
};

exports.deleteClaim = function(req, res, next) {
  models.Claim.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};

exports.allRinkebyClaims = function(req, res, next) {
  // use mongoose to get all claims in the database
  models.RinkebyClaim.find(function(err, claims) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(claims); // return all claims in JSON format
  });
};

exports.oneRinkebyClaim = function(req, res, next) {
  // use mongoose to get one claim in the database
  models.RinkebyClaim.findOne({ id: req.params.id }, function(err, claim) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(claim); // return claim in JSON format
  });
};

exports.createRinkebyClaim = function(req, res, next) {
  // use mongoose to create one claim in the database
  models.RinkebyClaim.create(req.body, function(err, claim) {
    if (err) res.send(err);

    res.json(claim); // return claim in JSON format
  });
};

exports.updateRinkebyClaim = function(req, res, next) {
  var updateObject = req.body;

  models.RinkebyClaim.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, claim) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(claim); // return claim in JSON format
    }
  );
};

exports.deleteRinkebyClaim = function(req, res, next) {
  models.RinkebyClaim.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
