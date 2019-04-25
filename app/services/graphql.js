import { ApolloClient } from 'apollo-client/index';
import { getMainDefinition } from 'apollo-utilities/lib/index';
import { split } from 'apollo-link/lib/index';
import { HttpLink } from 'apollo-link-http/lib/index';
import { WebSocketLink } from 'apollo-link-ws/lib/index';
import { InMemoryCache } from 'apollo-cache-inmemory/lib/index';

import {
	HTTP_LINK, OPERATION_DEFINITION, SUBSCRIPTION, WS_LINK,
} from '../constants/graphql-constants';
import { MAX_RETRIES } from '../constants/global-constants';

const httpLink = new HttpLink({
	uri: HTTP_LINK,
});

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

const cache = new InMemoryCache();

export default new ApolloClient({
	link,
	cache,
});
