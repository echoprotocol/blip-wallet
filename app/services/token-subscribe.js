import { fromJS } from 'immutable';

import { balanceUpdated, newBalance } from './subscriptions/balances';
import { ASSET_TYPE } from '../constants/graphql-constants';

class TokenSubscribe {

	/**
	 *
	 * @param emitter
	 * @param graphql
	 */
	constructor(emitter, graphql) {
		this.updateTokenSubscribe = null;
		this.newTokenSubscribe = null;
		this.emitter = emitter;
		this.graphql = graphql;
	}

	/**
	 *
	 * @param accounts
	 * @param source
	 * @returns {Promise<void>}
	 */
	async subscribe(accounts, source) {
		if (this.updateTokenSubscribe) {
			this.updateTokenSubscribe.unsubscribe();
		}

		const updatedItems = await balanceUpdated(accounts, this.graphql);

		const nextupdate = (data) => {
			const v = data.data.balanceUpdated;
			const findIndex = source.findIndex((token) => {
				if (v.type === ASSET_TYPE) {
					return false;
				}

				return token.getIn(['account', 'id']) === v.account.id && token.getIn(['contract', 'id']) === v.contract.id;
			});
			if (findIndex >= 0) {
				source = source.delete(findIndex);
			}
			source = source.push(fromJS(v));
			this.emitter.emit('setTokens', source);
		};

		this.updateTokenSubscribe = updatedItems.subscribe({
			next: nextupdate.bind(this),
			error(err) { console.warn('Update token error: ', err.message || err); },
		});

		if (this.newTokenSubscribe) {
			this.newTokenSubscribe.unsubscribe();
		}

		const nextNew = (data) => {
			const v = data.data.newBalance;
			source = source.push(fromJS(v));
			this.emitter.emit('setTokens', source);
		};

		const newItems = await newBalance(accounts, this.graphql);
		this.newTokenSubscribe = newItems.subscribe({
			next: nextNew.bind(this),
			error(err) { console.warn('New token subscribe error: ', err.message || err); },
		});
	}

}

export default TokenSubscribe;
