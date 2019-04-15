import { connect } from 'react-redux';
import Immutable from 'immutable';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { CACHE_MAPS } from 'echojs-lib';

import { saveSelectedAccounts, updateBalance } from '../../actions/balance-actions';
import Wallet from '../../components/wallet';


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
			asset: objects.get(assetId),
			amount: objects.getIn([statsId, 'balance']),
			id: objects.getIn([statsId, 'id']),
		},
	])),
);

export default connect(
	(state) => ({
		accounts: state.global.get('accounts'),
		language: state.global.get('language'),
		currentNode: state.global.get('currentNode'),
		balances: balanceSelector(state),
	}),
	(dispatch) => ({
		updateBalance: () => dispatch(updateBalance()),
		saveSelectedAccounts: (accounts) => dispatch(saveSelectedAccounts(accounts)),
	}),
)(Wallet);
