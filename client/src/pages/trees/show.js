import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTree, fetchTreeDAIBalance } from '../../store/actions';
import { Button, Card, Grid } from 'semantic-ui-react';
import ContributionForm from '../../components/ContributionForm';
import ERC20 from '../../ethereum/uniSwap/abi/erc20';

class TreeShow extends Component {
	componentWillMount = () => {
		const { fetchTreeDAIBalance, fetchTree, match } = this.props;

		fetchTreeDAIBalance(match.params.address);
		fetchTree(match.params.address);
		// this.getTreeDAIBalance(match.params.address);
	};

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
				meta: 'Planted' + creationDate,
				description: 'Tree Overview'
			},
			{
				style: { overflowWrap: 'break-word' },
				header: id,
				meta: 'Contract Address',
				description: 'Managed by:' + managerAddress
			},
			{
				style: { overflowWrap: 'break-word' },
				header: primaryAdvisorFirstName + ' ' + primaryAdvisorLastName,
				meta: 'Primary Tree Manager',
				description: 'e-Mail:' + primaryAdvisorEmail
			},
			{
				header: primaryAdvisorAddress,
				description: primaryAdvisorCity + ', ' + primaryAdvisorState + ' ' + primaryAdvisorZip
			}
		];

		return <Card.Group items={items} />;
	}

	render() {
		if (!this.props.gtTrees[this.props.match.params.address]) {
			return <div> Loading... </div>;
		}
		if (this.props.web3 === 'null') {
			return <div> Loading... </div>;
		}

		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div style={{ maxWidth: '600px' }}>
					<Grid className="Container">
						<Grid.Row>
							<Grid.Column width={10}>
								<h3>Your Giving Tree:</h3>
								{this.renderCards()}
							</Grid.Column>

							<Grid.Column width={6}>
								<h3>Contribute Funds:</h3>
								<ContributionForm recievingTree={this.props.match.params.address} />
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
		web3: state.web3connect.web3
	};
};

export default connect(mapStateToProps, { fetchTreeDAIBalance, fetchTree })(TreeShow);
