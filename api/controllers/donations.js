const Donation = require("../models/donation");

exports.allDonations = function(req, res, next) {
  // use mongoose to get all donations in the database
  Donation.find(function(err, donations) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(donations); // return all donations in JSON format
  });
};

exports.oneDonation = function(req, res, next) {
  // use mongoose to get one donation in the database
  Donation.findOne({ id: req.params.id }, function(err, donation) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(donation); // return donation in JSON format
  });
};

exports.createDonation = function(req, res, next) {
  // use mongoose to create one donation in the database
  Donation.create(
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
  Donation.remove(
    {
      id: req.params.id
    },
    function(err, todo) {
      if (err) res.send(err);
    }
  );
};
