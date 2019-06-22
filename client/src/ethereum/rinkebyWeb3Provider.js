const Web3 = require('web3');
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraRinkebyEndpoint = 'https://rinkeby.infura.io/v3/' + infuraKey;
const provider = new Web3.providers.HttpProvider(infuraRinkebyEndpoint);
const web3 = new Web3(provider);

export default web3;
