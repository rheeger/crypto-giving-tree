import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import history from '../history';
import HomePage from './HomePage';

const App = () => {
	return (
		<div className="ui container">
			<Router history={history}>
				<div>
					<Header />
					<Switch>
						<Route path="/" exact component={HomePage} />
						{/* <Route path="/branches" exact component={BranchIndex} />
						<Route path="/branches/new" exact component={BranchCreate} />
						<Route path="/branches/:address/donate" exact component={BranchDonate} />
						<Route path="/branches/:address/grants/new" exact component={BranchGrant} />
						<Route path="/branches/:address" exact component={BranchShow} />
						<Route path="/orgs" exact component={OrgIndex} />
						<Route path="/orgs/:ein" exact component={StreamShow} />
						<Route path="/orgs/:ein/donate" exact component={StreamShow} /> */}
					</Switch>
				</div>
			</Router>
		</div>
	);
};

export default App;
