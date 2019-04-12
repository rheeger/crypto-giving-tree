import React, { Component } from 'react';
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign';
import { Container, Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/contribute';
import { Link } from '../../routes';

class BranchShow extends Component {
	static async getInitialProps(props) {
		const branch = Branch(props.query.address);

		const summary = await campaign.methods.getSummary().call();

		return {
			address: props.query.address,
			minimumContribution: summary[0],
			balance: summary[1],
			requestsCount: summary[2],
			approversCount: summary[3],
			manager: summary[4]
		};
	}

	renderCards() {
		const { minimumContribution, balance, requestsCount, approversCount, manager } = this.props;

		const items = [
			{
				style: { overflowWrap: 'break-word' },
				header: manager,
				meta: 'Address of Manager',
				description: 'The manager created this campaign, and can request withdrawls'
			},
			{
				header: web3.utils.fromWei(minimumContribution, 'ether'),
				meta: 'Minimum Contribution',
				description: 'Show your commmitment!'
			},
			{
				header: web3.utils.fromWei(balance, 'ether'),
				meta: 'Ether Contributed',
				description: 'Look at all dis cash homie!'
			},
			{
				header: requestsCount,
				meta: 'Vendors',
				description: 'These people are yet to get paid'
			},
			{
				header: approversCount,
				meta: 'Contributors',
				description: 'These idiots thought this was a good ideaa'
			}
		];

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
				<h3>Campaign Summary</h3>
				<Grid className="Container">
					<Grid.Row>
						<Grid.Column width={10}>{this.renderCards()}</Grid.Column>
						<Grid.Column width={3}>
							<ContributeForm address={this.props.address} />
						</Grid.Column>
					</Grid.Row>

					<Link route={`/campaigns/${this.props.address}/requests`}>
						<a>
							<Button primary>View Requests</Button>
						</a>
					</Link>
					<Link route={`/`}>
						<a>
							<Button secondary>See All</Button>
						</a>
					</Link>
				</Grid>
			</Layout>
		);
	}
}

export default BranchShow;
