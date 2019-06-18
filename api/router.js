const Claims = require('./controllers/claims');
const Donations = require('./controllers/donations');
const Grants = require('./controllers/grants');
const Orgs = require('./controllers/orgs');
const Trees = require('./controllers/trees');

module.exports = function(app) {
	//Trees
	app.get('/trees', Trees.allTrees);
	app.get('/trees/:id', Trees.oneTree);
	app.post('/trees', Trees.createTree);
	app.patch('/trees/:id', Trees.updateTree);
	app.delete('/trees/:id', Trees.deleteTree);
	//Orgs
	app.get('/orgs', Orgs.allOrgs);
	app.get('/orgs/:id', Orgs.oneOrg);
	app.post('/orgs', Orgs.createOrg);
	app.patch('/orgs/:id', Orgs.updateOrg);
	app.delete('/orgs/:id', Orgs.deleteOrg);
	//Grants
	app.get('/grants', Grants.allGrants);
	app.get('/grants/:id', Grants.oneGrant);
	app.post('/grants', Grants.createGrant);
	app.patch('/grants/:id', Grants.updateGrant);
	app.delete('/grants/:id', Grants.deleteGrant);
	//Donations
	app.get('/donations', Donations.allDonations);
	app.get('/donations/:id', Donations.oneDonation);
	app.post('/donations', Donations.createDonation);
	app.patch('/donations/:id', Donations.updateDonation);
	app.delete('/donations/:id', Donations.deleteDonation);
	//Claims
	app.get('/claims', Claims.allClaims);
	app.get('/claims/:id', Claims.oneClaim);
	app.post('/claims', Claims.createClaim);
	app.patch('/claims/:id', Claims.updateClaim);
	app.delete('/claims/:id', Claims.deleteClaim);
};
