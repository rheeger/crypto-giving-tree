import axios from 'axios';

const proxyurl = 'https://cors-anywhere.herokuapp.com/';

export default axios.create({
	baseURL: proxyurl + 'https://projects.propublica.org/nonprofits/api/v2'
});
