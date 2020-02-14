const models = require("../models/withdrawl");

exports.allWithdrawls = function(req, res, next) {
  // use mongoose to get all withdrawls in the database
  models.Withdrawl.find(function(err, withdrawls) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawls); // return all withdrawls in JSON format
  });
};

exports.orgWithdrawls = function(req, res, next) {
  // use mongoose to get all withdrawls in the database
  models.Withdrawl.find({ org: req.params.org }, function(err, withdrawls) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawls); // return all withdrawls in JSON format
  });
};

exports.oneWithdrawl = function(req, res, next) {
  // use mongoose to get one withdrawl in the database
  models.Withdrawl.findOne({ id: req.params.id }, function(err, withdrawl) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawl); // return withdrawl in JSON format
  });
};

exports.createWithdrawl = function(req, res, next) {
  // use mongoose to create one withdrawl in the database
  models.Withdrawl.create(req.body, function(err, withdrawl) {
    if (err) res.send(err);

    res.json(withdrawl); // return withdrawl in JSON format
  });
};

exports.updateWithdrawl = function(req, res, next) {
  var updateObject = req.body;

  models.Withdrawl.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, withdrawl) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(withdrawl); // return withdrawl in JSON format
    }
  );
};

exports.deleteWithdrawl = function(req, res, next) {
  models.Withdrawl.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
exports.allWithdrawls = function(req, res, next) {
  // use mongoose to get all withdrawls in the database
  models.Withdrawl.find(function(err, withdrawls) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawls); // return all withdrawls in JSON format
  });
};

exports.oneWithdrawl = function(req, res, next) {
  // use mongoose to get one withdrawl in the database
  models.Withdrawl.findOne({ id: req.params.id }, function(err, withdrawl) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawl); // return withdrawl in JSON format
  });
};

exports.createWithdrawl = function(req, res, next) {
  // use mongoose to create one withdrawl in the database
  models.Withdrawl.create(req.body, function(err, withdrawl) {
    if (err) res.send(err);

    res.json(withdrawl); // return withdrawl in JSON format
  });
};

exports.updateWithdrawl = function(req, res, next) {
  var updateObject = req.body;

  models.Withdrawl.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, withdrawl) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(withdrawl); // return withdrawl in JSON format
    }
  );
};

exports.deleteWithdrawl = function(req, res, next) {
  models.Withdrawl.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
exports.allRinkebyWithdrawls = function(req, res, next) {
  // use mongoose to get all withdrawls in the database
  models.RinkebyWithdrawl.find(function(err, withdrawls) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawls); // return all withdrawls in JSON format
  });
};

exports.orgRinkebyWithdrawls = function(req, res, next) {
  // use mongoose to get all withdrawls in the database
  models.RinkebyWithdrawl.find({ org: req.params.org }, function(
    err,
    withdrawls
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawls); // return all withdrawls in JSON format
  });
};

exports.oneRinkebyWithdrawl = function(req, res, next) {
  // use mongoose to get one withdrawl in the database
  models.RinkebyWithdrawl.findOne({ id: req.params.id }, function(
    err,
    withdrawl
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(withdrawl); // return withdrawl in JSON format
  });
};

exports.createRinkebyWithdrawl = function(req, res, next) {
  // use mongoose to create one withdrawl in the database
  models.RinkebyWithdrawl.create(req.body, function(err, withdrawl) {
    if (err) res.send(err);

    res.json(withdrawl); // return withdrawl in JSON format
  });
};

exports.updateRinkebyWithdrawl = function(req, res, next) {
  var updateObject = req.body;

  models.RinkebyWithdrawl.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, withdrawl) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(withdrawl); // return withdrawl in JSON format
    }
  );
};

exports.deleteRinkebyWithdrawl = function(req, res, next) {
  models.RinkebyWithdrawl.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
