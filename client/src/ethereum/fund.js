import Tree from "./build/Tree.json";
import adminWeb3 from "./adminWeb3";
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
const infuraEndpoint = "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

export const fundContract = address => {
  return new adminWeb3.eth.Contract(JSON.parse(Tree.interface), address);
};

export const approveFundGrant = async (
  fundAddress,
  grantNonce,
  tokenAddress
) => {
  const provider = new HDWalletProvider(mnemonic, infuraEndpoint);
  const adminWeb3Wallet = new Web3(provider);
  const accounts = await adminWeb3Wallet.eth.getAccounts();
  const fund = new adminWeb3Wallet.eth.Contract(
    JSON.parse(Tree.interface),
    fundAddress
  );
  const currentNonce = await adminWeb3Wallet.eth.getTransactionCount(
    accounts[0],
    "pending"
  );

  const approvedGrant = await fund.methods
    .finalizeGrant(grantNonce, tokenAddress)
    .send({ from: accounts[0], nonce: currentNonce });
  provider.engine.stop();
  return {
    approvalId: approvedGrant.transactionHash,
    blockNumber: approvedGrant.blockNumber
  };
};
