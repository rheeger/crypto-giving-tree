import ProPublica from '../apis/ProPublica';
import { ORG_SELECTED, ORG_SEARCH } from './types';

//Action creator
export const selectOrg = async (ein) => {
	const response = await ProPublica.get(`/organizations/${ein}.json`).catch(function(error) {
		console.error(error);
	});
	return {
		type: ORG_SELECTED,
		payload: response.data
	};
};

export const searchOrgs = async (term, dispatch) => {
	const response = await ProPublica.get('/search.json?c_code%5Bid%5D=3', {
		params: { q: term }
	}).catch(function(error) {
		console.error(error);
	});

	dispatch({
		type: ORG_SEARCH,
		payload: response.data
	});
};
