import gql from 'graphql-tag';

/**
 *
 * @param accounts
 * @param client
 * @returns {Promise<*>}
 */
export const balanceUpdated = async (accounts, client) => {
	const query = gql`
		subscription balanceUpdated($accounts: [AccountId!]!) {
			balanceUpdated(accounts: $accounts) {
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

	return client.subscribe({ query, variables: { accounts } });
};

/**
 *
 * @param accounts
 * @param client
 * @returns {Promise<*>}
 */
export const newBalance = async (accounts, client) => {
	const query = gql`
		subscription newBalance($accounts: [AccountId!]!) {
			newBalance(accounts: $accounts) {
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

	return client.subscribe({ query, variables: { accounts } });
};
