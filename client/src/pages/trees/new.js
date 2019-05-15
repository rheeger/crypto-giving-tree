import React from 'react';
import { Link } from 'react-router-dom';

class NewTree extends React.Component {
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

					<Link to="/trees/manage" floated="right" className="ui button green">
						<i className="tree icon" />Plant Your Charity Tree
					</Link>
				</div>
			</div>
		);
	}
}

export default NewTree;
