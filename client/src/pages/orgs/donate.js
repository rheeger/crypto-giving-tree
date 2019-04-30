import React from 'react';
import { connect } from 'react-redux';
import ContributionForm from '../../components/ContributionForm';
import { selectOrg, fetchOrgs, createOrgAndContract } from '../../store/actions';
import { Web3Connect } from '../../store/reducers/web3connect';

class Donate extends React.Component {
	componentDidMount() {
		this.props.selectOrg(this.props.match.params.ein);
		this.props.fetchOrgs();
	}

	setupOrg = async () => {
		await this.props.createOrgAndContract(this.props.match.params.ein, this.props.web3connect.account);

		return this.props.fetchOrgs();
	};

	render() {
		if (!this.props.org.organization) {
			return <div>Loading Organization Details</div>;
		}

		if (!this.props.gtOrgs) {
			return <div>Loading Local Org Details</div>;
		}

		if (!this.props.gtOrgs[`${this.props.match.params.ein}`]) {
			this.setupOrg();
			return (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<h4>The Giving Tree needs your help!</h4>
					<h1>You're the frist!</h1>
					<p>Looks like you'll be the first to donate to: {this.props.org.organization.name}</p>
					<br />
					<h6>
						Help us initiate their account by approving this *FREE* transaction. We'll process your donation
						next.
					</h6>
				</div>
			);
		}

		return (
			<div className="ui container">
				<div style={{ padding: '1rem', marginBottom: '1rem' }}>
					<h4>You're making a donation to:</h4>
					<h1>{this.props.org.organization.name}</h1>
				</div>
				{/* <ContributionForm style={{ maxWdith: '400px' }} /> */}
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
