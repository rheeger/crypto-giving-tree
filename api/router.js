const Claims = require('./controllers/claims');
const Donations = require('./controllers/donations');
const Grants = require('./controllers/grants');
const Orgs = require('./controllers/orgs');
const Trees = require('./controllers/trees');

module.exports = function(app) {
	app.get('/trees', Trees.allTrees);
};
