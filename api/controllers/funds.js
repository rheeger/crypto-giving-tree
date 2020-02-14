const models = require("../models/fund");

exports.allFunds = function(req, res, next) {
  // use mongoose to get all funds in the database
  models.Fund.find(function(err, funds) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(funds); // return all funds in JSON format
  });
};

exports.managerFunds = function(req, res, next) {
  // use mongoose to get all funds in the database
  models.Fund.find({ managerAddress: req.params.managerAddress }, function(
    err,
    funds
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(funds); // return all funds in JSON format
  });
};

exports.oneFund = function(req, res, next) {
  // use mongoose to get one fund in the database
  models.Fund.findOne({ id: req.params.id }, function(err, fund) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(fund); // return fund in JSON format
  });
};

exports.createFund = function(req, res, next) {
  // use mongoose to create one fund in the database
  models.Fund.create(
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
      fundDAI: req.body.fundDAI,
      datePlanted: req.body.datePlanted,
      grantableDAI: req.body.grantableDAI
    },
    function(err, fund) {
      if (err) res.send(err);

      res.json(fund); // return fund in JSON format
    }
  );
};

exports.updateFund = function(req, res, next) {
  var updateObject = req.body;

  models.Fund.updateOne({ id: req.params.id }, { $set: updateObject }, function(
    err,
    fund
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);
    res.json(fund); // return fund in JSON format
  });
};

exports.deleteFund = function(req, res, next) {
  models.Fund.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};

exports.allRinkebyFunds = function(req, res, next) {
  // use mongoose to get all funds in the database
  models.RinkebyFund.find(function(err, funds) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(funds); // return all funds in JSON format
  });
};

exports.managerRinkebyFunds = function(req, res, next) {
  // use mongoose to get all funds in the database
  models.RinkebyFund.find(
    { managerAddress: req.params.managerAddress },
    function(err, funds) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);

      res.json(funds); // return all funds in JSON format
    }
  );
};

exports.oneRinkebyFund = function(req, res, next) {
  // use mongoose to get one fund in the database
  models.RinkebyFund.findOne({ id: req.params.id }, function(err, fund) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(fund); // return fund in JSON format
  });
};

exports.createRinkebyFund = function(req, res, next) {
  // use mongoose to create one fund in the database
  models.RinkebyFund.create(
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
      fundDAI: req.body.fundDAI,
      datePlanted: req.body.datePlanted,
      grantableDAI: req.body.grantableDAI
    },
    function(err, fund) {
      if (err) res.send(err);

      res.json(fund); // return fund in JSON format
    }
  );
};

exports.updateRinkebyFund = function(req, res, next) {
  var updateObject = req.body;

  models.RinkebyFund.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, fund) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(fund); // return fund in JSON format
    }
  );
};

exports.deleteRinkebyFund = function(req, res, next) {
  models.RinkebyFund.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
