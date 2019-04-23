import ProPublica from '../../apis/ProPublica';
import { ORG_SELECT, ORG_SEARCH } from './types';

//Action creator
export const selectOrg = (ein) => async (dispatch) => {
	const response = await ProPublica.get(`/organizations/${ein}.json`).catch(function(error) {
		console.error(error);
	});

	dispatch({
		type: ORG_SELECT,
		payload: response.data
	});
};

export const searchOrgs = (term) => async (dispatch) => {
	const response = await ProPublica.get('/search.json?c_code%5Bid%5D=3', {
		params: { q: term }
	}).catch(function(error) {
		console.error(error);
	});
	console.log(response);

	dispatch({
		type: ORG_SEARCH,
		payload: response.data
	});
};
