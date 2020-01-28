import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { BigNumber as BN } from 'bignumber.js';
import { Button } from 'semantic-ui-react';
import { startWatching, initialize, selectors, addPendingTx } from '../../store/reducers/web3connect';
import { setAddresses } from '../../store/reducers/swapAddresses';
import AddressInputPanel from '../uniSwap/AddressInputPanel';
import CurrencyInputPanel from '../uniSwap/CurrencyInputPanel';
import ContextualInfo from '../uniSwap/ContextualInfo';
import OversizedPanel from '../uniSwap/OversizedPanel';
import { getBlockDeadline } from '../../helpers/web3-utils';
import { retry } from '../../helpers/promise-utils';
import EXCHANGE_ABI from '../../ethereum/uniSwap/abi/exchange';
import ERC20_ABI from '../../ethereum/uniSwap/abi/erc20';
import './contributionForm.scss';
import { fetchFundDAIBalance } from '../../store/actions/funds';
import { updateNCStatus } from '../../store/actions/ncStatus';
import { createDonation } from '../../store/actions/donations';
import logo from '../../assets/images/uniswap.png';
import  { AdminWeb3Wallet,getAdminWalletPendingNonce } from '../../ethereum/adminWeb3Wallet';

const INPUT = 0;
const OUTPUT = 1;

class Send extends Component {
	static propTypes = {
		account: PropTypes.string,
		isConnected: PropTypes.bool.isRequired,
		selectors: PropTypes.func.isRequired
		// web3: PropTypes.object.isRequired
	};

	state = {
		inputValue: '',
		outputValue: '',
		inputCurrency: 'ETH',
		outputCurrency: process.env.REACT_APP_STABLECOIN_ADDRESS,
		inputAmountB: '',
		lastEditedField: '',
		recipient: this.props.recievingFund,
		loading: false,
		tncconsent: false
	};

	componentDidMount() {
		this.setState({ outputCurrency: process.env.REACT_APP_STABLECOIN_ADDRESS });
		this.setState({ recipient: this.props.recievingFund });
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
			recipient: this.props.recievingFund,
			outputCurrency: process.env.REACT_APP_STABLECOIN_ADDRESS,
			loading: false,
			tncconsent: false
		});
	}

	UNSAFE_componentWillReceiveProps() {
		this.recalcForm();
	}

	validate() {
		const { selectors, account, web3 } = this.props;
		const { inputValue, outputValue, inputCurrency, outputCurrency, recipient, tncconsent } = this.state;

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
			!validRecipientAddress ||
			!tncconsent
		) {
			isValid = false;
		}

		const { value: inputBalance, decimals: inputDecimals } = selectors().getBalance(account, inputCurrency);

		if (inputBalance.isLessThan(BN(inputValue * (10 ** inputDecimals)))) {
			inputError = 'insufficientBalance'
		}

		if (inputValue && !tncconsent) {
			inputError = 'please review and accept terms'
			outputError = 'please review and accept terms'
		}

		if (inputValue === 'N/A') {
			inputError = 'inputNotValid';
		}

		return {
			inputError,
			outputError,
			isValid: isValid && !inputError && !outputError
		};
	}

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

		if (label && allowance.isLessThan(BN(inputValue * (10 ** decimals) || 0))) {
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

		const tokenAddress = [inputCurrency, outputCurrency].filter((currency) => currency !== 'ETH')[0];
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

	renderStatusChange = async (headline, message, status) => {
		const {updateNCStatus} = this.props;
		await updateNCStatus(headline, message, status);
		return 
	}

	onContribution = async () => {
		const { web3, account, selectors, addPendingTx } = this.props;
		const { inputValue, inputCurrency, outputCurrency } = this.state;
		const { decimals: inputDecimals } = selectors().getBalance(account, inputCurrency);
		const type = getSendType(inputCurrency, outputCurrency);

		switch (type) {
			case 'ETH_TO_TOKEN':
				await new web3.eth.sendTransaction({
					from: account,
					to: process.env.REACT_APP_GT_ADMIN,
					value: BN(inputValue).multipliedBy(10 ** 18).toFixed()
				},	(err, data) => {
					if (!err) {
						addPendingTx(data);
					}
				}).on('transactionHash', async (hash) => {
					console.log(hash);
					await this.renderStatusChange('Step 2 of 3: Processing Contribution', 'Please do not refresh this page.', 'pending')
				}).on('error', async (error) =>{
					await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
					this.setState({loading: false})
						this.reset()
				});
				break;
			case 'TOKEN_TO_TOKEN':
				await new web3.eth.Contract(ERC20_ABI, inputCurrency).methods
					.transfer(process.env.REACT_APP_GT_ADMIN, BN(inputValue).multipliedBy(10 ** inputDecimals).toFixed())
					.send({ from: account }, 	
						(err, data) => {
						if (!err) {
							addPendingTx(data);
						}
					})
					.on('transactionHash', async (hash) => {
						await this.renderStatusChange('Step 2 of 3: Processing Contribution', 'Please do not refresh this page.', 'pending')
						console.log(hash);
					}).on('error', async (error) =>{
						await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
						this.setState({loading: false})
						this.reset()
					});

				break;

			default:
				break;
		}
	};

	onSend = async () => {
		const {
			account, exchangeAddresses: { fromToken },
			selectors,
			addPendingTx,
			createDonation,
			web3connect,
		} = this.props;
		const {
			inputValue,
			outputValue,
			inputCurrency,
			outputCurrency,
			inputAmountB,
			lastEditedField,
			recipient
		} = this.state;
		this.setState({ loading: true });
		this.renderStatusChange('Step 1 of 3: Awaiting Contribution', 'Please confirm transaction.', 'pending')
		await this.onContribution();
		this.setState({ loading: true });
		const adminWeb3Wallet = await AdminWeb3Wallet()
		const adminWeb3Wallets = await adminWeb3Wallet.eth.getAccounts();
		const ALLOWED_SLIPPAGE = 0.15;
		const TOKEN_ALLOWED_SLIPPAGE = 0.04;
		const CHARTIY_BLOCK_FEE = 0.01;
		const tokenName = this.renderTokenName(inputCurrency);
		const type = getSendType(inputCurrency, outputCurrency);
		const { decimals: inputDecimals } = selectors().getBalance(account, inputCurrency);
		const { decimals: outputDecimals } = selectors().getBalance(account, outputCurrency);
		let deadline;
		try {
			deadline = await retry(() => getBlockDeadline(adminWeb3Wallet, 600));
		} catch (e) {
			// TODO: Handle error.
			return;
		}
		
		
		console.log(`property transferred to ${process.env.REACT_APP_GT_ADMIN}`);
		this.renderStatusChange('Step 3 of 3: Finalizing Contribution', 'Please do not refresh this page.', 'pending')
		console.log('exchanging property...');

		if (lastEditedField === INPUT) {
			// send input
			switch (type) {
				case 'ETH_TO_TOKEN':
					const currentNonce = await getAdminWalletPendingNonce()
					console.log('attempting to convert fee to USD')
					await new adminWeb3Wallet.eth.Contract(EXCHANGE_ABI, fromToken[outputCurrency]).methods
						.ethToTokenTransferInput(
							BN(outputValue)
								.multipliedBy(10 ** process.env.REACT_APP_STABLECOIN_DECIMALS)
								.multipliedBy(CHARTIY_BLOCK_FEE)
								.multipliedBy(1 - ALLOWED_SLIPPAGE)
								.toFixed(),
								deadline,
								process.env.REACT_APP_GT_ADMIN
								)
								.send(
									{
										from: adminWeb3Wallets[0],
										value: BN(inputValue)
										.multipliedBy(10 ** 18)
										.multipliedBy(CHARTIY_BLOCK_FEE)
									.toFixed(),
									nonce: currentNonce
							},
							(err, data) => {
								if (!err) {
									addPendingTx(data);
								}
							}
						)
						.on('error', async (error) =>{
							await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
							this.setState({loading: false})
							this.reset()
						})
						.on('transactionHash', async () => {
							console.log('attempting to convert contribution to USD')
							const currentNonce = await getAdminWalletPendingNonce()
							await new adminWeb3Wallet.eth.Contract(EXCHANGE_ABI, fromToken[outputCurrency]).methods
								.ethToTokenTransferInput(
									BN(outputValue)
										.multipliedBy(10 ** process.env.REACT_APP_STABLECOIN_DECIMALS)
										.multipliedBy(1 - CHARTIY_BLOCK_FEE)
										.multipliedBy(1 - ALLOWED_SLIPPAGE)
										.toFixed(),
										deadline,
										recipient
										)
										.send(
											{
												from: adminWeb3Wallets[0],
												value: BN(inputValue)
												.multipliedBy(10 ** 18)
												.multipliedBy(1 - CHARTIY_BLOCK_FEE)
											.toFixed(),
										nonce: currentNonce
										},
									(err, data) => {
										if (!err) {
											addPendingTx(data);
										}
									}

								).on('error', async (error) =>{
									await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
									this.setState({loading: false})
									this.reset()
								})
								.on('receipt', async (receipt) => {
										await this.renderStatusChange("Contribution Complete!", "Your grantable balance will update shortly", "success")
										await createDonation(
											receipt.transactionHash,
											recipient,
											web3connect.account,
											tokenName,
											inputValue,
											receipt.events.TokenPurchase.returnValues.tokens_bought,
											outputDecimals
										)
									})
									
								})
								this.setState({loading: false})
					break;


				case 'TOKEN_TO_TOKEN':
					console.log('attempting to convert fee to USD')
					const currentNonce2 = await adminWeb3Wallet.eth.getTransactionCount(process.env.REACT_APP_GT_ADMIN, 'pending')
					await new adminWeb3Wallet.eth.Contract(EXCHANGE_ABI, fromToken[inputCurrency]).methods
						.tokenToTokenTransferInput(
							BN(inputValue)
								.multipliedBy(CHARTIY_BLOCK_FEE)
								.multipliedBy(10 ** inputDecimals)
								.toFixed(),
							BN(outputValue)
								.multipliedBy(10 ** outputDecimals)
								.multipliedBy(CHARTIY_BLOCK_FEE)
								.multipliedBy(1 - TOKEN_ALLOWED_SLIPPAGE)
								.toFixed(),
							'1',
							deadline,
							process.env.REACT_APP_GT_ADMIN,
							outputCurrency
						)
						.send({ from: adminWeb3Wallets[0], nonce: currentNonce2 }, (err, data) => {
							if (!err) {
								addPendingTx(data);
							}
						})
						.on('error', async (error) =>{
							await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
							this.setState({loading: false})
							this.reset()
						})
						.on('transactionHash', async () => {
							console.log('attempting to convert contribution to USD')
							const currentNonce = await getAdminWalletPendingNonce()
							await new adminWeb3Wallet.eth.Contract(EXCHANGE_ABI, fromToken[inputCurrency]).methods
								.tokenToTokenTransferInput(
									BN(inputValue)
										.multipliedBy(1 - CHARTIY_BLOCK_FEE)
										.multipliedBy(10 ** inputDecimals)
										.toFixed(),
									BN(outputValue)
										.multipliedBy(10 ** outputDecimals)
										.multipliedBy(1 - CHARTIY_BLOCK_FEE)
										.multipliedBy(1 - TOKEN_ALLOWED_SLIPPAGE)
										.toFixed(),
									'1',
									deadline,
									recipient,
									outputCurrency
								)
								.send({ from: adminWeb3Wallets[0], nonce: currentNonce }, (err, data) => {
									if (!err) {
										addPendingTx(data);
									}
								})
								.on('error', async (error) =>{
									await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
									this.setState({loading: false})
									this.reset()
								})
								.on('receipt', async (receipt) => {
										await this.renderStatusChange("Contribution Complete!", "Your grantable balance will update shortly", "success")
										await createDonation(
											receipt.transactionHash,
											recipient,
											web3connect.account,
											tokenName,
											inputValue,
											receipt.events.TokenPurchase.returnValues.tokens_bought,
											outputDecimals
										).then(this.setState({ loading: false }));
								})
								
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
					console.log('attempting to convert fee to USD')
					const currentNonce = await getAdminWalletPendingNonce()
					await new adminWeb3Wallet.eth.Contract(EXCHANGE_ABI, fromToken[outputCurrency]).methods
						.ethToTokenTransferOutput(
							BN(outputValue)
								.multipliedBy(10 ** outputDecimals)
								.multipliedBy(CHARTIY_BLOCK_FEE)
								.toFixed(0),
							deadline,
							process.env.REACT_APP_GT_ADMIN
						)
						.send(
							{
								from: adminWeb3Wallets[0],
								value: BN(inputValue)
									.multipliedBy(10 ** inputDecimals)
									.multipliedBy(CHARTIY_BLOCK_FEE)
									.multipliedBy(1 + ALLOWED_SLIPPAGE)
									.toFixed(),
								gas: '1000000',
								nonce: currentNonce
							},
							(err, data) => {
								if (!err) {
									addPendingTx(data);
									this.reset();
								}
							}
						)
						.on('error', async (error) =>{
							await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
							this.setState({loading: false})
							this.reset()
						})
						.on('transactionHash', async () => {
							console.log('attempting to convert contribution to USD')
							const currentNonce = await getAdminWalletPendingNonce()
							await new adminWeb3Wallet.eth.Contract(EXCHANGE_ABI, fromToken[outputCurrency]).methods
								.ethToTokenTransferOutput(
									BN(outputValue)
										.multipliedBy(10 ** outputDecimals)
										.multipliedBy(1 - CHARTIY_BLOCK_FEE)
										.toFixed(0),
									deadline,
									recipient
								)
								.send(
									{
										from: adminWeb3Wallets[0],
										value: BN(inputValue)
											.multipliedBy(10 ** inputDecimals)
											.multipliedBy(1 - CHARTIY_BLOCK_FEE)
											.multipliedBy(1 + ALLOWED_SLIPPAGE)
											.toFixed(),
										gas: '1000000',
										nonce: currentNonce
									},
									(err, data) => {
										if (!err) {
											addPendingTx(data);
											this.reset();
										}
									}
								)
								.on('error', async (error) =>{
									await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
									this.setState({loading: false})
									this.reset()
								})
								.on('receipt', async (receipt) => {
									await this.renderStatusChange("Contribution Complete!", "Your grantable balance will update shortly", "success")
									await createDonation(
											receipt.transactionHash,
											recipient,
											web3connect.account,
											tokenName,
											inputValue,
											receipt.events.TokenPurchase.returnValues.tokens_bought,
											outputDecimals
										).then(this.setState({ loading: false }));
								})
								
						})
					break;
				case 'TOKEN_TO_TOKEN':
					if (!inputAmountB) {
						return;
					}
					console.log('attempting to convert fee to USD')
					const currentNonce2 = await adminWeb3Wallet.eth.getTransactionCount(process.env.REACT_APP_GT_ADMIN, 'pending')
					await new adminWeb3Wallet.eth.Contract(EXCHANGE_ABI, fromToken[inputCurrency]).methods
						.tokenToTokenTransferOutput(
							BN(outputValue)
								.multipliedBy(10 ** outputDecimals)
								.multipliedBy(CHARTIY_BLOCK_FEE)
								.toFixed(0),
							BN(inputValue)
								.multipliedBy(10 ** inputDecimals)
								.multipliedBy(CHARTIY_BLOCK_FEE)
								.multipliedBy(1 + TOKEN_ALLOWED_SLIPPAGE)
								.toFixed(),
							inputAmountB.multipliedBy(1.2).toFixed(0),
							deadline,
							process.env.REACT_APP_GT_ADMIN,
							outputCurrency
						)
						.send({ from: adminWeb3Wallets[0], nonce: currentNonce2 }, (err, data) => {
							if (!err) {
								addPendingTx(data);
								this.reset();
							}
						})
						.on('error', async (error) =>{
							await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
							this.setState({loading: false})
							this.reset()
						})
						.on('transactionHash', async () => {
							console.log('attempting to convert contribution to USD')
							const currentNonce = await getAdminWalletPendingNonce()
							await new adminWeb3Wallet.eth.Contract(EXCHANGE_ABI, fromToken[inputCurrency]).methods
								.tokenToTokenTransferOutput(
									BN(outputValue)
										.multipliedBy(10 ** outputDecimals)
										.multipliedBy(1 - CHARTIY_BLOCK_FEE)
										.toFixed(0),
									BN(inputValue)
										.multipliedBy(10 ** inputDecimals)
										.multipliedBy(1 - CHARTIY_BLOCK_FEE)
										.multipliedBy(1 + TOKEN_ALLOWED_SLIPPAGE)
										.toFixed(),
									inputAmountB.multipliedBy(1.2).toFixed(0),
									deadline,
									recipient,
									outputCurrency
								)
								.send({ from: adminWeb3Wallets[0], nonce: currentNonce }, (err, data) => {
									if (!err) {
										addPendingTx(data);
										this.reset();
									}
								})
								.on('error', async (error) =>{
									await this.renderStatusChange('Oops! Contribution Failed', error.message, 'failure')
									this.setState({loading: false})
									this.reset()
								})
								.on('receipt', async (receipt) => {
									await this.renderStatusChange("Contribution Complete!", "Your grantable balance will update shortly", "success")
									await createDonation(
											receipt.transactionHash,
											recipient,
											web3connect.account,
											tokenName,
											inputValue,
											receipt.events.TokenPurchase.returnValues.tokens_bought,
											outputDecimals
										).then(this.setState({ loading: false }));
								})
								
						})
					break;
				default:
					break;
			}
		}
	};

	renderSummary(inputError, outputError) {
		const { inputValue, inputCurrency, outputValue, outputCurrency, recipient } = this.state;
		const { web3 } = this.props;

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
			contextualInfo = 'selectTokenCont';
		} else if (inputCurrency === outputCurrency) {
			contextualInfo = 'differentToken';
		} else if (!inputValue || !outputValue) {
			const missingCurrencyValue = !inputValue ? inputLabel : outputLabel;
			contextualInfo = 'enter a donation amount' + { missingCurrencyValue };
			isError = true;
		} else if (inputIsZero || outputIsZero) {
			contextualInfo = 'noLiquidity';
		} else if (this.isUnapproved()) {
			contextualInfo = 'unlockTokenCont';
		} else if (!recipient) {
			contextualInfo = 'noRecipient';
		} else if (!validRecipientAddress) {
			contextualInfo = 'invalidRecipient';
		}

		return (
			<ContextualInfo
				openDetailsText={'transactionDetails'}
				closeDetailsText={'hideDetails'}
				contextualInfo={contextualInfo}
				isError={isError}
				renderTransactionDetails={this.renderTransactionDetails}
			/>
		);
	}

	renderTransactionDetails = () => {
		const { inputValue, inputCurrency, outputValue, outputCurrency, recipient, lastEditedField } = this.state;
		const { selectors, account } = this.props;

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
						{'youAreSending'} {b(`${+inputValue} ${inputLabel}`)}.
					</div>
					<div className="send__last-summary-text">
						{recipientText} {'willReceive'} {b(`${+minOutput} ${outputLabel}`)} {'orTransFail'}
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div>
						{'youAreSending'} {b(`${+outputValue} ${outputLabel}`)} {'to'} {recipientText}.
						{/*You are selling between {b(`${+inputValue} ${inputLabel}`)} to {b(`${+maxInput} ${inputLabel}`)}.*/}
					</div>
					<div className="send__last-summary-text">
						{/*{b(`${recipient.slice(0, 6)}...${recipient.slice(-4)}`)} will receive {b(`${+outputValue} ${outputLabel}`)}.*/}
						{'itWillCost'} {b(`${+maxInput} ${inputLabel}`)} {'orTransFail'}
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
						<span className="swap__exchange-rate">{' '}</span>
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
		const { outputValue, tncconsent } = this.state;

		if (!outputValue) {
			return (
				<Button
					className={classnames('primary centered', {
						inactive: !this.props.isConnected
					})}
					disabled={!isValid || !tncconsent}
					onClick={this.onSend}
				>
					Donate
				</Button>
			);
		}

		return (
			<div>
				<Button
					className={classnames('primary centered', {
						inactive: !this.props.isConnected
					})}
					disabled={!isValid || !tncconsent || this.state.loading}
					onClick={this.onSend}
				>
					Donate ~${outputValue.toLocaleString('en')}
				</Button>
			</div >
		);
	}

	handleCheckboxChange = event =>
		this.setState({ tncconsent: event.target.checked })

	renderTnCconsent() {
		const Checkbox = props => (
			<input type="checkbox" {...props} />
		)


		return (
			<OversizedPanel >
				<div className="swap__exchange-rate-wrapper" style={{ margin: '2.5px', padding: '10px' }}>
					<label>Accept Terms and Conditions?</label>
					<Checkbox style={{ marginLeft: '1rem' }}
						checked={this.state.tncconsent}
						onChange={this.handleCheckboxChange}
					/>
					<span>{`  I agree`}</span>
				</div>
			</OversizedPanel>
		)
	}

	renderBalance(currency, balance, decimals) {
		if (!currency || decimals === 0) {
			return '';
		}
		const balanceInput = balance.dividedBy(BN(10 ** decimals)).toFixed(4);
		return `balance: ${balanceInput}`;
	}

	renderTokenName(address) {
		const { tokenAddresses } = this.props;
		var result;

		for (var i = 0, len = tokenAddresses.addresses.length; i < len; i++) {
			if (tokenAddresses.addresses[i][1] === address) {
				result = tokenAddresses.addresses[i][0];
				break;
			} else {
				result = 'ETH';
			}
		}

		return result;
	}

	render() {
		const { selectors, account } = this.props;
		const { lastEditedField, inputCurrency, outputCurrency, inputValue, outputValue, recipient } = this.state;

		const estimatedText = 'estimated';

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
						title={'tokens to be donated:'}
						description={lastEditedField === OUTPUT ? estimatedText : ''}
						extraText={this.renderBalance(inputCurrency, inputBalance, inputDecimals)}
						onCurrencySelected={(inputCurrency) => this.setState({ inputCurrency }, this.recalcForm)}
						onValueChange={this.updateInput}
						selectedTokens={[inputCurrency, outputCurrency]}
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
						disableTokenSelect
						title={'dollar value:'}
						description={lastEditedField === INPUT ? estimatedText : ''}
						extraText={this.renderBalance(outputCurrency, outputBalance, outputDecimals)}
						onValueChange={this.updateOutput}
						selectedTokens={[inputCurrency, outputCurrency]}
						value={outputValue.toLocaleString('en')}
						selectedTokenAddress={process.env.REACT_APP_STABLECOIN_ADDRESS}
						errorMessage={outputError}
						disableUnlock
					/>
					<OversizedPanel>
						<div className="swap__down-arrow-background" style={{ margin: '0 auto', padding: '10px' }}>
							<div>
								<i className="arrow down small icon" />will be deposited into{' '}
								<i className="arrow down small icon" />
							</div>
						</div>
					</OversizedPanel>
					<AddressInputPanel
						disabled
						t={this.props.t}
						value={recipient}
						onChange={(address) => this.setState({ recipient: address })}
						recievingFund={this.props.recievingFund}
					/>

					{this.renderExchangeRate()}
					<div style={{ display: 'flex' }}>
						{this.renderTnCconsent()}
					</div>
					{this.renderSummary(inputError, outputError)}

					<div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
						{this.renderDonateButton()}
					</div>
					<div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
						Exchange powered by: {''}
						<a href="http://uniswap.io" target="new">
							<img alt="unicorn" style={{ marginTop: '.3rem', height: '7rem' }} src={logo} />
						</a>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		org: state.org,
		balances: state.web3connect.balances,
		isConnected:
			!!state.web3connect.account && state.web3connect.networkId === (process.env.REACT_APP_NETWORK_ID || 1),
		account: state.web3connect.account,
		web3: state.web3connect.web3,
		web3connect: state.web3connect,
		exchangeAddresses: state.addresses.exchangeAddresses,
		tokenAddresses: state.addresses.tokenAddresses,
		gtFund: state.gtFunds,
		ncState: state.ncState
	};
};

export default connect(mapStateToProps, (dispatch) => ({
	setAddresses: (networkId) => dispatch(setAddresses(networkId)),
	initialize: () => dispatch(initialize()),
	updateNCStatus: (headline, message, status) => dispatch(updateNCStatus(headline, message, status)),
	startWatching: () => dispatch(startWatching()),
	selectors: () => dispatch(selectors()),
	addPendingTx: (id) => dispatch(addPendingTx(id)),
	fetchFundDAIBalance: (address) => dispatch(fetchFundDAIBalance(address)),
	createDonation: (txID, fundAddress, fromAddress, inputCurrency, inputAmount, outputAmount, donationDate) =>
		dispatch(createDonation(txID, fundAddress, fromAddress, inputCurrency, inputAmount, outputAmount, donationDate))
}))((Send));

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