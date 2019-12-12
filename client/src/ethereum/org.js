import Org from './build/Org.json';
import web3 from './web3';

export const orgContract = (address) => {
	return new web3.eth.Contract(JSON.parse(Org.interface), address);
};

export const approveOrgClaim = async (orgAddress, claimNonce) => {
	const Web3 = require('web3');
	const HDWalletProvider = require('@truffle/hdwallet-provider');

	const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
	const infuraKey = process.env.REACT_APP_INFURA_KEY;
	const infuraRinkebyEndpoint = 'https://rinkeby.infura.io/v3/' + infuraKey;

	const provider = new HDWalletProvider(mnemonic, infuraRinkebyEndpoint);

	const web3 = new Web3(provider);
	const accounts = await web3.eth.getAccounts();
	const org = new web3.eth.Contract(JSON.parse(Org.interface), orgAddress);

	const approvedClaim = await org.methods.approveClaim(claimNonce).send({ from: accounts[0], gas: '1500000' });

	return approvedClaim.transactionHash;
};
