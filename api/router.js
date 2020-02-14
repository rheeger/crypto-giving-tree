const Claims = require("./controllers/claims");
const Withdrawls = require("./controllers/withdrawls");
const Donations = require("./controllers/donations");
const Grants = require("./controllers/grants");
const Orgs = require("./controllers/orgs");
const Funds = require("./controllers/funds");

module.exports = function(app) {
  //MAINNET DB
  //Funds
  app.get("/funds", Funds.allFunds);
  app.get("/funds/:managerAddress", Funds.managerFunds);
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
  app.get("/grants/:fund", Grants.fundGrants);
  app.get("/grants/:org", Grants.orgGrants);
  app.get("/grants/:id", Grants.oneGrant);
  app.post("/grants", Grants.createGrant);
  app.patch("/grants/:id", Grants.updateGrant);
  app.delete("/grants/:id", Grants.deleteGrant);
  //Donations
  app.get("/donations", Donations.allDonations);
  app.get("/donations/:org", Donations.orgDonations);
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
  app.get("/withdrawls/:org", Withdrawls.orgWithdrawls);
  app.get("/withdrawls/:id", Withdrawls.oneWithdrawl);
  app.post("/withdrawls", Withdrawls.createWithdrawl);
  app.patch("/withdrawls/:id", Withdrawls.updateWithdrawl);
  app.delete("/withdrawls/:id", Withdrawls.deleteWithdrawl);

  //RINKEBY DB
  //rinkeby.funds
  app.get("/rinkeby.funds", Funds.allRinkebyFunds);
  app.get("/rinkeby.funds/:managerAddress", Funds.managerRinkebyFunds);
  app.get("/rinkeby.funds/:id", Funds.oneRinkebyFund);
  app.post("/rinkeby.funds", Funds.createRinkebyFund);
  app.patch("/rinkeby.funds/:id", Funds.updateRinkebyFund);
  app.delete("/rinkeby.funds/:id", Funds.deleteRinkebyFund);
  //rinkeby.orgs
  app.get("/rinkeby.orgs", Orgs.allRinkebyOrgs);
  app.get("/rinkeby.orgs/:id", Orgs.oneRinkebyOrg);
  app.post("/rinkeby.orgs", Orgs.createRinkebyOrg);
  app.patch("/rinkeby.orgs/:id", Orgs.updateRinkebyOrg);
  app.delete("/rinkeby.orgs/:id", Orgs.deleteRinkebyOrg);
  //rinkeby.grants
  app.get("/rinkeby.grants", Grants.allRinkebyGrants);
  app.get("/rinkeby.grants/:fund", Grants.fundRinkebyGrants);
  app.get("/rinkeby.grants/:org", Grants.orgRinkebyGrants);
  app.get("/rinkeby.grants/:id", Grants.oneRinkebyGrant);
  app.post("/rinkeby.grants", Grants.createRinkebyGrant);
  app.patch("/rinkeby.grants/:id", Grants.updateRinkebyGrant);
  app.delete("/rinkeby.grants/:id", Grants.deleteRinkebyGrant);
  //rinkeby.donations
  app.get("/rinkeby.donations", Donations.allRinkebyDonations);
  app.get("/rinkeby.donations/:fund", Donations.fundRinkebyDonations);
  app.get("/rinkeby.donations/:id", Donations.oneRinkebyDonation);
  app.post("/rinkeby.donations", Donations.createRinkebyDonation);
  app.patch("/rinkeby.donations/:id", Donations.updateRinkebyDonation);
  app.delete("/rinkeby.donations/:id", Donations.deleteRinkebyDonation);
  //rinkeby.claims
  app.get("/rinkeby.claims", Claims.allRinkebyClaims);
  app.get("/rinkeby.claims/:id", Claims.oneRinkebyClaim);
  app.post("/rinkeby.claims", Claims.createRinkebyClaim);
  app.patch("/rinkeby.claims/:id", Claims.updateRinkebyClaim);
  app.delete("/rinkeby.claims/:id", Claims.deleteRinkebyClaim);
  //rinkeby.withdrawls
  app.get("/rinkeby.withdrawls", Withdrawls.allRinkebyWithdrawls);
  app.get("/rinkeby.withdrawls/:org", Withdrawls.orgRinkebyWithdrawls);
  app.get("/rinkeby.withdrawls/:id", Withdrawls.oneRinkebyWithdrawl);
  app.post("/rinkeby.withdrawls", Withdrawls.createRinkebyWithdrawl);
  app.patch("/rinkeby.withdrawls/:id", Withdrawls.updateRinkebyWithdrawl);
  app.delete("/rinkeby.withdrawls/:id", Withdrawls.deleteRinkebyWithdrawl);
};
