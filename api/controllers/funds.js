const Fund = require("../models/fund");

exports.allFunds = function(req, res, next) {
  // use mongoose to get all funds in the database
  Fund.find(function(err, funds) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(funds); // return all funds in JSON format
  });
};

exports.oneFund = function(req, res, next) {
  // use mongoose to get one fund in the database
  Fund.findOne({ id: req.params.id }, function(err, fund) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(fund); // return fund in JSON format
  });
};

exports.createFund = function(req, res, next) {
  // use mongoose to create one fund in the database
  Fund.create(
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

  Fund.updateOne({ id: req.params.id }, { $set: updateObject }, function(
    err,
    fund
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);
    res.json(fund); // return fund in JSON format
  });
};

exports.deleteFund = function(req, res, next) {
  Fund.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
