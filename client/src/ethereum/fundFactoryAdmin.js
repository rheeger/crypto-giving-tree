import adminWeb3 from "./adminWeb3";
import FundFactory from "./build/FundFactory.json";
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
const address = process.env.REACT_APP_FUND_FACTORY;
const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
const infuraEndpoint = "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

export const createFund = async managerAddress => {
  const provider = new HDWalletProvider(mnemonic, infuraEndpoint);
  const adminWeb3Wallet = new Web3(provider);
  const accounts = await adminWeb3Wallet.eth.getAccounts();
  const fundFactory = new adminWeb3Wallet.eth.Contract(
    JSON.parse(FundFactory.interface),
    address
  );
  const currentNonce = await adminWeb3Wallet.eth.getTransactionCount(
    accounts[0],
    "pending"
  );

  console.log("Creating contract...");
  const createContract = await fundFactory.methods
    .createFund(managerAddress, process.env.REACT_APP_ENDAOMENT_ADMIN)
    .send({
      from: accounts[0],
      nonce: currentNonce,
      gasPrice: "21000000000"
    });
  provider.engine.stop();
  return { id: createContract.events.fundCreated.returnValues.newAddress };
};

export function getFundFactoryInstance() {
  const fundFactory = new adminWeb3.eth.Contract(
    JSON.parse(FundFactory.interface),
    address
  );

  return fundFactory;
}
