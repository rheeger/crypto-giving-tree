import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  //we're in a browser, metamask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  //on a server *OR* the user is not running metamask
  const infuraKey = process.env.REACT_APP_INFURA_KEY;
  const infuraPrefix = process.env.REACT_APP_INFURA_PREFIX;
  const infuraEndpoint =
    "https://" + infuraPrefix + ".infura.io/v3/" + infuraKey;
  const provider = new Web3.providers.HttpProvider(infuraEndpoint);
  web3 = new Web3(provider);
}

export default web3;
