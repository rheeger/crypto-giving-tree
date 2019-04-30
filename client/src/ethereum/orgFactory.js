import web3 from './web3';
import OrgFactory from './build/OrgFactory.json';

const address = '0x3131e87e33ea1237a89add3f07136f01902a46c8';
const orgFactory = new web3.eth.Contract(JSON.parse(OrgFactory.interface), address);

export default orgFactory;
