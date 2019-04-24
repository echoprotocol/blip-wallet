import { createModule } from 'redux-modules';
import { Map, List, Set } from 'immutable';

const DEFAULT_FIELDS = Map({
	balances: new Map({}),
	transaction: new Map({}),
	history: new Map({
		transactions: new List([]),
		total: null,
		filter: new Map({
			coins: null,
			types: null,
			accounts: null,
		}),
	}),
	hiddenAssets: new Set(),
});

export default createModule({
	name: 'wallet',

	initialState: DEFAULT_FIELDS,
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
		setIn: {
			reducer: (state, { payload }) => {
				Object.keys(payload.params).forEach((field) => {
					state = state.setIn([payload.field, field], payload.params[field]);
				});

				return state;
			},
		},
		clear: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, DEFAULT_FIELDS.get(payload.field));

				return state;
			},
		},
		reset: {
			reducer: (state) => {
				state = DEFAULT_FIELDS;

				return state;
			},
		},
		toggleSelect: {
			reducer: (state, { payload }) => {
				let transaction = state.getIn(['history', 'transactions', payload.index]);
				transaction = transaction.set('selected', !transaction.get('selected'));

				state = state.setIn(['history', 'transactions', payload.index], transaction);
				return state;
			},
		},
		deselect: {
			reducer: (state) => {
				let transactions = state.getIn(['history', 'transactions']);
				transactions = transactions.map((t) => t.set('selected', false));

				state = state.setIn(['history', 'transactions'], transactions);
				return state;
			},
		},
		toggleFilter: {
			reducer: (state, { payload }) => {
				let filter = state.getIn(['history', 'filter', payload.filter, payload.index]);
				filter = filter.set('selected', !filter.get('selected'));

				state = state.setIn(['history', 'filter', payload.filter, payload.index], filter);
				return state;
			},
		},
	},
});
