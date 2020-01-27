import Web3 from "web3";

export const AdminWeb3Wallet = async () => {
  const HDWalletProvider = require("@truffle/hdwallet-provider");
  const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
  const infuraKey = process.env.REACT_APP_INFURA_KEY;
  const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
  const infuraEndpoint =
    "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

  const provider = new HDWalletProvider(mnemonic, infuraEndpoint);
  const adminWeb3Wallet = new Web3(provider);
  return adminWeb3Wallet;
};

export const getAdminWalletPendingNonce = async () => {
  const adminWeb3Wallet = await AdminWeb3Wallet();
  const nonce = await adminWeb3Wallet.eth.getTransactionCount(
    process.env.REACT_APP_GT_ADMIN,
    "pending"
  );
  console.log(nonce);
  return nonce;
};
