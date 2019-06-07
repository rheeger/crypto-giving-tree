import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

class DonationRow extends Component {
	state = {
		approveloading: false,
		finalizeloading: false,
		errorMessage: ''
	};

	render() {
		const { id, from, finalTradeOutput, donationAmount, inputCurrency, date } = this.props;
		return (
			<Table.Row>
				<Table.Cell>{date}</Table.Cell>
				<Table.Cell>{from}</Table.Cell>
				<Table.Cell>
					{donationAmount} {inputCurrency}
				</Table.Cell>
				<Table.Cell>${finalTradeOutput} DAI</Table.Cell>
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

export default DonationRow;
