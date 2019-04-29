import { ORG_SEARCH, ORG_SELECT, CREATE_ORG, FETCH_ORGS, FETCH_ORG, EDIT_ORG, DELETE_ORG } from '../actions/types';
import _ from 'lodash';

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

export const givingTreeOrgs = (state = {}, action) => {
	switch (action.type) {
		case FETCH_ORG:
			return { ...state, [action.payload.id]: action.payload };
		case CREATE_ORG:
			return { ...state, [action.payload.id]: action.payload };
		case EDIT_ORG:
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_ORGS:
			return { ...state, ..._.mapKeys(action.payload, 'id') };
		case DELETE_ORG:
			return _.omit(state, action.payload);
		default:
			return state;
	}
};
