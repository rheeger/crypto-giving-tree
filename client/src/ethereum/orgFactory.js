import web3 from './web3';
import OrgFactory from './build/OrgFactory.json';

const address = '0xe409ddb127bcf41dce69c473a1466d7cc0805d45';
const orgFactory = new web3.eth.Contract(JSON.parse(OrgFactory.interface), address);

export default orgFactory;
