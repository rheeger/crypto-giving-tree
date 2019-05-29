import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchGrants, fetchTrees, fetchDonations, fetchOrgs } from '../store/actions';
import { Card, Grid, Table } from 'semantic-ui-react';
import GrantRow from '../components/GrantRow';
import DonationRow from '../components/DonationRow';
import { GT_ADMIN } from '../store/actions/types';
import history from '../history';

class AdminPanel extends Component {
	componentWillMount = () => {
		const { fetchGrants, fetchTrees, fetchDonations, fetchOrgs } = this.props;

		fetchGrants();
		fetchTrees();
		fetchDonations();
		fetchOrgs();
	};

	renderGrantRow() {
		return Object.values(this.props.gtGrants).map((grant, index) => {
			return (
				<GrantRow
					key={grant.id}
					id={grant.id}
					recipient={grant.selectedOrg}
					amount={grant.grantAmount}
					date={grant.grantDate}
					description={grant.grantDescription}
				/>
			);
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
								<h3>Extended Grants:</h3>
								<Table>
									<Header>
										<Row>
											<HeaderCell>Request Date</HeaderCell>
											<HeaderCell>Recipient</HeaderCell>
											<HeaderCell>Description</HeaderCell>
											<HeaderCell>Amount</HeaderCell>
											<HeaderCell>Status</HeaderCell>
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
	fetchGrants,
	fetchTrees,
	fetchDonations,
	fetchOrgs
})(AdminPanel);
