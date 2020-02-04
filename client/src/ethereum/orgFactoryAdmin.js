import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import adminWeb3 from "./adminWeb3";
import OrgFactory from "./build/OrgFactory.json";
const address = process.env.REACT_APP_ORG_FACTORY;
const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
const infuraKey = process.env.REACT_APP_INFURA_KEY;
const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
const infuraEndpoint = "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;

export const createOrg = async id => {
  const provider = new HDWalletProvider(mnemonic, infuraEndpoint);
  const adminWeb3Wallet = new Web3(provider);
  const accounts = await adminWeb3Wallet.eth.getAccounts();
  const orgFactory = new adminWeb3Wallet.eth.Contract(
    JSON.parse(OrgFactory.interface),
    address
  );

  const createContract = await orgFactory.methods
    .createOrg(id, process.env.REACT_APP_ENDAOMENT_ADMIN)
    .send({ from: accounts[0] });
  console.log(
    "Created contract:" +
      createContract.events.orgCreated.returnValues.newAddress
  );
  const contractAddress =
    createContract.events.orgCreated.returnValues.newAddress;
  provider.engine.stop();
  return contractAddress;
};

export function getOrgFactoryInstance() {
  const orgFactory = new adminWeb3.eth.Contract(
    JSON.parse(OrgFactory.interface),
    address
  );

  return orgFactory;
}
