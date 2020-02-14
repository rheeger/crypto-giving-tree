const models = require("../models/donation");

exports.allDonations = function(req, res, next) {
  // use mongoose to get all donations in the database
  models.Donation.find(function(err, donations) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(donations); // return all donations in JSON format
  });
};
exports.fundDonations = function(req, res, next) {
  // use mongoose to get all donations in the database
  models.Donation.find({ fund: req.params.fund }, function(err, donations) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(donations); // return all donations in JSON format
  });
};

exports.oneDonation = function(req, res, next) {
  // use mongoose to get one donation in the database
  models.Donation.findOne({ id: req.params.id }, function(err, donation) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(donation); // return donation in JSON format
  });
};

exports.createDonation = function(req, res, next) {
  // use mongoose to create one donation in the database
  models.Donation.create(
    {
      id: req.body.id,
      to: req.body.to,
      from: req.body.from,
      inputCurrency: req.body.inputCurrency,
      inputAmount: req.body.inputAmount,
      finalTradeOutput: req.body.finalTradeOutput,
      donationDate: req.body.donationDate
    },
    function(err, donation) {
      if (err) res.send(err);

      res.json(donation); // return donation in JSON format
    }
  );
};

exports.updateDonation = function(req, res, next) {
  var updateObject = req.body;

  Donation.updateOne({ id: req.params.id }, { $set: updateObject }, function(
    err,
    donation
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);
    res.json(donation); // return donation in JSON format
  });
};

exports.deleteDonation = function(req, res, next) {
  models.Donation.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};

exports.allRinkebyDonations = function(req, res, next) {
  // use mongoose to get all donations in the database
  models.RinkebyDonation.find(function(err, donations) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(donations); // return all donations in JSON format
  });
};

exports.fundRinkebyDonations = function(req, res, next) {
  // use mongoose to get all donations in the database
  models.RinkebyDonation.find({ fund: req.params.fund }, function(
    err,
    donations
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(donations); // return all donations in JSON format
  });
};

exports.oneRinkebyDonation = function(req, res, next) {
  // use mongoose to get one donation in the database
  models.RinkebyDonation.findOne({ id: req.params.id }, function(
    err,
    donation
  ) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(donation); // return donation in JSON format
  });
};

exports.createRinkebyDonation = function(req, res, next) {
  // use mongoose to create one donation in the database
  models.RinkebyDonation.create(
    {
      id: req.body.id,
      to: req.body.to,
      from: req.body.from,
      inputCurrency: req.body.inputCurrency,
      inputAmount: req.body.inputAmount,
      finalTradeOutput: req.body.finalTradeOutput,
      donationDate: req.body.donationDate
    },
    function(err, donation) {
      if (err) res.send(err);

      res.json(donation); // return donation in JSON format
    }
  );
};

exports.updateRinkebyDonation = function(req, res, next) {
  var updateObject = req.body;

  RinkebyDonation.updateOne(
    { id: req.params.id },
    { $set: updateObject },
    function(err, donation) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      res.json(donation); // return donation in JSON format
    }
  );
};

exports.deleteRinkebyDonation = function(req, res, next) {
  models.RinkebyDonation.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
