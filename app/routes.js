import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import App from './containers/app';
import Authorization from './containers/authorization';
import accountCreated from './containers/account-сreated';
import selectLanguage from './containers/select-language';
import accountImported from './containers/account-imported';
import CreatePassword from './containers/create-password';
import RestorePassword from './containers/restore-password';
import Page404 from './components/page404/page404';

import {
	AUTHORIZATION, CREATE_PASSWORD,
	RESTORE_PASSWORD, ACCOUNT_CREATED,
	ACCOUNT_IMPORTED, SELECT_LANGUAGE,
	WALLET,
	INDEX_ROUTE,
} from './constants/routes-constants';
import Wallet from './containers/wallet';


export default () => (
	<App>
		<Switch>
			<Redirect exact from={INDEX_ROUTE} to={SELECT_LANGUAGE} />
			<Route exact path={CREATE_PASSWORD} component={CreatePassword} />
			<Route exact path={RESTORE_PASSWORD} component={RestorePassword} />
			<Route exact path={SELECT_LANGUAGE} component={selectLanguage} />
			<Route exact path={AUTHORIZATION} component={Authorization} />
			<Route exact path={ACCOUNT_CREATED} component={accountCreated} />
			<Route exact path={ACCOUNT_IMPORTED} component={accountImported} />
			<Route exact path={WALLET} component={Wallet} />
			<Route exact path="*" component={Page404} />
		</Switch>
	</App>
);
