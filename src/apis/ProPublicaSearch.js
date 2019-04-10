import axios from 'axios';

const proxyurl = 'https://cors-anywhere.herokuapp.com/';
const baseURL = 'https://projects.propublica.org/nonprofits/api/v2/search.json?c_code%5Bid%5D=3';

const ROOT_URL = proxyurl + baseURL;

export default function(options, callback) {
	var params = {
		q: options.term
	};

	axios
		.get(ROOT_URL, { params: params })
		.then(function(response) {
			if (callback) {
				callback(response.data.items);
			}
		})
		.catch(function(error) {
			console.error(error);
		});
}
