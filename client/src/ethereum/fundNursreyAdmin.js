import adminWeb3 from "./adminWeb3";
import adminWeb3Wallet from "./adminWeb3Wallet";
import TreeNursery from "./build/TreeNursery.json";

export const plantFund = async managerAddress => {
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
