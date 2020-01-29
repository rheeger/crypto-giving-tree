import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
const infuraEndpoint = "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

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
