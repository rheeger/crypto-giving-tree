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
  //rinkebyfunds
  app.get("/rinkebyfunds", Funds.allRinkebyFunds);
  app.get("/rinkebyfunds/:managerAddress", Funds.managerRinkebyFunds);
  app.get("/rinkebyfunds/:id", Funds.oneRinkebyFund);
  app.post("/rinkebyfunds", Funds.createRinkebyFund);
  app.patch("/rinkebyfunds/:id", Funds.updateRinkebyFund);
  app.delete("/rinkebyfunds/:id", Funds.deleteRinkebyFund);
  //rinkebyorgs
  app.get("/rinkebyorgs", Orgs.allRinkebyOrgs);
  app.get("/rinkebyorgs/:id", Orgs.oneRinkebyOrg);
  app.post("/rinkebyorgs", Orgs.createRinkebyOrg);
  app.patch("/rinkebyorgs/:id", Orgs.updateRinkebyOrg);
  app.delete("/rinkebyorgs/:id", Orgs.deleteRinkebyOrg);
  //rinkebygrants
  app.get("/rinkebygrants", Grants.allRinkebyGrants);
  app.get("/rinkebygrants/:fund", Grants.fundRinkebyGrants);
  app.get("/rinkebygrants/:org", Grants.orgRinkebyGrants);
  app.get("/rinkebygrants/:id", Grants.oneRinkebyGrant);
  app.post("/rinkebygrants", Grants.createRinkebyGrant);
  app.patch("/rinkebygrants/:id", Grants.updateRinkebyGrant);
  app.delete("/rinkebygrants/:id", Grants.deleteRinkebyGrant);
  //rinkebydonations
  app.get("/rinkebydonations", Donations.allRinkebyDonations);
  app.get("/rinkebydonations/:fund", Donations.fundRinkebyDonations);
  app.get("/rinkebydonations/:id", Donations.oneRinkebyDonation);
  app.post("/rinkebydonations", Donations.createRinkebyDonation);
  app.patch("/rinkebydonations/:id", Donations.updateRinkebyDonation);
  app.delete("/rinkebydonations/:id", Donations.deleteRinkebyDonation);
  //rinkebyclaims
  app.get("/rinkebyclaims", Claims.allRinkebyClaims);
  app.get("/rinkebyclaims/:id", Claims.oneRinkebyClaim);
  app.post("/rinkebyclaims", Claims.createRinkebyClaim);
  app.patch("/rinkebyclaims/:id", Claims.updateRinkebyClaim);
  app.delete("/rinkebyclaims/:id", Claims.deleteRinkebyClaim);
  //rinkebywithdrawls
  app.get("/rinkebywithdrawls", Withdrawls.allRinkebyWithdrawls);
  app.get("/rinkebywithdrawls/:org", Withdrawls.orgRinkebyWithdrawls);
  app.get("/rinkebywithdrawls/:id", Withdrawls.oneRinkebyWithdrawl);
  app.post("/rinkebywithdrawls", Withdrawls.createRinkebyWithdrawl);
  app.patch("/rinkebywithdrawls/:id", Withdrawls.updateRinkebyWithdrawl);
  app.delete("/rinkebywithdrawls/:id", Withdrawls.deleteRinkebyWithdrawl);
};
