import Web3 from "web3";
import TreeNursery from "./build/TreeNursery.json";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { updateNCStatus } from "../store/actions/ncStatus";
const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
const infuraEndpoint = "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

export const renderStatusChange = async (headline, message, status) => {
  await updateNCStatus(headline, message, status);
  return;
};

export const plantFund = async managerAddress => {
  const provider = new HDWalletProvider(mnemonic, infuraEndpoint);
  const adminWeb3Wallet = new Web3(provider);
  const accounts = await adminWeb3Wallet.eth.getAccounts();
  const address = process.env.REACT_APP_TREE_NURSERY;
  const treeNursery = new adminWeb3Wallet.eth.Contract(
    JSON.parse(TreeNursery.interface),
    address
  );
  const currentNonce = await adminWeb3Wallet.eth.getTransactionCount(
    accounts[0],
    "pending"
  );

  console.log("Creating contract...");
  const createContract = await treeNursery.methods
    .plantTree(managerAddress)
    .send({
      from: accounts[0],
      gasPrice: "1000000000",
      nonce: currentNonce
    });
  provider.engine.stop();
  return { id: createContract.events.treePlanted.returnValues.newAddress };
};

export const getAdminWalletPendingNonce = async () => {
  const provider = new HDWalletProvider(mnemonic, infuraEndpoint);
  const adminWeb3Wallet = new Web3(provider);
  const nonce = await adminWeb3Wallet.eth.getTransactionCount(
    process.env.REACT_APP_GT_ADMIN,
    "pending"
  );
  console.log(nonce);
  provider.engine.stop();
  return nonce;
};
