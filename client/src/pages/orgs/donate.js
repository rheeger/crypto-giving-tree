import React from 'react';
import { connect } from 'react-redux';
import ContributionForm from '../../components/ContributionForm';
import { selectOrg, fetchOrgs, createOrgAndContract } from '../../store/actions';

class Donate extends React.Component {
	componentDidMount() {
		this.props.selectOrg(this.props.match.params.ein);
		this.props.fetchOrgs();
		if (this.props.gtOrgs && !this.props.gtOrgs[`${this.props.match.params.ein}`]) {
			const { ein } = this.props.match.params;
			this.setupOrg(ein);
		}
	}

	setupOrg = async (id, address) => {
		await this.props.createOrgAndContract(id, address);
		await this.props.fetchOrgs();

		return <div>Transaction pending...</div>;
	};

	render() {
		if (!this.props.org.organization) {
			return <div>Loading Organization Details</div>;
		}

		if (!this.props.gtOrgs) {
			return <div>Loading Local Org Details</div>;
		}

		if (this.props.gtOrgs[`${this.props.match.params.ein}`]) {
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

		return (
			<div style={{ textAlign: 'center', display: 'flex-flow', alignContent: 'center' }}>
				<h4>The Giving Tree needs your help!</h4>
				<h1>You're the first!</h1>
				<p>Looks like you'll be the first to donate to: </p>
				<h3>{this.props.org.organization.name}</h3>
				<h6>Help us initiate their account by approving this transaction. We'll process your donation next.</h6>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		org: state.org,
		gtOrgs: state.gtOrgs,
		web3connect: state.web3connect
	};
};

export default connect(mapStateToProps, { selectOrg, fetchOrgs, createOrgAndContract })(Donate);
