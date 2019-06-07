import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class GrantRow extends Component {
	state = {
		approveloading: false,
		finalizeloading: false,
		errorMessage: ''
	};

	render() {
		const { id, recipient, amount, description, date } = this.props;
		return (
			<Table.Row>
				<Table.Cell>{date}</Table.Cell>
				<Table.Cell>
					<Link to={`/orgs/${recipient}`}>{recipient} </Link>
				</Table.Cell>
				<Table.Cell>{description}</Table.Cell>
				<Table.Cell>${amount} DAI</Table.Cell>
				<Table.Cell>
					<a href={`http://rinkeby.etherscan.io/tx/${id}`} target="blank">
						<Button color="green" basic>
							View on Etherscan
						</Button>
					</a>
				</Table.Cell>
			</Table.Row>
		);
	}
}

export default GrantRow;
