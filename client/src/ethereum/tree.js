import Tree from "./build/Tree.json";
import web3 from "./web3";

export const treeContract = address => {
  return new web3.eth.Contract(JSON.parse(Tree.interface), address);
};

export const approveTreeGrant = async (
  treeAddress,
  grantNonce,
  tokenAddress
) => {
  const Web3 = require("web3");
  const HDWalletProvider = require("@truffle/hdwallet-provider");

  const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
  const infuraKey = process.env.REACT_APP_INFURA_KEY;
  const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
  const infuraEndpoint =
    "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

  const provider = new HDWalletProvider(mnemonic, infuraEndpoint);

  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const tree = new web3.eth.Contract(JSON.parse(Tree.interface), treeAddress);

  const approvedGrant = await tree.methods
    .finalizeGrant(grantNonce, tokenAddress)
    .send({ from: accounts[0], gas: "1500000" });

  return {
    approvalId: approvedGrant.transactionHash,
    blockNumber: approvedGrant.blockNumber
  };
};
