import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTree, fetchTreeSummary } from '../../store/actions';
import { Button, Card, Grid } from 'semantic-ui-react';

class TreeShow extends Component {
	componentDidMount() {
		const { fetchTreeSummary, fetchTree, match } = this.props;

		// fetchTreeSummary(match.params.address);
		fetchTree(match.params.address);
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

		return (
			<div>
				<h3>Your Giving Tree</h3>
				<Grid className="Container">
					<Grid.Row>
						<Grid.Column width={10}>{this.renderCards()}</Grid.Column>
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
		);
	}
}

const mapStateToProps = (state) => {
	return { gtTrees: state.gtTrees };
};

export default connect(mapStateToProps, { fetchTreeSummary, fetchTree })(TreeShow);
