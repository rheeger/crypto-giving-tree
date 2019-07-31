import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	fetchTree,
	fetchTreeDAIBalance,
	fetchTreeGrants,
	fetchOrgs,
	fetchGrantableDAIBalance,
	fetchTreeDonations
} from '../../store/actions';
import { Card, Grid, Table } from 'semantic-ui-react';
import ContributionForm from '../../components/ContributionForm';
import GrantRow from '../../components/tables/GrantRow';
import DonationRow from '../../components/tables/DonationRow';
import NavHeader from '../../components/Header';

class TreeShow extends Component {
	componentWillMount = () => {
		const {
			fetchTreeDAIBalance,
			fetchTree,
			match,
			fetchTreeGrants,
			fetchOrgs,
			fetchGrantableDAIBalance,
			fetchTreeDonations
		} = this.props;

		fetchTree(match.params.address);
		fetchTreeDAIBalance(match.params.address);
		fetchGrantableDAIBalance(match.params.address);
		fetchTreeDonations(match.params.address);
		fetchTreeGrants(match.params.address);
		fetchOrgs();
	};

	renderGrantRow() {
		if (Object.keys(this.props.gtGrants).length === 0) {
			return <div style={{ textAlign: 'center', padding: '10px' }}>No grants reccommended.</div>;
		}
		return Object.values(this.props.gtGrants).map((grant, key) => {
			if (grant.selectedTree === this.props.match.params.address) {
				return (
					<GrantRow
						key={key}
						id={grant.id}
						recipient={grant.selectedOrg}
						amount={grant.grantAmount}
						date={grant.grantDate}
						description={grant.grantDescription}
					/>
				);
			} else {
				return <div style={{ textAlign: 'center', padding: '10px' }}>No grants reccommended.</div>;
			}
		});
	}

	renderDonationRow() {
		if (Object.keys(this.props.gtDonations).length === 0) {
			return <div style={{ textAlign: 'center', padding: '10px' }}>No token donations received.</div>;
		}
		return Object.values(this.props.gtDonations).map((donation, key) => {
			if (donation.to === this.props.match.params.address) {
				return (
					<DonationRow
						from={donation.from}
						finalTradeOutput={donation.finalTradeOutput}
						donationAmount={donation.inputAmount}
						inputCurrency={donation.inputCurrency}
						date={donation.donationDate}
						key={key}
						id={donation.id}
					/>
				);
			} else {
				return <div style={{ textAlign: 'center', padding: '10px' }}>No token donations received.</div>;
			}
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

		if (!this.props.gtTrees[this.props.match.params.address]) {
			return <div> Loading... </div>;
		}
		if (this.props.web3 === 'null') {
			return <div> Loading... </div>;
		}

		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<NavHeader />
				<div style={{ maxWidth: '900px' }}>
					<Grid className="Container">
						<Grid.Row>
							<Grid.Column width={10}>
								<h3>Tree Details:</h3>
								{this.renderCards()}
							</Grid.Column>

							<Grid.Column width={6}>
								<h3>Donate to {this.props.gtTrees[this.props.match.params.address].branchName}:</h3>
								<ContributionForm recievingTree={this.props.match.params.address} />
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
		web3: state.web3connect.web3,
		gtGrants: state.gtGrants,
		gtOrgs: state.gtOrgs,
		gtDonations: state.gtDonations
	};
};

export default connect(mapStateToProps, {
	fetchTreeDAIBalance,
	fetchTree,
	fetchTreeGrants,
	fetchOrgs,
	fetchGrantableDAIBalance,
	fetchTreeDonations
})(TreeShow);
