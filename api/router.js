const Claims = require("./controllers/claims");
const Withdrawls = require("./controllers/withdrawls");
const Donations = require("./controllers/donations");
const Grants = require("./controllers/grants");
const Orgs = require("./controllers/orgs");
const Funds = require("./controllers/funds");

module.exports = function(app) {
  //Funds
  app.get("/funds", Funds.allFunds);
  app.get("/funds/:id", Funds.oneFund);
  app.post("/funds", Funds.createFund);
  app.patch("/funds/:id", Funds.updateFund);
  app.delete("/funds/:id", Funds.deleteFund);
  //Orgs
  app.get("/orgs", Orgs.allOrgs);
  app.get("/orgs/:id", Orgs.oneOrg);
  app.post("/orgs", Orgs.createOrg);
  app.patch("/orgs/:id", Orgs.updateOrg);
  app.delete("/orgs/:id", Orgs.deleteOrg);
  //Grants
  app.get("/grants", Grants.allGrants);
  app.get("/grants/:id", Grants.oneGrant);
  app.post("/grants", Grants.createGrant);
  app.patch("/grants/:id", Grants.updateGrant);
  app.delete("/grants/:id", Grants.deleteGrant);
  //Donations
  app.get("/donations", Donations.allDonations);
  app.get("/donations/:id", Donations.oneDonation);
  app.post("/donations", Donations.createDonation);
  app.patch("/donations/:id", Donations.updateDonation);
  app.delete("/donations/:id", Donations.deleteDonation);
  //Claims
  app.get("/claims", Claims.allClaims);
  app.get("/claims/:id", Claims.oneClaim);
  app.post("/claims", Claims.createClaim);
  app.patch("/claims/:id", Claims.updateClaim);
  app.delete("/claims/:id", Claims.deleteClaim);
  //Withdrawls
  app.get("/withdrawls", Withdrawls.allWithdrawls);
  app.get("/withdrawls/:id", Withdrawls.oneWithdrawl);
  app.post("/withdrawls", Withdrawls.createWithdrawl);
  app.patch("/withdrawls/:id", Withdrawls.updateWithdrawl);
  app.delete("/withdrawls/:id", Withdrawls.deleteWithdrawl);
};
