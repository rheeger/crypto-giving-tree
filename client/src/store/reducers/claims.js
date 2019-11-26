import {
	MAKE_ORG_CLAIM,
	FETCH_CLAIMS,
	FETCH_ORG_CLAIMS,
	FETCH_CLAIM,
	EDIT_CLAIM,
	DELETE_CLAIM
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
	switch (action.type) {
		case MAKE_ORG_CLAIM:
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_CLAIM:
			return { ...state, [action.payload.id]: action.payload };
		case EDIT_CLAIM:
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_CLAIMS:
			return { ...state, ..._.mapKeys(action.payload, 'id') };
		case FETCH_ORG_CLAIMS:
			return { ...state, ..._.mapKeys(action.payload, 'id') };
		case DELETE_CLAIM:
			return _.omit(state, action.payload);
		default:
			return state;
	}
};
