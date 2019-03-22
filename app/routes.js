import React from 'react';
import { Switch, Route } from 'react-router';

import { AUTHORIZATION, ACCOUNT_CREATED } from './constants/routes';
import App from './containers/app';
import Authorization from './containers/authorization';
import accountCreated from './containers/account-сreated';

export default () => (
	<App>
		<Switch>
			<Route path={AUTHORIZATION} component={Authorization} />
			<Route path={ACCOUNT_CREATED} component={accountCreated} />
		</Switch>
	</App>
);
