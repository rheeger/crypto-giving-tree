import web3 from './web3';
import Tree from './build/Tree.json';

export default (address) => {
	return new web3.eth.Contract(JSON.parse(Tree.interface), address);
};
