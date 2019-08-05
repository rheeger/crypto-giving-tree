import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTrees, fetchDonations, fetchOrgs, fetchUnapprovedGrants } from '../store/actions';
import { Card, Grid, Table } from 'semantic-ui-react';
import DonationRow from '../components/tables/DonationRow';
import { GT_ADMIN } from '../store/actions/types';
import history from '../history';
import AdminGrantRow from '../components/tables/AdminGrantRow';
import NavHeader from '../components/Header';

class AdminPanel extends Component {
	componentWillMount = () => {
		const { fetchTrees, fetchDonations, fetchOrgs, fetchUnapprovedGrants } = this.props;

		fetchUnapprovedGrants();
		fetchTrees();
		fetchDonations();
		fetchOrgs();
	};

	onApproveSubmit = async () => {
		await this.props.fetchUnapprovedGrants();
	};

	renderGrantRow() {
		if (Object.keys(this.props.gtGrants).length === 0) {
			return <div style={{ textAlign: 'center', padding: '10px' }}>Nothing to approve.</div>;
		}

		return Object.values(this.props.gtGrants).map((grant, index) => {
			if (grant.grantApproval === false) {
				return (
					<AdminGrantRow
						key={grant.id}
						id={grant.id}
						recipient={grant.selectedOrg}
						amount={grant.grantAmount}
						date={grant.grantDate}
						description={grant.grantDescription}
						selectedTree={grant.selectedTree}
						grantIndex={grant.grantIndex}
						onSubmit={this.onApproveSubmit}
					/>
				);
			} else {
				return <div style={{ textAlign: 'center', padding: '10px' }}>Nothing to approve.</div>;
			}
		});
	}

	renderDonationRow() {
		return Object.values(this.props.gtDonations).map((donation, index) => {
			return (
				<DonationRow
					from={donation.from}
					finalTradeOutput={donation.finalTradeOutput}
					donationAmount={donation.inputAmount}
					inputCurrency={donation.inputCurrency}
					date={donation.donationDate}
					key={donation.id}
					id={donation.id}
				/>
			);
		});
	}

	renderCards() {
		const {
			id,
			branchName,
			datePlanted,
			managerAddress,
			primaryAdvisorFirstName,
			primaryAdvisorLastName,
			primaryAdvisorEmail,
			primaryAdvisorAddress,
			primaryAdvisorCity,
			primaryAdvisorState,
			primaryAdvisorZip,
			treeDAI,
			grantableDAI
		} = this.props.gtTrees[this.props.match.params.address];

		const items = [
			{
				style: { overflowWrap: 'break-word' },
				header: branchName,
				meta: 'Planted: ' + datePlanted.toLocaleString('en'),
				description: 'Address: ' + id,
				fluid: true
			},
			{
				style: { overflowWrap: 'break-word' },
				header: '$' + treeDAI,
				meta: 'Tree Balance',
				description: 'Available to Grant: $' + grantableDAI
			},
			{
				style: { overflowWrap: 'break-word' },
				header: primaryAdvisorFirstName + ' ' + primaryAdvisorLastName,
				meta: 'Primary Advisor',
				description: 'Managing Wallet: ' + managerAddress
			},
			{
				style: { overflowWrap: 'break-word' },
				header: primaryAdvisorAddress,
				meta: primaryAdvisorCity + ', ' + primaryAdvisorState + ' ' + primaryAdvisorZip,
				description: 'e-Mail: ' + primaryAdvisorEmail
			}
		];

		return <Card.Group items={items} />;
	}

	render() {
		const { Header, Row, HeaderCell, Body } = Table;

		if (!this.props.gtTrees) {
			return <div> Loading... </div>;
		}
		if (!this.props.gtDonations) {
			return <div> Loading... </div>;
		}
		if (this.props.web3 === 'null') {
			return <div> Loading... </div>;
		}

		if (this.props.web3.account && this.props.web3.account !== GT_ADMIN) {
			history.push('/');
		}

		return (
			<div>
				<NavHeader />
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ maxWidth: '900px' }}>
						<Grid className="Container">
							<Grid.Row>
								<Grid.Column width={16}>
									<h3>Admin Panel:</h3>
									{/* {this.renderCards()} */}
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={16}>
									<h3>Grants Awaiting Approval:</h3>
									<Table>
										<Header>
											<Row>
												<HeaderCell>Request Date</HeaderCell>
												<HeaderCell>Recipient</HeaderCell>
												<HeaderCell>Description</HeaderCell>
												<HeaderCell>Amount</HeaderCell>
												<HeaderCell>View</HeaderCell>
												<HeaderCell>Approve</HeaderCell>
												<HeaderCell>Reject</HeaderCell>
											</Row>
										</Header>
										<Body>{this.renderGrantRow()}</Body>
									</Table>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={16}>
									<h3>Recieved Donations:</h3>
									<Table>
										<Header>
											<Row>
												<HeaderCell>Donation Date</HeaderCell>
												<HeaderCell>From</HeaderCell>
												<HeaderCell>Property Donated</HeaderCell>
												<HeaderCell>Exchanged Amount</HeaderCell>
												<HeaderCell>Status</HeaderCell>
											</Row>
										</Header>
										<Body>{this.renderDonationRow()}</Body>
									</Table>
								</Grid.Column>
							</Grid.Row>
							{/* 
					<Link route={`/trees/${this.props.address}/grants`}>
						<a>
							<Button primary>View Grants</Button>
						</a>
					</Link>
					<Link route={`/`}>
						<a>
							<Button secondary>See All</Button>
						</a>
					</Link> */}
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		gtTrees: state.gtTrees,
		web3: state.web3connect,
		gtGrants: state.gtGrants,
		gtOrgs: state.gtOrgs,
		gtDonations: state.gtDonations
	};
};

export default connect(mapStateToProps, {
	fetchUnapprovedGrants,
	fetchTrees,
	fetchDonations,
	fetchOrgs
})(AdminPanel);
