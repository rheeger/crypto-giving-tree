import Org from "./build/Org.json";
import adminWeb3 from "./adminWeb3";
import { AdminWeb3Wallet } from "./adminWeb3Wallet";

export const orgContract = address => {
  return new adminWeb3.eth.Contract(JSON.parse(Org.interface), address);
};

export const approveOrgClaim = async (orgAddress, claimNonce) => {
  const adminWeb3Wallet = await AdminWeb3Wallet();
  const accounts = await adminWeb3Wallet.eth.getAccounts();
  const org = new adminWeb3Wallet.eth.Contract(
    JSON.parse(Org.interface),
    orgAddress
  );
  const currentNonce = await adminWeb3Wallet.eth.getTransactionCount(
    accounts[0],
    "pending"
  );

  const approvedClaim = await org.methods
    .approveClaim(claimNonce)
    .send({ from: accounts[0], nonce: currentNonce });

  return approvedClaim.transactionHash;
};
