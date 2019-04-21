//Action creator
export const selectOrg = (org) => {
	//returns organization info
	return {
		type: 'ORG_SELECTED',
		payload: org
	};
};

export const searchOrgs = (term) => {
	return {
		type: 'ORG_SEARCH',
		payload: term
	};
};
