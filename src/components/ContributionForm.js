import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributionForm extends Component {
	state = {
		value: '',
		errorMessage: '',
		loading: false
	};

	onSubmit = async (event) => {
		event.preventDefault();

		const campaign = Campaign(this.props.address);

		this.setState({ loading: true, errorMessage: '' });

		try {
			const accounts = await web3.eth.getAccounts();

			await campaign.methods.contribute().send({
				from: accounts[0],
				value: web3.utils.toWei(this.state.value, 'ether')
			});

			Router.replaceRoute(`/campaigns/${this.props.address}`);
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false, value: '' });
	};

	getSendType(inputCurrency, outputCurrency) {
		if (!inputCurrency || !outputCurrency) {
			return;
		}

		if (inputCurrency === outputCurrency) {
			return;
		}

		if (inputCurrency !== 'ETH' && outputCurrency !== 'ETH') {
			return 'TOKEN_TO_TOKEN';
		}

		if (inputCurrency === 'ETH') {
			return 'ETH_TO_TOKEN';
		}

		return;
	}

	onSend = async () => {
		const { exchangeAddresses: { fromToken }, account, web3, selectors, addPendingTx } = this.props;
		const {
			inputValue,
			outputValue,
			inputCurrency,
			outputCurrency,
			inputAmountB,
			lastEditedField,
			recipient
		} = this.state;
		const ALLOWED_SLIPPAGE = 0.025;
		const TOKEN_ALLOWED_SLIPPAGE = 0.04;

		const type = getSendType(inputCurrency, outputCurrency);
		const { decimals: inputDecimals } = selectors().getBalance(account, inputCurrency);
		const { decimals: outputDecimals } = selectors().getBalance(account, outputCurrency);
		let deadline;
		try {
			deadline = await retry(() => getBlockDeadline(web3, 600));
		} catch (e) {
			// TODO: Handle error.
			return;
		}

		if (lastEditedField === INPUT) {
			ReactGA.event({
				category: type,
				action: 'TransferInput'
			});
			// send input
			switch (type) {
				case 'ETH_TO_TOKEN':
					new web3.eth.Contract(EXCHANGE_ABI, fromToken[outputCurrency]).methods
						.ethToTokenTransferInput(
							BN(outputValue)
								.multipliedBy(10 ** outputDecimals)
								.multipliedBy(1 - ALLOWED_SLIPPAGE)
								.toFixed(0),
							deadline,
							recipient
						)
						.send(
							{
								from: account,
								value: BN(inputValue).multipliedBy(10 ** 18).toFixed(0)
							},
							(err, data) => {
								if (!err) {
									addPendingTx(data);
									this.reset();
								}
							}
						);
					break;
				case 'TOKEN_TO_TOKEN':
					new web3.eth.Contract(EXCHANGE_ABI, fromToken[inputCurrency]).methods
						.tokenToTokenTransferInput(
							BN(inputValue).multipliedBy(10 ** inputDecimals).toFixed(0),
							BN(outputValue)
								.multipliedBy(10 ** outputDecimals)
								.multipliedBy(1 - TOKEN_ALLOWED_SLIPPAGE)
								.toFixed(0),
							'1',
							deadline,
							recipient,
							outputCurrency
						)
						.send({ from: account }, (err, data) => {
							if (!err) {
								addPendingTx(data);
								this.reset();
							}
						});
					break;
				default:
					break;
			}
		}

		if (lastEditedField === OUTPUT) {
			// send output
			ReactGA.event({
				category: type,
				action: 'TransferOutput'
			});
			switch (type) {
				case 'ETH_TO_TOKEN':
					new web3.eth.Contract(EXCHANGE_ABI, fromToken[outputCurrency]).methods
						.ethToTokenTransferOutput(
							BN(outputValue).multipliedBy(10 ** outputDecimals).toFixed(0),
							deadline,
							recipient
						)
						.send(
							{
								from: account,
								value: BN(inputValue)
									.multipliedBy(10 ** inputDecimals)
									.multipliedBy(1 + ALLOWED_SLIPPAGE)
									.toFixed(0)
							},
							(err, data) => {
								if (!err) {
									addPendingTx(data);
									this.reset();
								}
							}
						);
					break;
				case 'TOKEN_TO_TOKEN':
					if (!inputAmountB) {
						return;
					}

					new web3.eth.Contract(EXCHANGE_ABI, fromToken[inputCurrency]).methods
						.tokenToTokenTransferOutput(
							BN(outputValue).multipliedBy(10 ** outputDecimals).toFixed(0),
							BN(inputValue)
								.multipliedBy(10 ** inputDecimals)
								.multipliedBy(1 + TOKEN_ALLOWED_SLIPPAGE)
								.toFixed(0),
							inputAmountB.multipliedBy(1.2).toFixed(0),
							deadline,
							recipient,
							outputCurrency
						)
						.send({ from: account }, (err, data) => {
							if (!err) {
								addPendingTx(data);
								this.reset();
							}
						});
					break;
				default:
					break;
			}
		}
	};

	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Field>
					<h4>Contribute:</h4>
					<Input
						value={this.state.value}
						onChange={(event) => this.setState({ value: event.target.value })}
						label="ether"
						labelPosition="right"
					/>
				</Form.Field>
				<Message error header="Ooops!" content={this.state.errorMessage} />
				<Button primary loading={this.state.loading}>
					Contribute!
				</Button>
			</Form>
		);
	}
}

export default ContributionForm;
