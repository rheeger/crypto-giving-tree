import adminWeb3 from "./adminWeb3";
import TreeNursery from "./build/TreeNursery.json";
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
const infuraEndpoint = "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

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

export function getNurseryInstance() {
  const address = process.env.REACT_APP_TREE_NURSERY;
  const treeNursery = new adminWeb3.eth.Contract(
    JSON.parse(TreeNursery.interface),
    address
  );

  return treeNursery;
}
