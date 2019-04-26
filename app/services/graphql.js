import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

import {
	HTTP_LINK, WS_LINK, OPERATION_DEFINITION, SUBSCRIPTION,
} from '../constants/graphql-constants';
import { MAX_RETRIES } from '../constants/global-constants';

const cache = new InMemoryCache();

const httpLink = new HttpLink({ uri: HTTP_LINK });

const wsLink = new WebSocketLink({
	uri: WS_LINK,
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

export default new ApolloClient({ cache, link });
