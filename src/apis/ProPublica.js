import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

export default axios({
	baseURL: 'https://projects.propublica.org/nonprofits/api/v2',
	adapter: jsonpAdapter,
	callbackParamName: 'c'
});
