import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

class GrantRow extends Component {
	state = {
		approveloading: false,
		finalizeloading: false,
		errorMessage: ''
	};

	// onApprove = async (event) => {
	// 	event.preventDefault();

	// 	const campaign = Campaign(this.props.address);

	// 	this.setState({ approveloading: true, errorMessage: '' });

	// 	try {
	// 		const accounts = await web3.eth.getAccounts();
	// 		await campaign.methods.approveRequest(this.props.id).send({
	// 			from: accounts[0]
	// 		});
	// 	} catch (err) {
	// 		this.setState({ errorMessage: err.message });
	// 	}

	// 	this.setState({ approveloading: false, errorMessage: '' });

	// 	Router.replace(`/campaigns/${this.props.address}/requests`);
	// };

	// onFinalize = async (event) => {
	// 	event.preventDefault();

	// 	const campaign = Campaign(this.props.address);

	// 	this.setState({ finalizeloading: true, errorMessage: '' });

	// 	try {
	// 		const accounts = await web3.eth.getAccounts();
	// 		await campaign.methods.finalizeRequest(this.props.id).send({
	// 			from: accounts[0]
	// 		});
	// 	} catch (err) {
	// 		this.setState({ errorMessage: err.message });
	// 	}

	// 	this.setState({ finalizeloading: false, errorMessage: '' });
	// 	Router.replace(`/campaigns/${this.props.address}/requests`);
	// };

	render() {
		const { id, recipient, amount, description } = this.props;
		return (
			<Table.Row>
				<Table.Cell>{recipient}</Table.Cell>
				<Table.Cell>{description}</Table.Cell>
				<Table.Cell>${amount} DAI</Table.Cell>
				<Table.Cell>{id}</Table.Cell>
				<Table.Cell>
					<Button color="green" basic>
						View on Etherscan
					</Button>
				</Table.Cell>
			</Table.Row>
		);
	}
}

export default GrantRow;
