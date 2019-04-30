import React from 'react';
import { connect } from 'react-redux';
import ContributionForm from '../../components/ContributionForm';
import { selectOrg, fetchOrg, createOrg } from '../../store/actions';
import orgFactory from '../../ethereum/orgFactory';
import { create } from 'domain';

class Donate extends React.Component {
	componentDidMount() {
		this.props.fetchOrg(this.props.match.params.ein);
		this.props.selectOrg(this.props.match.params.ein);
	}

	createContractAddress = async (id) => {
		const account = this.props.web3connect.account;
		const createContract = orgFactory.methods.createOrg(id).send({ from: account });
		console.log(createContract.events);
		return createContract.events;
	};

	render() {
		if (!this.props.org.organization) {
			return <div>Loading Organization Details</div>;
		}

		if (!this.props.GTorgs) {
			this.createContractAddress(this.props.match.params.ein);
			return <div>No local Org found</div>;
		}

		console.log(this.props.GTorgs);

		return (
			<div className="ui container">
				<div style={{ padding: '1rem', marginBottom: '1rem' }}>
					<h4>You're making a donation to:</h4>
					<h1>{this.props.org.organization.name}</h1>
				</div>
				<ContributionForm style={{ maxWdith: '400px' }} />
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		org: state.org,
		GTorgs: state.GTorgs[ownProps.match.params.ein],
		web3connect: state.web3connect
	};
};

export default connect(mapStateToProps, { selectOrg, fetchOrg, createOrg })(Donate);
