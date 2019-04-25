import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import history from '../history';
import HomePage from './HomePage';
import OrgIndex from '../components/orgs';
import OrgShow from '../components/orgs/show';
import Donate from '../components/orgs/donate';
import { Web3Connect } from '../store/reducers/web3connect';

const App = () => {
	return (
		<div className="ui container">
			<Router history={history}>
				<div>
					<Header />
					<Web3Connect />
					<Switch>
						<Route path="/" exact component={HomePage} />
						{/* <Route path="/branches" exact component={BranchIndex} />
						<Route path="/branches/new" exact component={BranchCreate} />
						<Route path="/branches/:address/donate" exact component={BranchDonate} />
						<Route path="/branches/:address/grants/new" exact component={BranchGrant} />
						<Route path="/branches/:address" exact component={BranchShow} /> */}
						<Route path="/orgs" exact component={OrgIndex} />
						<Route path="/orgs/:ein" exact component={OrgShow} />
						<Route path="/orgs/:ein/donate" exact component={Donate} />
					</Switch>
				</div>
			</Router>
		</div>
	);
};

export default App;
