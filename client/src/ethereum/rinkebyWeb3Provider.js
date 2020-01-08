const Web3 = require("web3");
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
const infuraEndpoint = "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;
const provider = new Web3.providers.HttpProvider(infuraEndpoint);
const web3 = new Web3(provider);

export default web3;
