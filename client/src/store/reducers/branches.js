import { CREATE_BRANCH, FETCH_BRANCHES, FETCH_BRANCH, EDIT_BRANCH, DELETE_BRANCH } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
	switch (action.type) {
		case FETCH_BRANCH:
			return { ...state, [action.payload.id]: action.payload };
		case CREATE_BRANCH:
			return { ...state, [action.payload.id]: action.payload };
		case EDIT_BRANCH:
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_BRANCHES:
			return { ...state, ..._.mapKeys(action.payload, 'id') };
		case DELETE_BRANCH:
			return _.omit(state, action.payload);
		default:
			return state;
	}
};
