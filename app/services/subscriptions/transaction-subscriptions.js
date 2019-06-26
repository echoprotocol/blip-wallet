import gql from 'graphql-tag';

import Services from '../index';

import { ASSET_TYPE, TOKEN_TYPE } from '../../constants/graphql-constants';

export const newOperation = (filter) => {
	if (!filter.get('accounts') && !filter.get('coins') && !filter.get('types')) {
		return null;
	}

	const accounts = filter.get('accounts')
		.filter((a) => a.get('selected'))
		.reduce((arr, a) => ([...arr, a.get('id')]), []);
	const assets = filter.get('coins')
		.filter((c) => (c.get('type') === ASSET_TYPE && c.get('selected')))
		.reduce((arr, c) => [...arr, c.getIn(['asset', 'id'])], []);
	const tokens = filter.get('coins')
		.filter((c) => (c.get('type') === TOKEN_TYPE && c.get('selected')))
		.reduce((arr, c) => [...arr, c.getIn(['contract', 'id'])], []);
	const operations = filter.get('types')
		.filter((o) => o.get('selected'))
		.reduce((arr, o) => [...arr, o.get('type').toUpperCase()], []);


	const NEW_OPERATION = gql`
	subscription($accounts: [AccountId!]!, $assets: [AssetId!], $tokens: [ContractId!], $operations: [OperationIdEnum!]) {
		newOperation(accounts: $accounts, assets: $assets, tokens: $tokens, operations: $operations) {
			id,
			body,
			transaction {
				block {
					round
				}
			},
			result
		}
	}
	`;

	return Services.getGraphql().getClient().subscribe({
		query: NEW_OPERATION,
		variables: {
			accounts,
			assets,
			tokens,
			operations,
		},
	});
};
