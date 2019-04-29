import React from 'react';
import { connect } from 'react-redux';
// import ContributionForm from '../../src/components/ContributionForm';
// import { Web3Connect, startWatching, initialize } from '../../store/reducers/web3connect';
// import { setAddresses } from '../../store/reducers/swapAddresses';
import ContributionForm from '../../components/ContributionForm';
import { selectOrg, fetchOrg, createOrg } from '../../store/actions';
import orgFactory from '../../ethereum/orgFactory';

class Donate extends React.Component {
	componentDidMount() {
		this.props.selectOrg(this.props.match.params.ein);
		this.props.fetchOrg(this.props.match.params.ein);
	}

	render() {
		if (!this.props.org.organization) {
			return <div>Loading Organization Details</div>;
		}

		if (!this.props.GTorgs.id) {
			// const generateContract = async () => {
			// 	const accounts = this.props.web3connect.account;
			// 	const contractAddress = await orgFactory.methods.createOrg().send({ from: accounts });
			// 	return contractAddress;
			// };
			return (
				<div className="ui container">
					<h4>Nice! You're the first to donate to {this.props.org.organization.name}.</h4>
					<p>
						The Giving Tree needs your help. Please initiate this organization's GivingTree account by
						approving the transaction.
					</p>
					{this.props.createOrg(this.props.match.params.ein)}
				</div>
			);
		}
		return (
			<div className="ui container">
				<div style={{ padding: '1rem', marginBottom: '1rem' }}>
					<h4>You're making a donation to:</h4>
					<h1>{this.props.org.organization.name}</h1>
				</div>
				<ContributionForm style={{ maxWdith: '700px' }} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		org: state.org,
		GTorgs: state.GTorgs
	};
};

export default connect(mapStateToProps, { selectOrg, fetchOrg, createOrg })(Donate);
