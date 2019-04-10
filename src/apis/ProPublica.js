import axios from 'axios';

const proxyurl = 'https://cors-anywhere.herokuapp.com/';
const endpoint = 'https://projects.propublica.org/nonprofits/api/v2';

export default axios.create({
	baseURL: proxyurl + endpoint
});
