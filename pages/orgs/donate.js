import React from 'react';
import { connect } from 'react-redux';
// import ContributionForm from '../../src/components/ContributionForm';
import { Web3Connect, startWatching, initialize } from '../../src/store/reducers/web3connect';
import { setAddresses } from '../../src/store/reducers/swapAddresses';

class Donate extends React.Component {
	componentWillMount() {
		const { initialize, startWatching } = this.props;
		initialize().then(startWatching);
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
		if (!this.props.initialized) {
			return <noscript />;
		}

		return <Web3Connect />;
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
)(Donate);
