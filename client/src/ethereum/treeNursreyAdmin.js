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
	const address = '0xca94b995cf59c2892ae590cf3292cd9857f2078c';
	const treeNursery = new web3.eth.Contract(JSON.parse(TreeNursery.interface), address);

	const createContract = await treeNursery.methods
		.plantTree(managerAddress)
		.send({ from: accounts[0], gas: '1000000' });
	console.log('Created contract:' + createContract.events.treePlanted.returnValues.newAddress);
	const contractAddress = createContract.events.treePlanted.returnValues.newAddress;

	return contractAddress;
};

export function getNurseryInstance() {
	const address = '0xca94b995cf59c2892ae590cf3292cd9857f2078c';
	const treeNursery = new web3.eth.Contract(JSON.parse(TreeNursery.interface), address);

	return treeNursery;
}
