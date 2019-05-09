import { PLANT_TREE, FETCH_TREES, FETCH_TREE, FETCH_TREE_SUMMARY, EDIT_TREE, DELETE_TREE } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
	switch (action.type) {
		case FETCH_TREE:
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_TREE_SUMMARY:
			return { ...state, [action.payload.id]: action.payload };
		case PLANT_TREE:
			return { ...state, [action.payload.id]: action.payload };
		case EDIT_TREE:
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_TREES:
			return { ...state, ..._.mapKeys(action.payload, 'id') };
		case DELETE_TREE:
			return _.omit(state, action.payload);
		default:
			return state;
	}
};
