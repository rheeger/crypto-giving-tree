import React, { Component } from 'react';
import Layout from '../../components/layout';
import Tree from '../../ethereum/tree';
import { Container, Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/contribute';
import { Link } from '../../routes';

class TreeShow extends Component {
	componentDidMount() {
		const tree = Tree(props.query.address);

		const summary = tree.methods.getSummary(tree).call();

		state = {
			address: props.query.address,
			balance: summary[1],
			requestsCount: summary[2],
			approversCount: summary[3],
			manager: summary[4]
		};
	}

	renderCards() {
		const { balance, requestsCount, approversCount, manager } = this.props;

		const items = [
			{
				style: { overflowWrap: 'break-word' },
				header: manager,
				meta: 'Address of Manager',
				description: 'The manager created this campaign, and can request withdrawls'
			},
			{
				header: web3.utils.fromWei(contributionThreshold, 'ether'),
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
				meta: 'Grants',
				description: 'These people are yet to get paid'
			},
			{
				header: approversCount,
				meta: 'Grant Committee',
				description: 'Made donations above the minimum contribution'
			}
		];

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
				<h3>Your Giving Tree</h3>
				<Grid className="Container">
					<Grid.Row>
						<Grid.Column width={10}>{this.renderCards()}</Grid.Column>
						<Grid.Column width={3}>
							<ContributeForm address={this.props.address} />
						</Grid.Column>
					</Grid.Row>

					<Link route={`/trees/${this.props.address}/grants`}>
						<a>
							<Button primary>View Grants</Button>
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

export default TreeShow;
