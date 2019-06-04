import web3 from './web3';
import Tree from './build/Tree.json';

export default (address) => {
	return new web3.eth.Contract(JSON.parse(Tree.interface), address);
};

export const approveTreeGrant = async (treeAddress, grantNonce, tokenAddress) => {
	const Web3 = require('web3');
	const HDWalletProvider = require('truffle-hdwallet-provider');

	const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
	const infuraKey = process.env.REACT_APP_INFURA_KEY;
	const infuraRinkebyEndpoint = 'https://rinkeby.infura.io/v3/' + infuraKey;

	const provider = new HDWalletProvider(mnemonic, infuraRinkebyEndpoint);

	const web3 = new Web3(provider);
	const accounts = await web3.eth.getAccounts();
	const tree = new web3.eth.Contract(JSON.parse(Tree.interface), treeAddress);

	console.log('Approving Grant...');
	const approvedGrant = await tree.methods
		.finalizeGrant(grantNonce, tokenAddress)
		.send({ from: accounts[0], gas: '1500000' });

	const blockInfo = await web3.eth.getBlock(approvedGrant.blockNumber);
	const approvalDate = new Date(blockInfo.timestamp * 1000);
	const formattedApprovalDate = new Intl.DateTimeFormat('en-US').format(approvalDate);

	return { id: approvedGrant.transactionhash, date: formattedApprovalDate };
};
