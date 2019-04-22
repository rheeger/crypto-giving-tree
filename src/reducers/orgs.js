import { ORG_SEARCH, ORG_SELECT } from '../actions/types';

export const orgs = (state = [], action) => {
	switch (action.type) {
		case ORG_SEARCH:
			return action.payload;
		default:
			return state;
	}
};

export const org = (state = [], action) => {
	switch (action.type) {
		case ORG_SELECT:
			return action.payload;
		default:
			return state;
	}
};
