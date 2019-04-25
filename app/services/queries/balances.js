import gql from 'graphql-tag';
import Services from '..';

export const getBalances = async (accounts) => {
	const query = gql`
		query getBalances($accounts: [AccountId!]!) {
			getBalances(accounts: $accounts) {
				type
				amount
				account {
					id
				}
				contract {
					id
					type
					token {
						symbol
						decimals
					}
				}
			}
		}
	`;

	const client = Services.getGraphql();
	return client.query({ query, variables: { accounts } });
};
