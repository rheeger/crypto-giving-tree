import web3 from './web3';
import GivingTree from './build/GivingTree.json';

const address = '0xe439904dd8961200DB03785810f7Fd08Ccf4Fb37';
const instnace = new web3.eth.Contract(JSON.parse(GivingTree.interface), address);

export default instnace;
