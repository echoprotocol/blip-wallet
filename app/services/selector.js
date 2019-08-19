/* eslint-disable no-underscore-dangle */
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import Immutable from 'immutable';
import { CACHE_MAPS } from 'echojs-lib';

export default class Selector {

	_getSelectorCreator(equalizer) {
		return createSelectorCreator(defaultMemoize, equalizer);
	}

	_getFilteredBalances() {
		return createSelector(
			(state) => state.wallet.get('balances'),
			(state) => state.echoCache.get(CACHE_MAPS.OBJECTS_BY_ID),
			(balances, objects) => balances.reduce(
				(map, s, a) => map.set(a, objects.get(a)).set(s, objects.get(s)),
				Immutable.Map({}),
			),
		);
	}

	_getFilteredHistories() {
		return createSelector(
			(state) => state.global.get('accounts').filter((a) => a.get('selected')),
			(state) => state.echoCache.get(CACHE_MAPS.FULL_ACCOUNTS),
			(accounts, objects) => accounts.reduce(
				(map, name, id) => map.set(id, objects.getIn([id, 'history'])),
				Immutable.Map({}),
			),
		);
	}

	getHistorySelector() {
		return this._getSelectorCreator(Immutable.is)(
			(state) => state.global.get('accounts').filter((a) => a.get('selected')),
			(state) => this._getFilteredHistories()(state),
			(accounts, histories) => accounts.mapKeys((accountId) => ([accountId, histories.get(accountId)])),
		);
	}

	getSelectedAccountBalancesSelector() {
		return this._getSelectorCreator(Immutable.is)(
			(state) => state.wallet.get('balances'),
			(state) => this._getFilteredBalances()(state),
			(state) => state.global.get('accounts'),
			(balances, objects, accounts) => balances.mapEntries(([statsId, assetId]) => ([
				statsId,
				{
					asset: objects.get(assetId),
					amount: objects.getIn([statsId, 'balance']),
					id: objects.getIn([statsId, 'id']),
					owner: objects.getIn([statsId, 'owner']),
				},
			])).filter((balance) => accounts.find((account, id) => account.get('selected') && id === balance.owner)),
		);
	}

	getWalletBalanceSelector() {
		return this._getSelectorCreator(Immutable.is)(
			(state) => state.wallet.get('balances'),
			(state) => this._getFilteredBalances()(state),
			(balances, objects) => balances.mapEntries(([statsId, assetId]) => ([
				statsId,
				{
					asset: objects.get(assetId),
					amount: objects.getIn([statsId, 'balance']),
					id: objects.getIn([statsId, 'id']),
					owner: objects.getIn([statsId, 'owner']),
				},
			])),
		);
	}

	getTransferBalanceSelector() {
		return this._getSelectorCreator(Immutable.is)(
			(state) => state.wallet.get('balances'),
			(state) => this._getFilteredBalances()(state),
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
	}

	getPositiveBalanceAccountsSelector() {
		return this._getSelectorCreator(Immutable.is)(
			(state) => state.global.get('accounts'),
			(state) => state.echoCache.get(CACHE_MAPS.FULL_ACCOUNTS),
			(state) => state.echoCache.get(CACHE_MAPS.OBJECTS_BY_ID),
			(accounts, fullAccounts, objectsById) => accounts.filter((name, id) => {
				const account = fullAccounts.get(id);

				if (!account || !account.get('balances')) {
					return false;
				}

				return account.get('balances').find(
					(stats, assetId) => objectsById.getIn([stats, 'balance']) && objectsById.get(assetId),
				);
			}),
		);
	}

}
