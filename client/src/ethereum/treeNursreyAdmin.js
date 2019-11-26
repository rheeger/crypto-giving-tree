import web3 from './web3';
import TreeNursery from './build/TreeNursery.json';

export const plantTree = async (managerAddress) => {
	const Web3 = require('web3');
	const HDWalletProvider = require('truffle-hdwallet-provider');

	const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
	const infuraKey = process.env.REACT_APP_INFURA_KEY;
	const infuraRinkebyEndpoint = 'https://rinkeby.infura.io/v3/' + infuraKey;

	const provider = new HDWalletProvider(mnemonic, infuraRinkebyEndpoint);

	const web3 = new Web3(provider);
	const accounts = await web3.eth.getAccounts();
	const address = '0xF4636a0Ed51203db203Ae08Cfe983Cdc165E0233';
	const treeNursery = new web3.eth.Contract(JSON.parse(TreeNursery.interface), address);

	console.log('Creating contract...');
	const createContract = await treeNursery.methods
		.plantTree(managerAddress)
		.send({ from: accounts[0], gas: '1500000' });

	// const blockInfo = await web3.eth.getBlock(createContract.blockNumber);
	// const approvalDate = new Date(blockInfo.timestamp * 1000);
	// const formattedApprovalDate = new Intl.DateTimeFormat('en-US').format(approvalDate);

	return { id: createContract.events.treePlanted.returnValues.newAddress };
};

export function getNurseryInstance() {
	const address = '0xF4636a0Ed51203db203Ae08Cfe983Cdc165E0233';
	const treeNursery = new web3.eth.Contract(JSON.parse(TreeNursery.interface), address);

	return treeNursery;
}
