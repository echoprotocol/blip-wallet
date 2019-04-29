import { connect } from 'react-redux';
import { CACHE_MAPS } from 'echojs-lib';
import Immutable from 'immutable';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';

import { FORM_SEND } from '../../constants/form-constants';
import {
	clearForm, setFormError, setFormValue, setValue,
} from '../../actions/form-actions';
import {
	checkAccount, send, setFeeFormValue, setMinAmount,
} from '../../actions/transfer-actions';

import Send from '../../components/send';

const filteredObjects = createSelector(
	(state) => state.wallet.get('balances'),
	(state) => state.echoCache.get(CACHE_MAPS.OBJECTS_BY_ID),
	(balances, objects) => balances.reduce(
		(map, s, a) => map.set(a, objects.get(a)).set(s, objects.get(s)),
		Immutable.Map({}),
	),
);

const createImmutableSelector = createSelectorCreator(defaultMemoize, Immutable.is);

const balanceSelector = createImmutableSelector(
	(state) => state.wallet.get('balances'),
	(state) => filteredObjects(state),
	(balances, objects) => balances.mapEntries(([statsId, assetId]) => ([
		statsId,
		{
			assetId,
			accountId: objects.getIn([statsId, 'owner']),
			symbol: objects.getIn([assetId, 'symbol']),
			precision: objects.getIn([assetId, 'precision']),
		},
	])),
);

export default connect(
	(state) => ({
		form: state.form.get(FORM_SEND),
		accounts: state.global.get('accounts'),
		balances: balanceSelector(state),
		tokens: state.wallet.get('tokens'),
		loading: state.global.get('loading'),
		hiddenAssets: state.wallet.get('hiddenAssets').get(state.global.get('currentNode')),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SEND, field, value)),
		checkAccount: (from, to) => dispatch(checkAccount(from, to)),
		setValue: (field, value) => dispatch(setValue(FORM_SEND, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_SEND, field, value)),
		send: () => dispatch(send()),
		setFeeFormValue: () => dispatch(setFeeFormValue()),
		clearForm: () => dispatch(clearForm(FORM_SEND)),
		setMinAmount: () => dispatch(setMinAmount()),
	}),
)(Send);
