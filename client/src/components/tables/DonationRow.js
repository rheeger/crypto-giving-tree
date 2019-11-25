import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Moment from 'react-moment';
import { connect } from 'react-redux';

class DonationRow extends Component {
	state = {
		approveloading: false,
		finalizeloading: false,
		errorMessage: '',
		donorName: ''
	};

	componentDidMount() {
		this.renderDonorName();
	}

	renderDonorName() {
		const { gtTrees, from } = this.props;
		console.log(from);
		return Object.values(gtTrees).map((gtTrees, key) => {
			if (from === gtTrees.managerAddress) {
				console.log('match found');
				console.log(gtTrees);
				return this.setState({
					donorName: `${gtTrees.primaryAdvisorFirstName} ${gtTrees.primaryAdvisorLastName}`
				});
			} else {
				return this.setState({ donorName: 'Unknown Donor' });
			}
		});
	}

	render() {
		const { id, finalTradeOutput, donationAmount, inputCurrency, date } = this.props;

		return (
			<Table.Row>
				<Table.Cell>
					<Moment>{date}</Moment>
				</Table.Cell>
				<Table.Cell>{this.state.donorName}</Table.Cell>
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

const mapStateToProps = (state) => {
	return {
		gtTrees: state.gtTrees
	};
};

export default connect(mapStateToProps, {})(DonationRow);
