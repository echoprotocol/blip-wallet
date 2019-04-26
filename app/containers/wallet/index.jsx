import { connect } from 'react-redux';
import Immutable, { Set } from 'immutable';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { CACHE_MAPS } from 'echojs-lib';

import {
	toggleVisibiltyAsset,
	initHiddenAssets,
	initTokens,
	saveSelectedAccounts,
	updateBalance,
} from '../../actions/balance-actions';
import { setLastTransaction } from '../../actions/transaction-actions';
import Wallet from '../../components/wallet';

const filteredHistories = createSelector(
	(state) => state.global.get('accounts').filter((a) => a.get('selected')),
	(state) => state.echoCache.get(CACHE_MAPS.FULL_ACCOUNTS),
	(accounts, objects) => accounts.reduce(
		(map, name, id) => map.set(id, objects.getIn([id, 'history'])),
		Immutable.Map({}),
	),
);

const filteredObjects = createSelector(
	(state) => state.wallet.get('balances'),
	(state) => state.echoCache.get(CACHE_MAPS.OBJECTS_BY_ID),
	(balances, objects) => balances.reduce(
		(map, s, a) => map.set(a, objects.get(a)).set(s, objects.get(s)),
		Immutable.Map({}),
	),
);

const createImmutableSelector = createSelectorCreator(defaultMemoize, Immutable.is);

const historySelector = createImmutableSelector(
	(state) => state.global.get('accounts').filter((a) => a.get('selected')),
	(state) => filteredHistories(state),
	(accounts, histories) => accounts.mapKeys((accountId) => ([accountId, histories.get(accountId)])),
);

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
		hiddenAssets: state.wallet.get('hiddenAssets').get(state.global.get('currentNode')) || new Set(),
		language: state.global.get('language'),
		currentNode: state.global.get('currentNode'),
		balances: balanceSelector(state),
		transaction: state.wallet.get('transaction'),
		histories: historySelector(state),
		tokens: state.wallet.get('tokens'),
	}),

	(dispatch) => ({
		updateBalance: () => dispatch(updateBalance()),
		setTransaction: () => dispatch(setLastTransaction()),
		saveSelectedAccounts: (accounts) => dispatch(saveSelectedAccounts(accounts)),
		toggleVisibiltyAsset: (idAsset, idNetwork) => dispatch(toggleVisibiltyAsset(idAsset, idNetwork)),
		initHiddenAssets: () => dispatch(initHiddenAssets()),
		updateTokens: () => dispatch(initTokens()),
	}),
)(Wallet);
