import Web3 from "web3";

let adminWeb3Wallet;

const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
const infuraEndpoint = "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

const provider = new HDWalletProvider(mnemonic, infuraEndpoint);
adminWeb3Wallet = new Web3(provider);

export default adminWeb3Wallet;
