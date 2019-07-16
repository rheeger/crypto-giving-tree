import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import { approveGrant, deleteGrant } from '../../store/actions';
import history from '../../history';

class AdminGrantRow extends Component {
	state = {
		approveloading: false,
		rejectloading: false,
		errorMessage: ''
	};

	onApprove = async () => {
		const { approveGrant, id, grantIndex, selectedTree } = this.props;
		this.setState({ approveloading: true });
		await approveGrant(id, selectedTree, grantIndex);
		this.setState({ approveloading: false });
		this.props.onSubmit();
		history.push('/admin');
	};

	onReject = async () => {
		const { deleteGrant, id } = this.props;
		this.setState({ rejectloading: true });
		await deleteGrant(id);
		this.setState({ rejectloading: false });
		history.push('/admin');
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
					<Button loading={this.state.approveloading} onClick={this.onApprove} color="green" basic>
						Approve
					</Button>
				</Table.Cell>
				<Table.Cell>
					<Button loading={this.state.rejectloading} onClick={this.onReject} color="red" basic>
						Reject
					</Button>
				</Table.Cell>
			</Table.Row>
		);
	}
}

export default connect(null, { approveGrant, deleteGrant })(AdminGrantRow);
