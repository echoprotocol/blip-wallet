import gql from 'graphql-tag';

import client from '../graphql';

export const getHistoryByAccounts = (accounts, assets, tokens, operations) => {
	const GET_HISTORY = gql`
	query($accounts: [AccountId!]!, $assets: [AssetId!], $tokens: [ContractId!], $operations: [OperationIdEnum!]) {
		getHistory(from: $accounts, assets: $assets, tokens: $tokens, operations: $operations) {
			items {
				id,
				body
			},
			total
		}
	}
	`;

	return client.query({
		query: GET_HISTORY,
		variables: {
			accounts,
			assets,
			tokens,
			operations,
		},
	}).then(({ data }) => data.getHistory);
};

export const getCoinsByAccounts = (accounts) => {
	const GET_BALANCES = gql`
	query($accounts: [AccountId!]!) {
		getBalances(accounts: $accounts) {
			type,
			contract {
				id,
				token {
					symbol
				}
			}
		}
	}
	`;

	return client.query({
		query: GET_BALANCES,
		variables: {
			accounts,
		},
	}).then(({ data }) => data.getBalances);
};
