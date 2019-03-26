import React from 'react';
import { Switch, Route } from 'react-router';

import { AUTHORIZATION, ACCOUNT_CREATED, ACCOUNT_IMPORTED } from './constants/routes';
import App from './containers/app';
import Authorization from './containers/authorization';
import accountCreated from './containers/account-сreated';
import accountImported from './containers/account-imported';


export default () => (
	<App>
		<Switch>
			<Route path={AUTHORIZATION} component={Authorization} />
			<Route path={ACCOUNT_CREATED} component={accountCreated} />
			<Route path={ACCOUNT_IMPORTED} component={accountImported} />
		</Switch>
	</App>
);
