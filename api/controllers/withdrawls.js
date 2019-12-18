const Withdrawl = require("../models/withdrawl");

exports.allWithdrawls = function(req, res, next) {
  // use mongoose to get all withdrawls in the database
  Withdrawl.find(function(err, withdrawls) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawls); // return all withdrawls in JSON format
  });
};

exports.oneWithdrawl = function(req, res, next) {
  // use mongoose to get one withdrawl in the database
  Withdrawl.findOne({ id: req.params.id }, function(err, withdrawl) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawl); // return withdrawl in JSON format
  });
};

exports.createWithdrawl = function(req, res, next) {
  // use mongoose to create one withdrawl in the database
  Withdrawl.create(req.body, function(err, withdrawl) {
    if (err) res.send(err);

    res.json(withdrawl); // return withdrawl in JSON format
  });
};

exports.updateWithdrawl = function(req, res, next) {
  var updateObject = req.body;

  Withdrawl.updateOne({ id: req.params.id }, { $set: updateObject }, function(
    err,
    withdrawl
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);
    res.json(withdrawl); // return withdrawl in JSON format
  });
};

exports.deleteWithdrawl = function(req, res, next) {
  Withdrawl.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
