import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { BigNumber as BN } from 'bignumber.js';
import { Button } from 'semantic-ui-react';
import { startWatching, initialize, selectors, addPendingTx } from '../../store/reducers/web3connect';
import { setAddresses } from '../../store/reducers/swapAddresses';
import { withTranslation } from 'react-i18next';
import AddressInputPanel from '../uniSwap/AddressInputPanel';
import CurrencyInputPanel from '../uniSwap/CurrencyInputPanel';
import ContextualInfo from '../uniSwap/ContextualInfo';
import OversizedPanel from '../uniSwap/OversizedPanel';
import { getBlockDeadline } from '../../helpers/web3-utils';
import { retry } from '../../helpers/promise-utils';
import EXCHANGE_ABI from '../../ethereum/uniSwap/abi/exchange';

import './contributionForm.scss';

const INPUT = 0;
const OUTPUT = 1;

class Send extends Component {
	static propTypes = {
		account: PropTypes.string,
		isConnected: PropTypes.bool.isRequired,
		selectors: PropTypes.func.isRequired,
		web3: PropTypes.object.isRequired
	};

	state = {
		inputValue: '',
		outputValue: '',
		inputCurrency: 'ETH',
		outputCurrency: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
		inputAmountB: '',
		lastEditedField: '',
		recipient: ''
	};

	componentDidMount() {
		console.log(this.props);
		this.setState({ outputCurrency: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359' });
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	reset() {
		this.setState({
			inputValue: '',
			outputValue: '',
			inputAmountB: '',
			lastEditedField: '',
			recipient: '',
			outputCurrency: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359'
		});
	}

	componentWillReceiveProps() {
		this.recalcForm();
	}

	validate() {
		const { selectors, account, web3 } = this.props;
		const { inputValue, outputValue, inputCurrency, outputCurrency, recipient } = this.state;

		let inputError = '';
		let outputError = '';
		let isValid = true;
		const validRecipientAddress = web3 && web3.utils.isAddress(recipient);
		const inputIsZero = BN(inputValue).isZero();
		const outputIsZero = BN(outputValue).isZero();

		if (
			!inputValue ||
			inputIsZero ||
			!outputValue ||
			outputIsZero ||
			!inputCurrency ||
			!outputCurrency ||
			!recipient ||
			this.isUnapproved() ||
			!validRecipientAddress
		) {
			isValid = false;
		}

		const { value: inputBalance, decimals: inputDecimals } = selectors().getBalance(account, inputCurrency);

		if (inputBalance.isLessThan(BN(inputValue * 10 ** inputDecimals))) {
			inputError = this.props.t('insufficientBalance');
		}

		if (inputValue === 'N/A') {
			inputError = this.props.t('inputNotValid');
		}

		return {
			inputError,
			outputError,
			isValid: isValid && !inputError && !outputError
		};
	}

	flipInputOutput = () => {
		const { state } = this;
		this.setState(
			{
				inputValue: state.outputValue,
				outputValue: state.inputValue,
				inputCurrency: state.outputCurrency,
				outputCurrency: state.inputCurrency,
				lastEditedField: state.lastEditedField === INPUT ? OUTPUT : INPUT
			},
			() => this.recalcForm()
		);
	};

	isUnapproved() {
		const { account, exchangeAddresses, selectors } = this.props;
		const { inputCurrency, inputValue } = this.state;

		if (!inputCurrency || inputCurrency === 'ETH') {
			return false;
		}

		const { value: allowance, label, decimals } = selectors().getApprovals(
			inputCurrency,
			account,
			exchangeAddresses.fromToken[inputCurrency]
		);

		if (label && allowance.isLessThan(BN(inputValue * 10 ** decimals || 0))) {
			return true;
		}

		return false;
	}

	recalcForm() {
		const { inputCurrency, outputCurrency, lastEditedField } = this.state;

		if (!inputCurrency || !outputCurrency) {
			return;
		}

		const editedValue = lastEditedField === INPUT ? this.state.inputValue : this.state.outputValue;

		if (BN(editedValue).isZero()) {
			return;
		}

		if (inputCurrency === outputCurrency) {
			this.setState({
				inputValue: '',
				outputValue: ''
			});
			return;
		}

		if (inputCurrency !== 'ETH' && outputCurrency !== 'ETH') {
			this.recalcTokenTokenForm();
			return;
		}

		this.recalcEthTokenForm();
	}

	recalcTokenTokenForm = () => {
		const { exchangeAddresses: { fromToken }, selectors } = this.props;

		const {
			inputValue: oldInputValue,
			outputValue: oldOutputValue,
			inputCurrency,
			outputCurrency,
			lastEditedField,
			exchangeRate: oldExchangeRate,
			inputAmountB: oldInputAmountB
		} = this.state;

		const exchangeAddressA = fromToken[inputCurrency];
		const exchangeAddressB = fromToken[outputCurrency];

		const { value: inputReserveA, decimals: inputDecimalsA } = selectors().getBalance(
			exchangeAddressA,
			inputCurrency
		);
		const { value: outputReserveA } = selectors().getBalance(exchangeAddressA, 'ETH');
		const { value: inputReserveB } = selectors().getBalance(exchangeAddressB, 'ETH');
		const { value: outputReserveB, decimals: outputDecimalsB } = selectors().getBalance(
			exchangeAddressB,
			outputCurrency
		);

		if (lastEditedField === INPUT) {
			if (!oldInputValue) {
				return this.setState({
					outputValue: '',
					exchangeRate: BN(0)
				});
			}

			const inputAmountA = BN(oldInputValue).multipliedBy(10 ** inputDecimalsA);
			const outputAmountA = calculateEtherTokenOutput({
				inputAmount: inputAmountA,
				inputReserve: inputReserveA,
				outputReserve: outputReserveA
			});
			// Redundant Variable for readability of the formala
			// OutputAmount from the first send becomes InputAmount of the second send
			const inputAmountB = outputAmountA;
			const outputAmountB = calculateEtherTokenOutput({
				inputAmount: inputAmountB,
				inputReserve: inputReserveB,
				outputReserve: outputReserveB
			});

			const outputValue = outputAmountB.dividedBy(BN(10 ** outputDecimalsB)).toFixed(2).toLocaleString('en');
			const exchangeRate = BN(outputValue).dividedBy(BN(oldInputValue));

			const appendState = {};

			if (!exchangeRate.isEqualTo(BN(oldExchangeRate))) {
				appendState.exchangeRate = exchangeRate;
			}

			if (outputValue !== oldOutputValue) {
				appendState.outputValue = outputValue;
			}

			this.setState(appendState);
		}

		if (lastEditedField === OUTPUT) {
			if (!oldOutputValue) {
				return this.setState({
					inputValue: '',
					exchangeRate: BN(0)
				});
			}

			const outputAmountB = BN(oldOutputValue).multipliedBy(10 ** outputDecimalsB);
			const inputAmountB = calculateEtherTokenInput({
				outputAmount: outputAmountB,
				inputReserve: inputReserveB,
				outputReserve: outputReserveB
			});

			// Redundant Variable for readability of the formala
			// InputAmount from the first send becomes OutputAmount of the second send
			const outputAmountA = inputAmountB;
			const inputAmountA = calculateEtherTokenInput({
				outputAmount: outputAmountA,
				inputReserve: inputReserveA,
				outputReserve: outputReserveA
			});

			const inputValue = inputAmountA.isNegative()
				? 'N/A'
				: inputAmountA.dividedBy(BN(10 ** inputDecimalsA)).toFixed(7);
			const exchangeRate = BN(oldOutputValue).dividedBy(BN(inputValue));

			const appendState = {};

			if (!exchangeRate.isEqualTo(BN(oldExchangeRate))) {
				appendState.exchangeRate = exchangeRate;
			}

			if (inputValue !== oldInputValue) {
				appendState.inputValue = inputValue;
			}

			if (!inputAmountB.isEqualTo(BN(oldInputAmountB))) {
				appendState.inputAmountB = inputAmountB;
			}

			this.setState(appendState);
		}
	};

	recalcEthTokenForm = () => {
		const { exchangeAddresses: { fromToken }, selectors } = this.props;

		const {
			inputValue: oldInputValue,
			outputValue: oldOutputValue,
			inputCurrency,
			outputCurrency,
			lastEditedField,
			exchangeRate: oldExchangeRate
		} = this.state;

		const tokenAddress = [ inputCurrency, outputCurrency ].filter((currency) => currency !== 'ETH')[0];
		const exchangeAddress = fromToken[tokenAddress];
		if (!exchangeAddress) {
			return;
		}
		const { value: inputReserve, decimals: inputDecimals } = selectors().getBalance(exchangeAddress, inputCurrency);
		const { value: outputReserve, decimals: outputDecimals } = selectors().getBalance(
			exchangeAddress,
			outputCurrency
		);

		if (lastEditedField === INPUT) {
			if (!oldInputValue) {
				return this.setState({
					outputValue: '',
					exchangeRate: BN(0)
				});
			}

			const inputAmount = BN(oldInputValue).multipliedBy(10 ** inputDecimals);
			const outputAmount = calculateEtherTokenOutput({ inputAmount, inputReserve, outputReserve });
			const outputValue = outputAmount.dividedBy(BN(10 ** outputDecimals)).toFixed(2).toLocaleString('en');
			const exchangeRate = BN(outputValue).dividedBy(BN(oldInputValue));

			const appendState = {};

			if (!exchangeRate.isEqualTo(BN(oldExchangeRate))) {
				appendState.exchangeRate = exchangeRate;
			}

			if (outputValue !== oldOutputValue) {
				appendState.outputValue = outputValue;
			}

			this.setState(appendState);
		} else if (lastEditedField === OUTPUT) {
			if (!oldOutputValue) {
				return this.setState({
					inputValue: '',
					exchangeRate: BN(0)
				});
			}

			const outputAmount = BN(oldOutputValue).multipliedBy(10 ** outputDecimals);
			const inputAmount = calculateEtherTokenInput({ outputAmount, inputReserve, outputReserve });
			const inputValue = inputAmount.isNegative()
				? 'N/A'
				: inputAmount.dividedBy(BN(10 ** inputDecimals)).toFixed(7);
			const exchangeRate = BN(oldOutputValue).dividedBy(BN(inputValue));

			const appendState = {};

			if (!exchangeRate.isEqualTo(BN(oldExchangeRate))) {
				appendState.exchangeRate = exchangeRate;
			}

			if (inputValue !== oldInputValue) {
				appendState.inputValue = inputValue;
			}

			this.setState(appendState);
		}
	};

	updateInput = (amount) => {
		this.setState(
			{
				inputValue: amount,
				lastEditedField: INPUT
			},
			this.recalcForm
		);
	};

	updateOutput = (amount) => {
		this.setState(
			{
				outputValue: amount,
				lastEditedField: OUTPUT
			},
			this.recalcForm
		);
	};

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
				case 'TOKEN_TO_ETH':
					new web3.eth.Contract(EXCHANGE_ABI, fromToken[inputCurrency]).methods
						.tokenToEthTransferInput(
							BN(inputValue).multipliedBy(10 ** inputDecimals).toFixed(0),
							BN(outputValue)
								.multipliedBy(10 ** outputDecimals)
								.multipliedBy(1 - ALLOWED_SLIPPAGE)
								.toFixed(0),
							deadline,
							recipient
						)
						.send({ from: account }, (err, data) => {
							if (!err) {
								addPendingTx(data);
								this.reset();
							}
						});
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
				case 'TOKEN_TO_ETH':
					new web3.eth.Contract(EXCHANGE_ABI, fromToken[inputCurrency]).methods
						.tokenToEthTransferOutput(
							BN(outputValue).multipliedBy(10 ** outputDecimals).toFixed(0),
							BN(inputValue)
								.multipliedBy(10 ** inputDecimals)
								.multipliedBy(1 + ALLOWED_SLIPPAGE)
								.toFixed(0),
							deadline,
							recipient
						)
						.send({ from: account }, (err, data) => {
							if (!err) {
								addPendingTx(data);
								this.reset();
							}
						});
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

	renderSummary(inputError, outputError) {
		const { inputValue, inputCurrency, outputValue, outputCurrency, recipient } = this.state;
		const { t, web3 } = this.props;

		const { selectors, account } = this.props;
		const { label: inputLabel } = selectors().getBalance(account, inputCurrency);
		const { label: outputLabel } = selectors().getBalance(account, outputCurrency);
		const validRecipientAddress = web3 && web3.utils.isAddress(recipient);
		const inputIsZero = BN(inputValue).isZero();
		const outputIsZero = BN(outputValue).isZero();

		let contextualInfo = '';
		let isError = false;

		if (inputError || outputError) {
			contextualInfo = inputError || outputError;
			isError = true;
		} else if (!inputCurrency || !outputCurrency) {
			contextualInfo = t('selectTokenCont');
		} else if (inputCurrency === outputCurrency) {
			contextualInfo = t('differentToken');
		} else if (!inputValue || !outputValue) {
			const missingCurrencyValue = !inputValue ? inputLabel : outputLabel;
			contextualInfo = t('enter a donation amount', { missingCurrencyValue });
			isError = true;
		} else if (inputIsZero || outputIsZero) {
			contextualInfo = t('noLiquidity');
		} else if (this.isUnapproved()) {
			contextualInfo = t('unlockTokenCont');
		} else if (!recipient) {
			contextualInfo = t('noRecipient');
		} else if (!validRecipientAddress) {
			contextualInfo = t('invalidRecipient');
		}

		return (
			<ContextualInfo
				openDetailsText={t('transactionDetails')}
				closeDetailsText={t('hideDetails')}
				contextualInfo={contextualInfo}
				isError={isError}
				renderTransactionDetails={this.renderTransactionDetails}
			/>
		);
	}

	renderTransactionDetails = () => {
		const { inputValue, inputCurrency, outputValue, outputCurrency, recipient, lastEditedField } = this.state;
		const { t, selectors, account } = this.props;

		const ALLOWED_SLIPPAGE = 0.025;
		const TOKEN_ALLOWED_SLIPPAGE = 0.04;

		const type = getSendType(inputCurrency, outputCurrency);
		const { label: inputLabel } = selectors().getBalance(account, inputCurrency);
		const { label: outputLabel } = selectors().getBalance(account, outputCurrency);

		// const label = lastEditedField === INPUT ? outputLabel : inputLabel;
		let minOutput;
		let maxInput;

		if (lastEditedField === INPUT) {
			switch (type) {
				case 'ETH_TO_TOKEN':
					minOutput = BN(outputValue).multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(7);
					break;
				case 'TOKEN_TO_ETH':
					minOutput = BN(outputValue).multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(7);
					break;
				case 'TOKEN_TO_TOKEN':
					minOutput = BN(outputValue).multipliedBy(1 - TOKEN_ALLOWED_SLIPPAGE).toFixed(7);
					break;
				default:
					break;
			}
		}

		if (lastEditedField === OUTPUT) {
			switch (type) {
				case 'ETH_TO_TOKEN':
					maxInput = BN(inputValue).multipliedBy(1 + ALLOWED_SLIPPAGE).toFixed(7);
					break;
				case 'TOKEN_TO_ETH':
					maxInput = BN(inputValue).multipliedBy(1 + ALLOWED_SLIPPAGE).toFixed(7);
					break;
				case 'TOKEN_TO_TOKEN':
					maxInput = BN(inputValue).multipliedBy(1 + TOKEN_ALLOWED_SLIPPAGE).toFixed(7);
					break;
				default:
					break;
			}
		}

		const recipientText = b(`${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
		if (lastEditedField === INPUT) {
			return (
				<div>
					<div>
						{t('youAreSending')} {b(`${+inputValue} ${inputLabel}`)}.
					</div>
					<div className="send__last-summary-text">
						{recipientText} {t('willReceive')} {b(`${+minOutput} ${outputLabel}`)} {t('orTransFail')}
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div>
						{t('youAreSending')} {b(`${+outputValue} ${outputLabel}`)} {t('to')} {recipientText}.
						{/*You are selling between {b(`${+inputValue} ${inputLabel}`)} to {b(`${+maxInput} ${inputLabel}`)}.*/}
					</div>
					<div className="send__last-summary-text">
						{/*{b(`${recipient.slice(0, 6)}...${recipient.slice(-4)}`)} will receive {b(`${+outputValue} ${outputLabel}`)}.*/}
						{t('itWillCost')} {b(`${+maxInput} ${inputLabel}`)} {t('orTransFail')}
					</div>
				</div>
			);
		}
	};

	renderExchangeRate() {
		const { t, account, selectors } = this.props;
		const { exchangeRate, inputCurrency, outputCurrency } = this.state;
		const { label: inputLabel } = selectors().getBalance(account, inputCurrency);
		const { label: outputLabel } = selectors().getBalance(account, outputCurrency);

		if (!exchangeRate || exchangeRate.isNaN() || !inputCurrency || !outputCurrency) {
			return (
				<OversizedPanel hideBottom>
					<div className="swap__exchange-rate-wrapper" style={{ margin: '2.5px', padding: '10px' }}>
						<span className="swap__exchange-rate">{t(' ')}</span>
					</div>
				</OversizedPanel>
			);
		}

		return (
			<OversizedPanel hideBottom>
				<div className="swap__exchange-rate-wrapper" style={{ margin: '2.5px', padding: '10px' }}>
					<span className="swap__exchange-rate">{t(' ')}</span>
					<span>{`${inputLabel} = ${exchangeRate.toFixed(7)} ${outputLabel}`}</span>
				</div>
			</OversizedPanel>
		);
	}

	renderDonateButton() {
		const { isValid } = this.validate();
		const { outputValue } = this.state;

		if (!outputValue) {
			return (
				<Button
					className={classnames('primary centered', {
						inactive: !this.props.isConnected
					})}
					disabled={!isValid}
					onClick={this.onSend}
				>
					Donate
				</Button>
			);
		}

		return (
			<Button
				className={classnames('primary centered', {
					inactive: !this.props.isConnected
				})}
				disabled={!isValid}
				onClick={this.onSend}
			>
				Donate ~${outputValue.toLocaleString('en')}
			</Button>
		);
	}

	renderBalance(currency, balance, decimals) {
		if (!currency || decimals === 0) {
			return '';
		}
		const balanceInput = balance.dividedBy(BN(10 ** decimals)).toFixed(4);
		return this.props.t('balance', { balanceInput });
	}

	render() {
		if (!this.props.org.organization) {
			return <div>Loading Organization Details</div>;
		}
		const { t, selectors, account } = this.props;
		const { lastEditedField, inputCurrency, outputCurrency, inputValue, outputValue, recipient } = this.state;
		const estimatedText = `(${t('estimated')})`;

		const { value: inputBalance, decimals: inputDecimals } = selectors().getBalance(account, inputCurrency);
		const { value: outputBalance, decimals: outputDecimals } = selectors().getBalance(account, outputCurrency);
		const { inputError, outputError } = this.validate();

		return (
			<div className="send">
				<div
					className={classnames('swap__content', {
						'swap--inactive': !this.props.isConnected
					})}
				>
					<CurrencyInputPanel
						title={t('tokens to be donated:')}
						description={lastEditedField === OUTPUT ? estimatedText : ''}
						extraText={this.renderBalance(inputCurrency, inputBalance, inputDecimals)}
						onCurrencySelected={(inputCurrency) => this.setState({ inputCurrency }, this.recalcForm)}
						onValueChange={this.updateInput}
						selectedTokens={[ inputCurrency, outputCurrency ]}
						selectedTokenAddress={inputCurrency}
						value={inputValue}
						errorMessage={inputError}
					/>
					<OversizedPanel>
						<div className="swap__down-arrow-background" style={{ margin: '0 auto', padding: '10px' }}>
							<div>
								<i className="arrow down small icon" />equivalent to{' '}
								<i className="arrow down small icon" />
							</div>
						</div>
					</OversizedPanel>
					<CurrencyInputPanel
						disableTokenSelect="true"
						title={t('dollar value:')}
						description={lastEditedField === INPUT ? estimatedText : ''}
						extraText={this.renderBalance(outputCurrency, outputBalance, outputDecimals)}
						onValueChange={this.updateOutput}
						selectedTokens={[ inputCurrency, outputCurrency ]}
						value={outputValue.toLocaleString('en')}
						selectedTokenAddress="0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"
						errorMessage={outputError}
						disableUnlock
					/>
					<OversizedPanel>
						<div className="swap__down-arrow-background" style={{ margin: '0 auto', padding: '10px' }}>
							<div>
								<i className="arrow down small icon" />will be sent to{' '}
								<i className="arrow down small icon" />
							</div>
						</div>
					</OversizedPanel>
					<AddressInputPanel
						disabled
						t={this.props.t}
						value={recipient}
						onChange={(address) => this.setState({ recipient: address })}
					/>

					{this.renderExchangeRate()}
					{this.renderSummary(inputError, outputError)}

					<div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
						{this.renderDonateButton()}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		org: state.org,
		balances: state.web3connect.balances,
		isConnected:
			!!state.web3connect.account && state.web3connect.networkId === (process.env.REACT_APP_NETWORK_ID || 1),
		account: state.web3connect.account,
		web3: state.web3connect.web3,
		exchangeAddresses: state.addresses.exchangeAddresses
	};
};

export default connect(mapStateToProps, (dispatch) => ({
	setAddresses: (networkId) => dispatch(setAddresses(networkId)),
	initialize: () => dispatch(initialize()),
	startWatching: () => dispatch(startWatching()),
	selectors: () => dispatch(selectors()),
	addPendingTx: (id) => dispatch(addPendingTx(id))
}))(withTranslation()(Send));

const b = (text) => <span className="swap__highlight-text">{text}</span>;

function calculateEtherTokenOutput({
	inputAmount: rawInput,
	inputReserve: rawReserveIn,
	outputReserve: rawReserveOut
}) {
	const inputAmount = BN(rawInput);
	const inputReserve = BN(rawReserveIn);
	const outputReserve = BN(rawReserveOut);

	if (inputAmount.isLessThan(BN(10 ** 9))) {
		console.warn(`inputAmount is only ${inputAmount.toFixed(0)}. Did you forget to multiply by 10 ** decimals?`);
	}

	const numerator = inputAmount.multipliedBy(outputReserve).multipliedBy(997);
	const denominator = inputReserve.multipliedBy(1000).plus(inputAmount.multipliedBy(997));

	return numerator.dividedBy(denominator);
}

function calculateEtherTokenInput({
	outputAmount: rawOutput,
	inputReserve: rawReserveIn,
	outputReserve: rawReserveOut
}) {
	const outputAmount = BN(rawOutput);
	const inputReserve = BN(rawReserveIn);
	const outputReserve = BN(rawReserveOut);

	if (outputAmount.isLessThan(BN(10 ** 9))) {
		console.warn(`inputAmount is only ${outputAmount.toFixed(0)}. Did you forget to multiply by 10 ** decimals?`);
	}

	const numerator = outputAmount.multipliedBy(inputReserve).multipliedBy(1000);
	const denominator = outputReserve.minus(outputAmount).multipliedBy(997);
	return numerator.dividedBy(denominator).plus(1);
}

function getSendType(inputCurrency, outputCurrency) {
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

	if (outputCurrency === 'ETH') {
		return 'TOKEN_TO_ETH';
	}

	return;
}