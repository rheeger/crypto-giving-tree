import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import { approveGrant } from '../../store/actions';

class AdminGrantRow extends Component {
	state = {
		approveloading: false,
		finalizeloading: false,
		errorMessage: ''
	};

	onApprove = async () => {
		const { approveGrant, id, grantIndex, selectedTree } = this.props;

		approveGrant(id, selectedTree, grantIndex);
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
						<Button color="blue" basic>
							View on Etherscan
						</Button>
					</a>
				</Table.Cell>
				<Table.Cell>
					<Button onClick={this.onApprove} color="green" basic>
						Approve
					</Button>
				</Table.Cell>
				<Table.Cell>
					<Button color="red" basic>
						Reject
					</Button>
				</Table.Cell>
			</Table.Row>
		);
	}
}

export default connect(null, { approveGrant })(AdminGrantRow);
