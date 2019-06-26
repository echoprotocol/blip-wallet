import gql from 'graphql-tag';

import Services from '../index';

export const getHistoryByAccounts = (accounts, assets, tokens, operations, offset, count) => {
	const GET_HISTORY = gql`
	query($accounts: [AccountId!]!, $assets: [AssetId!], $tokens: [ContractId!], $operations: [OperationIdEnum!], $offset: Int, $count: Int) {
		getHistory(accounts: $accounts, assets: $assets, tokens: $tokens, operations: $operations, offset: $offset, count: $count) {
			items {
				id,
				body,
				transaction {
					block {
						round
					}
				},
				result
			},
			total
		}
	}
	`;

	return Services.getGraphql().getClient().query({
		query: GET_HISTORY,
		variables: {
			accounts,
			assets,
			tokens,
			operations,
			offset,
			count,
		},
	}).then(({ data }) => data.getHistory);
};

export const getCoinsByAccounts = (accounts) => {
	const GET_BALANCES = gql`
	query($accounts: [AccountId!]!) {
		getBalances(accounts: $accounts) {
			type,
			asset {
				id,
				symbol,
				precision
			},
			contract {
				id,
				token {
					symbol
				}
			}
		}
	}
	`;

	return Services.getGraphql().getClient().query({
		query: GET_BALANCES,
		variables: {
			accounts,
		},
	}).then(({ data }) => data.getBalances);
};
