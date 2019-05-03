import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import Header from '../components/Header';
import history from '../history';
import HomePage from './HomePage';
import OrgIndex from '../pages/orgs';
import OrgShow from '../pages/orgs/show';
import Donate from '../pages/orgs/donate';
import NewBranch from '../pages/branches/new';
import { Web3Connect, startWatching, initialize } from '../store/reducers/web3connect';
import { setAddresses } from '../store/reducers/swapAddresses';

class App extends React.Component {
	componentWillMount() {
		const { initialize, startWatching } = this.props;
		initialize().then(startWatching);

		require('dotenv').config();
	}

	componentWillUpdate() {
		const { web3, setAddresses } = this.props;

		if (this.hasSetNetworkId || !web3 || !web3.eth || !web3.eth.net || !web3.eth.net.getId) {
			return;
		}

		web3.eth.net.getId((err, networkId) => {
			if (!err && !this.hasSetNetworkId) {
				setAddresses(networkId);
				this.hasSetNetworkId = true;
			}
		});
	}
	render() {
		return (
			<div className="ui container">
				<Router history={history}>
					<div className="app__wrapper">
						<Header />
						<Web3Connect />
						<Switch>
							<Route path="/" exact component={HomePage} />
							{/* <Route path="/branches" exact component={BranchIndex} /> */}
							<Route path="/branches/new" exact component={NewBranch} />
							{/* <Route path="/branches/:address/donate" exact component={BranchDonate} />
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
	}
}
export default connect(
	(state) => ({
		account: state.web3connect.account,
		initialized: state.web3connect.initialized,
		web3: state.web3connect.web3
	}),
	(dispatch) => ({
		setAddresses: (networkId) => dispatch(setAddresses(networkId)),
		initialize: () => dispatch(initialize()),
		startWatching: () => dispatch(startWatching())
	})
)(App);
