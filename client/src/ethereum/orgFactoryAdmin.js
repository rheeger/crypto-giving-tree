import web3 from './web3';
import OrgFactory from './build/OrgFactory.json';

export const createOrg = async (id) => {
	const Web3 = require('web3');
	const HDWalletProvider = require('truffle-hdwallet-provider');

	const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
	const infuraKey = process.env.REACT_APP_INFURA_KEY;
	const infuraRinkebyEndpoint = 'https://rinkeby.infura.io/v3/' + infuraKey;

	const provider = new HDWalletProvider(mnemonic, infuraRinkebyEndpoint);

	const web3 = new Web3(provider);
	const accounts = await web3.eth.getAccounts();
	const address = '0x9c3027738cbAbbeA224b94474f69D5A8B4DC8785';
	const orgFactory = new web3.eth.Contract(JSON.parse(OrgFactory.interface), address);

	const createContract = await orgFactory.methods.createOrg(id).send({ from: accounts[0], gas: '1000000' });
	console.log('Created contract:' + createContract.events.orgCreated.returnValues.newAddress);
	const contractAddress = createContract.events.orgCreated.returnValues.newAddress;

	return contractAddress;
};

export function getOrgFactoryInstance() {
	const address = '0x9c3027738cbAbbeA224b94474f69D5A8B4DC8785';
	const orgFactory = new web3.eth.Contract(JSON.parse(OrgFactory.interface), address);

	return orgFactory;
}
