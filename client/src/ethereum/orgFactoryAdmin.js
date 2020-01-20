import adminWeb3 from "./adminWeb3";
import adminWeb3Wallet from "./adminWeb3Wallet";
import OrgFactory from "./build/OrgFactory.json";
const address = process.env.REACT_APP_ORG_FACTORY;

export const createOrg = async id => {
  const accounts = await adminWeb3Wallet.eth.getAccounts();
  const orgFactory = new adminWeb3Wallet.eth.Contract(
    JSON.parse(OrgFactory.interface),
    address
  );
  const currentNonce = await adminWeb3Wallet.eth.getTransactionCount(
    accounts[0],
    "pending"
  );

  const createContract = await orgFactory.methods
    .createOrg(id)
    .send({ from: accounts[0], nonce: currentNonce });
  console.log(
    "Created contract:" +
      createContract.events.orgCreated.returnValues.newAddress
  );
  const contractAddress =
    createContract.events.orgCreated.returnValues.newAddress;

  return contractAddress;
};

export function getOrgFactoryInstance() {
  const orgFactory = new adminWeb3.eth.Contract(
    JSON.parse(OrgFactory.interface),
    address
  );

  return orgFactory;
}
