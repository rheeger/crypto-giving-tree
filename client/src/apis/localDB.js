import axios from 'axios';

export default axios.create({
	baseURL: 'http://http://34.68.117.220',
	rejectUnauthorized: false
});
