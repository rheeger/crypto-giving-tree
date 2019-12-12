export const getAdminWeb3 = async () => {
	const Web3 = require('web3');
	const HDWalletProvider = require('@truffle/hdwallet-provider');

	const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
	const infuraKey = process.env.REACT_APP_INFURA_KEY;
	const infuraRinkebyEndpoint = 'https://rinkeby.infura.io/v3/' + infuraKey;

	const provider = new HDWalletProvider(mnemonic, infuraRinkebyEndpoint);

	const web3 = new Web3(provider);
	const adminWallet = await web3.eth.getAccounts();

	return adminWallet;
};
