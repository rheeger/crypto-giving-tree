const models = require("../models/org");

exports.allOrgs = function(req, res, next) {
  // use mongoose to get all orgs in the database
  models.Org.find(function(err, orgs) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(orgs); // return all orgs in JSON format
  });
};

exports.oneOrg = function(req, res, next) {
  // use mongoose to get one org in the database
  models.Org.findOne({ id: req.params.id }, function(err, org) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(org); // return org in JSON format
  });
};

exports.createOrg = function(req, res, next) {
  // use mongoose to create one Org in the database
  models.Org.create(req.body, function(err, org) {
    if (err) res.send(err);

    res.json(org); // return Org in JSON format
  });
};

exports.updateOrg = function(req, res, next) {
  var updateObject = req.body;

  models.Org.updateOne({ id: req.params.id }, { $set: updateObject }, function(
    err,
    org
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);
    res.json(org); // return org in JSON format
  });
};

exports.deleteOrg = function(req, res, next) {
  models.Org.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};

exports.allRinkebyOrgs = function(req, res, next) {
  // use mongoose to get all orgs in the database
  models.RinkebyOrg.find(function(err, orgs) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(orgs); // return all orgs in JSON format
  });
};

exports.oneRinkebyOrg = function(req, res, next) {
  // use mongoose to get one org in the database
  models.RinkebyOrg.findOne({ id: req.params.id }, function(err, org) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(org); // return org in JSON format
  });
};

exports.createRinkebyOrg = function(req, res, next) {
  // use mongoose to create one RinkebyOrg in the database
  models.RinkebyOrg.create(req.body, function(err, org) {
    if (err) res.send(err);

    res.json(org); // return RinkebyOrg in JSON format
  });
};

exports.updateRinkebyOrg = function(req, res, next) {
  var updateObject = req.body;

  models.RinkebyOrg.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, org) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(org); // return org in JSON format
    }
  );
};

exports.deleteRinkebyOrg = function(req, res, next) {
  models.RinkebyOrg.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
