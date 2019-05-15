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
						<h4>You're reccomending a grant to:</h4>
						<h1>{this.props.org.organization.name}</h1>
					</div>
				</div>
			);
		}

		if (this.props.gtOrgs && !this.props.gtOrgs[`${this.props.match.params.ein}`]) {
			return (
				<div style={{ textAlign: 'center', display: 'flex-flow', alignContent: 'center' }}>
					<h1>You're the first!</h1>
					<p>Looks like you'll be the first to reccomend a grant to: </p>
					<h3>{this.props.org.organization.name}</h3>
					<h6>Hang tight while we set up their account. We'll process your grant reccomendation next.</h6>
				</div>
			);
		}

		return;
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
