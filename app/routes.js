import React from 'react';
import { Switch, Route } from 'react-router';

import {
	AUTHORIZATION,
	ACCOUNT_CREATED,
	SELECT_LANGUAGE,
} from './constants/routes';

import App from './containers/app';
import Authorization from './containers/authorization';
import accountCreated from './containers/account-сreated';
import selectLanguage from './containers/select-language';


export default () => (
	<App>
		<Switch>
			<Route path={AUTHORIZATION} component={Authorization} />
			<Route path={ACCOUNT_CREATED} component={accountCreated} />
			<Route path={SELECT_LANGUAGE} component={selectLanguage} />
		</Switch>
	</App>
);
