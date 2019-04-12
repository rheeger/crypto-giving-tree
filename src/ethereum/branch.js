import web3 from './web3';
import Branch from './build/Branch.json';

export default (address) => {
	return new web3.eth.Contract(JSON.parse(Branch.interface), address);
};
