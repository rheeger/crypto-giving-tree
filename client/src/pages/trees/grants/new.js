import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { createGrant, selectOrg, fetchOrgs, createOrgAndContract } from '../../../store/actions';
import GrantForm from '../../../components/GrantForm';

class NewGrant extends React.Component {
	state = {
		ready: 'false',
		loading: false
	};

	componentDidMount = async () => {
		const { selectOrg, fetchOrgs, gtOrgs, match } = this.props;
		this.setState({ ready: 'false' });
		await selectOrg(match.params.ein);
		console.log(gtOrgs);
		await fetchOrgs();
	};

	setupOrg = async (id) => {
		await this.props.createOrgAndContract(id, this.props.org.organization.name);
		await this.props.fetchOrgs();
	};

	onSubmit = async (formValues) => {
		this.setState({ loading: true });
		await this.props.createGrant(
			formValues,
			this.props.gtOrgs[`${this.props.match.params.ein}`].contractAddress,
			this.props.match.params.ein,
			this.props.web3.account
		);
		this.setState({ loading: false });
	};

	renderBranchForm = () => {
		this.setState({ ready: 'true' });
	};

	render() {
		if (!this.props.org.organization) {
			return <div>Loading Organization Details</div>;
		}

		if (!this.props.gtOrgs) {
			return <div>Loading Local Org Details</div>;
		}

		if (this.state.ready === 'true' && this.props.gtOrgs[`${this.props.match.params.ein}`]) {
			return (
				<div className="ui container">
					<div style={{ padding: '1rem', marginBottom: '1rem' }}>
						<h4>You're reccomending a grant to:</h4>
						<h1>{this.props.org.organization.name}</h1>

						<GrantForm onSubmit={this.onSubmit} loading={this.state.loading} gtTrees={this.props.gtTrees} />
					</div>
				</div>
			);
		}

		if (this.state.ready === 'true' && this.props.gtOrgs && !this.props.gtOrgs[`${this.props.match.params.ein}`]) {
			this.setupOrg(this.props.match.params.ein);
			return (
				<div className="ui container">
					<div style={{ textAlign: 'center', display: 'flex-flow', alignContent: 'center' }}>
						<h1>Hang tight!</h1>
						<p>Looks like you'll be the first to reccomend a grant to: </p>
						<h3>{this.props.org.organization.name}</h3>
						<h6>We're setting up their account. We'll process your grant reccomendation next.</h6>
					</div>
				</div>
			);
		}

		if (this.state.ready === 'false' && this.props.gtOrgs && !this.props.gtOrgs[`${this.props.match.params.ein}`]) {
			return (
				<div
					style={{
						margin: '0px auto',
						textAlign: 'left',
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						height: '50vh',
						maxWidth: '350px'
					}}
				>
					<div>
						<h1>What is a Grant? </h1>
						<p>some things to know...</p>
						<h3>
							1. Each grant represents an instruction for your Charity Tree to make a donation to a {' '}
							<a href="https://en.wikipedia.org/wiki/Donor-advised_fund" target="blank">
								qualifyiing 501(c)3 organziation.
							</a>
						</h3>
						<h3>2. Set the amount to grant and provide a short description memo, if needed.</h3>
						<h3>
							3. The staff at the Chairty Tree will review the grant within 24 hours, finalize the
							distribution of the DAI and notify the organziation.
						</h3>
						<br />

						<Button
							onClick={this.renderBranchForm}
							loading={this.state.loading}
							floated="left"
							className="ui button green"
						>
							Got It!
						</Button>
					</div>
				</div>
			);
		}

		if (this.state.loading === true && this.props.gtOrgs[`${this.props.match.params.ein}`] === undefined) {
			return (
				<div className="ui container">
					<div style={{ textAlign: 'center', display: 'flex-flow', alignContent: 'center' }}>
						<h1>Hang tight!</h1>
						<p>We're submitting your grant reccomendation to: </p>
						<h3>{this.props.org.organization.name}</h3>
					</div>
				</div>
			);
		}

		return (
			<div
				style={{
					margin: '0px auto',
					textAlign: 'left',
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'center',
					height: '50vh',
					maxWidth: '350px'
				}}
			>
				<div>
					<h1>What is a Grant? </h1>
					<p>some things to know...</p>
					<h3>
						1. Each grant represents an instruction for your Charity Tree to make a donation to a {' '}
						<a href="https://en.wikipedia.org/wiki/Donor-advised_fund" target="blank">
							qualifyiing 501(c)3 organziation.
						</a>
					</h3>
					<h3>2. Set the amount to grant and provide a short description memo, if needed.</h3>
					<h3>
						3. The staff at the Chairty Tree will review the grant within 24 hours, finalize the
						distribution of the DAI and notify the organziation.
					</h3>
					<br />

					<Button onClick={this.renderBranchForm} floated="left" className="ui button green">
						Got It!
					</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		gtTrees: state.gtTrees,
		web3: state.web3connect,
		org: state.org,
		gtOrgs: state.gtOrgs
	};
};

export default connect(mapStateToProps, { selectOrg, fetchOrgs, createOrgAndContract, createGrant })(NewGrant);
