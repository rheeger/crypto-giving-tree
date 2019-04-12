import web3 from './web3';
import GivingTree from './build/GivingTree.json';

const address = '0x572EB0939D6E00384d531B8bA976cE163aC42681';
const instnace = new web3.eth.Contract(JSON.parse(GivingTree.interface), address);

export default instnace;
