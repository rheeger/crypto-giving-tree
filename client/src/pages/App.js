import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import Header from '../components/Header';
import history from '../history';
import { Web3Connect, startWatching, initialize } from '../store/reducers/web3connect';
import { setAddresses } from '../store/reducers/swapAddresses';
import asyncComponent from './AsyncComponents';

const AsyncHome = asyncComponent(() => import('./HomePage'));
const AsyncManager = asyncComponent(() => import('./trees/manager'));
const AsyncNewTree = asyncComponent(() => import('./trees/new'));
const AsyncTreeShow = asyncComponent(() => import('./trees/show'));
const AsyncOrgIndex = asyncComponent(() => import('./orgs'));
const AsyncOrgShow = asyncComponent(() => import('./orgs/show'));
const AsyncNewGrant = asyncComponent(() => import('./trees/grants/new'));
const AsyncAdminPanel = asyncComponent(() => import('./admin'));

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
							<Route path="/" exact component={AsyncHome} />
							<Route path="/trees" exact component={AsyncManager} />
							<Route path="/trees/new" exact component={AsyncNewTree} />
							<Route path="/trees/:address" exact component={AsyncTreeShow} />
							<Route path="/orgs" exact component={AsyncOrgIndex} />
							<Route path="/orgs/:ein" exact component={AsyncOrgShow} />
							<Route path="/orgs/:ein/grants/new" exact component={AsyncNewGrant} />
							<Route path="/admin" exact component={AsyncAdminPanel} />
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
