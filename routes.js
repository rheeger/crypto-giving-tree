const routes = require('next-routes')();

routes
	.add('/branches/new', '/branches/new')
	.add('/branches/:address/donate', '/branches/donate/index')
	.add('/branches/:address/grants/new', '/branches/grants/new')
	.add('/branches/:address', '/branches/show')
	.add('/orgs', '/orgs/index')
	.add('/orgs/:ein', '/orgs/show')
	.add('/orgs/:ein/donate', '/orgs/donate');

module.exports = routes;
