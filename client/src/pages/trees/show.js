import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTree, fetchTreeDAIBalance, fetchTreeGrants, fetchOrgs } from '../../store/actions';
import { Button, Card, Grid, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ContributionForm from '../../components/ContributionForm';
import GrantRow from '../../components/GrantRow';

class TreeShow extends Component {
	componentWillMount = () => {
		const { fetchTreeDAIBalance, fetchTree, match, fetchTreeGrants, fetchOrgs } = this.props;

		fetchTree(match.params.address);
		fetchTreeGrants(match.params.address);
		fetchTreeDAIBalance(match.params.address);
		fetchOrgs();
	};

	renderRow() {
		return Object.values(this.props.gtGrants).map((grant, index) => {
			return (
				<GrantRow
					key={grant.id}
					id={grant.id}
					recipient={grant.selectedOrg}
					amount={grant.grantAmount}
					description={grant.grantDescription}
				/>
			);
		});
	}

	renderCards() {
		const {
			id,
			branchName,
			creationDate,
			managerAddress,
			primaryAdvisorFirstName,
			primaryAdvisorLastName,
			primaryAdvisorEmail,
			primaryAdvisorAddress,
			primaryAdvisorCity,
			primaryAdvisorState,
			primaryAdvisorZip
		} = this.props.gtTrees[this.props.match.params.address];

		const items = [
			{
				style: { overflowWrap: 'break-word' },
				header: branchName,
				meta: 'Planted: ' + creationDate,
				description: 'Address: ' + id
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
				<div style={{ maxWidth: '700px' }}>
					<Grid className="Container">
						<Grid.Row>
							<Grid.Column width={10}>
								<h3>Tree Details:</h3>
								{this.renderCards()}
							</Grid.Column>

							<Grid.Column width={6}>
								<div>
									<h3>Tree Balance:</h3>
									<Link to={`/orgs`} className="ui two-buttons">
										<Button floated="right" basic color="red">
											<i className="paper plane icon" /> send grant
										</Button>
									</Link>
									<h1>${this.props.gtTrees[this.props.match.params.address].treeDAI}</h1>
								</div>
								<br />

								<h3>Contribute Funds:</h3>
								<ContributionForm recievingTree={this.props.match.params.address} />
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={16}>
								<h3>Extended Grants:</h3>
								<Table>
									<Header>
										<Row>
											<HeaderCell>Recipient</HeaderCell>
											<HeaderCell>Description</HeaderCell>
											<HeaderCell>Amount</HeaderCell>
											<HeaderCell />
										</Row>
									</Header>
									<Body>{this.renderRow()}</Body>
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
		gtOrgs: state.gtOrgs
	};
};

export default connect(mapStateToProps, { fetchTreeDAIBalance, fetchTree, fetchTreeGrants, fetchOrgs })(TreeShow);
