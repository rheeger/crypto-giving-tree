import {
	CREATE_DONATION,
	FETCH_DONATIONS,
	FETCH_TREE_DONATIONS,
	FETCH_DONATION,
	DELETE_DONATION
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
	switch (action.type) {
		case CREATE_DONATION:
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_DONATION:
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_DONATIONS:
			return { ...state, ..._.mapKeys(action.payload, 'id') };
		case FETCH_TREE_DONATIONS:
			return { ...state, ..._.mapKeys(action.payload, 'id') };
		case DELETE_DONATION:
			return _.omit(state, action.payload);
		default:
			return state;
	}
};
