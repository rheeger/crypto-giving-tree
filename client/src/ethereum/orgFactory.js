import web3 from './web3';
import OrgFactory from './build/OrgFactory.json';

const address = '0x6b9d901467795364c40877cec5dd3f2602e6ece9';
const orgFactory = new web3.eth.Contract(JSON.parse(OrgFactory.interface), address);

export default orgFactory;
