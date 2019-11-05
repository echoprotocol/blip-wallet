import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import {
	FORM_SIGN_IN,
	FORM_CREATE_PASSWORD,
	FORM_UNLOCK,
	FORM_SIGN_UP,
	FORM_SEND,
	FORM_RECEIVE,
	FORM_FREEZE,
} from '../constants/form-constants';

const DEFAULT_FIELDS = Map({
	error: null,
	loading: false,
});

const DEFAULT_FORM_FIELDS = {
	[FORM_UNLOCK]: Map({
		error: null,
	}),
	[FORM_SIGN_UP]: Map({
		registrator: {
			public: true,
			account: null,
			fee: null,
		},
		isBlockchainError: false,
	}),
	[FORM_SIGN_IN]: Map({
		accountNameError: '',
		wifError: '',
	}),
	[FORM_SEND]: Map({
		from: {
			value: '',
			error: null,
		},
		to: {
			value: '',
			error: null,
		},
		isCheckLoading: false,
		amount: {
			value: '',
			error: null,
		},
		fee: {
			value: '',
			error: null,
		},
		selectedBalance: '',
		selectedFeeBalance: '',
		minAmount: {
			amount: '',
			symbol: '',
		},
		echoAsset: {
			symbol: '',
			precision: '',
		},
		initialData: {
			accountId: '',
			symbol: '',
		},
	}),
	[FORM_FREEZE]: Map({
		from: {
			value: '',
			error: null,
		},
		isCheckLoading: false,
		amount: {
			value: '',
			error: null,
		},
		fee: {
			value: '',
			error: null,
		},
		duration: '',
		selectedBalance: '',
		selectedFeeBalance: '',
		minAmount: {
			amount: '',
			symbol: '',
		},
		echoAsset: {
			symbol: '',
			precision: '',
		},
		initialData: {
			accountId: '',
			symbol: '',
		},
	}),
	[FORM_RECEIVE]: Map({
		selectedAccount: {
			value: '',
			error: null,
		},
		amount: {
			value: '',
			error: null,
		},
		selectedBalance: '',
	}),
};

export default createModule({
	name: 'form',
	initialState: Map({
		[FORM_CREATE_PASSWORD]: _.cloneDeep(DEFAULT_FIELDS),
		[FORM_UNLOCK]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_UNLOCK]),
		[FORM_SIGN_UP]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_SIGN_UP]),
		[FORM_SIGN_IN]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_SIGN_IN]),
		[FORM_SEND]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_SEND]),
		[FORM_RECEIVE]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_RECEIVE]),
		[FORM_FREEZE]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_FREEZE]),
	}),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.form, payload.field], payload.value);

				return state;
			},
		},

		setIn: {
			reducer: (state, { payload }) => {
				const field = state.getIn([payload.form, payload.field]);

				state = state.setIn([payload.form, payload.field], {
					...field,
					...payload.params,
				});

				return state;
			},
		},

		setFormValue: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.form, 'error'], null);
				const field = state.getIn([payload.form, payload.field]);

				state = state.setIn([payload.form, payload.field], Object.assign({}, field, {
					...field,
					value: payload.value,
					error: null,
				}));

				return state;
			},
		},

		setFormError: {
			reducer: (state, { payload }) => {
				if (payload.field === 'error') {
					state = state.setIn([payload.form, payload.field], payload.value);
				} else {
					const field = state.getIn([payload.form, payload.field]);

					state = state.setIn([payload.form, payload.field], Object.assign({}, field, {
						...field,
						error: payload.value,
					}));
				}

				return state;
			},
		},

		toggleLoading: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.form, 'loading'], !!payload.value);

				return state;
			},
		},

		clearForm: {
			reducer: (state, { payload }) => {
				const form = _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[payload.form]);
				state = state.set(payload.form, form);

				return state;
			},
		},
	},
});
