const assert = require('assert');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const compiledFactory = require('./build/CampaignFactory.json');

const mnemonic = process.env.METAMASK_MNEMONIC;
console.log(process.env.METAMASK_MNEMONIC);
const infuraKey = process.env.INFURA_KEY;
const infuraRinkebyEndpoint = 'https://rinkeby.infura.io/v3/' + infuraKey;
console.log(infuraRinkebyEndpoint);

const provider = new HDWalletProvider(mnemonic, infuraRinkebyEndpoint);

const web3 = new Web3(provider);

const deploy = async () => {
	accounts = await web3.eth.getAccounts();

	console.log('attempting to deploy from account', accounts[0]);

	const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ from: accounts[0], gas: '1000000' });

	console.log('Contract deployed to', result.options.address);
};

deploy();
