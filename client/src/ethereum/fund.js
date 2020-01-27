import Tree from "./build/Tree.json";
import adminWeb3 from "./adminWeb3";
import { AdminWeb3Wallet } from "./adminWeb3Wallet";

export const fundContract = address => {
  return new adminWeb3.eth.Contract(JSON.parse(Tree.interface), address);
};

export const approveFundGrant = async (
  fundAddress,
  grantNonce,
  tokenAddress
) => {
  const adminWeb3Wallet = await AdminWeb3Wallet();
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

  return {
    approvalId: approvedGrant.transactionHash,
    blockNumber: approvedGrant.blockNumber
  };
};
