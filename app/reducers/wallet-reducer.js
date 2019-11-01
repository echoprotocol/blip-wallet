import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

const DEFAULT_FIELDS = Map({
	loading: false,
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
	tokens: new List([]),
	hiddenAssets: new Map({}),
	frozenBalances: [],
	freezeSum: 0,
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
		clearIn: {
			reducer: (state, { payload }) => {
				payload.params.forEach((field) => {
					state = state.setIn([payload.field, field], DEFAULT_FIELDS.getIn([payload.field, field]));
				});

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
		mergeIn: {
			reducer: (state, { payload }) => {
				Object.keys(payload.params).forEach((field) => {
					let param = state.getIn([payload.field, field]);

					if (List.isList(param)) {
						param = param.concat(payload.params[field]);
					} else if (Map.isMap(param)) {
						param = param.merge(payload.params[field]);
					} else {
						param = payload.params[field];
					}

					state = state.setIn([payload.field, field], param);
				});

				return state;
			},
		},
		addOperation: {
			reducer: (state, { payload }) => {
				const transactions = state.getIn(['history', 'transactions']);
				state = state.setIn(['history', 'transactions'], new List([payload.operation]).concat(transactions));
				state = state.setIn(['history', 'total'], state.getIn(['history', 'total']) + 1);

				return state;
			},
		},
	},
});
