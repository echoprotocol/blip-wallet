/* eslint-disable no-undef */
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

import {
	OPERATION_DEFINITION, SUBSCRIPTION,
} from '../constants/graphql-constants';
import { MAX_RETRIES } from '../constants/global-constants';

const cache = new InMemoryCache({
	dataIdFromObject: (o) => (o._id ? `${o.__typename}:${o._id}` : null), // eslint-disable-line no-underscore-dangle
});

const defaultOptions = {
	watchQuery: {
		fetchPolicy: 'network-only',
		errorPolicy: 'ignore',
	},
	query: {
		fetchPolicy: 'network-only',
		errorPolicy: 'all',
	},
};

class Graphql {

	init(network) {
		const httpLink = new HttpLink({ uri: ECHODB[network].HTTP_LINK });

		const wsLink = new WebSocketLink({
			uri: ECHODB[network].WS_LINK,
			options: {
				reconnect: true,
				reconnectionAttempts: MAX_RETRIES,
			},
		});

		const link = split(
			({ query }) => {
				const { kind, operation } = getMainDefinition(query);
				return (
					kind === OPERATION_DEFINITION && operation === SUBSCRIPTION
				);
			},
			wsLink,
			httpLink,
		);

		this.client = new ApolloClient({ cache, link, defaultOptions });
	}

	getClient() {
		return this.client;
	}

}

export default Graphql;
