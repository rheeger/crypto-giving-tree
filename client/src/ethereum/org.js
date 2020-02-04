import Org from "./build/Org.json";
import adminWeb3 from "./adminWeb3";
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
const infuraEndpoint = "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

export const orgContract = address => {
  return new adminWeb3.eth.Contract(JSON.parse(Org.interface), address);
};

export const approveOrgClaim = async (orgAddress, claimNonce) => {
  const provider = new HDWalletProvider(mnemonic, infuraEndpoint);
  const adminWeb3Wallet = new Web3(provider);
  const accounts = await adminWeb3Wallet.eth.getAccounts();
  const org = new adminWeb3Wallet.eth.Contract(
    JSON.parse(Org.interface),
    orgAddress
  );
  // const currentNonce = await adminWeb3Wallet.eth.getTransactionCount(
  //   accounts[0],
  //   "pending"
  // );

  const approvedClaim = await org.methods
    .approveClaim(claimNonce, process.env.REACT_APP_ENDAOMENT_ADMIN)
    .send({ from: accounts[0], gasPrice: "21000000000" });

  provider.engine.stop();
  return approvedClaim.transactionHash;
};
