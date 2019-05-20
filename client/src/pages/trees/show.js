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
								<h3>Tree Balance:</h3>
								<div>${this.props.gtTrees[this.props.match.params.address].treeDAI}</div>
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
