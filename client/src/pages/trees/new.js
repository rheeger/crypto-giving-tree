import React from 'react';
import { connect } from 'react-redux';
import { plantTreeAndContract, fetchTrees } from '../../store/actions';
import { Button } from 'semantic-ui-react';
import BranchForm from '../../components/BranchForm';

class NewTree extends React.Component {
	onSubmit = (formValues) => {
		this.props.plantTreeAndContract(formValues);
	};

	renderTreeForm() {
		return (
			<div
				style={{
					margin: '0px auto',
					textAlign: 'left',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: 'auto',
					maxWidth: '700px'
				}}
			>
				<div>
					<h1>Plant a Charity Tree:</h1>

					<BranchForm onSubmit={this.onSubmit} />
				</div>
			</div>
		);
	}

	render() {
		return (
			<div
				style={{
					margin: '0px auto',
					textAlign: 'left',
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'center',
					height: '75vh',
					maxWidth: '350px'
				}}
			>
				<div>
					<h1>Getting Started:</h1>
					<p>some things to know...</p>
					<h3>1. Each Charity Tree is functionally equivalent to a Donor Advised Fund.</h3>
					<h3>
						2. You can easily contribute ERC-20 tokens to your Tree. The Charity Tree supports all tokens
						with Uniswap Exchange Contracts.
					</h3>
					<h3>
						3. Donated tokens are exchanged for DAI. Use the DAI to reccomend grants to any qualifyiing
						501(c)(3) at your own pace.
					</h3>
					<br />

					<Button floated="right" className="ui button green" onClick={this.renderTreeForm()}>
						<i className="tree icon" />Plant Your Charity Tree
					</Button>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		web3connect: state.web3connect,
		gtTrees: Object.values(state.gtTrees)
	};
};
export default connect(mapStateToProps, { plantTreeAndContract, fetchTrees })(NewTree);
