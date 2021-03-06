import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/app';
import Authorization from './containers/authorization';
import accountCreated from './containers/account-created';
import accountImported from './containers/account-imported';
import CreatePassword from './containers/create-password';
import RestorePassword from './containers/restore-password';
import ManageAccounts from './containers/manage-accounts';
import Send from './containers/send';
import Receive from './containers/receive';
import Wallet from './containers/wallet';
import History from './containers/history';
import Settings from './containers/settings';
import FrozenFunds from './containers/frozen-funds';

import Page404 from './components/page404/page404';

import {
	AUTHORIZATION, CREATE_PASSWORD,
	RESTORE_PASSWORD, ACCOUNT_CREATED,
	ACCOUNT_IMPORTED, RECEIVE,
	WALLET, SEND, MANAGE_ACCOUNTS,
	HISTORY, SETTINGS, FROZEN_FUNDS,
} from './constants/routes-constants';


export default () => (
	<App>
		<Switch>
			<Route exact path={CREATE_PASSWORD} component={CreatePassword} />
			<Route exact path={RESTORE_PASSWORD} component={RestorePassword} />
			<Route exact path={AUTHORIZATION} component={Authorization} />
			<Route exact path={ACCOUNT_CREATED} component={accountCreated} />
			<Route exact path={ACCOUNT_IMPORTED} component={accountImported} />
			<Route exact path={WALLET} component={Wallet} />
			<Route exact path={HISTORY} component={History} />
			<Route exact path={MANAGE_ACCOUNTS} component={ManageAccounts} />
			<Route exact path={SEND} component={Send} />
			<Route exact path={SETTINGS} component={Settings} />
			<Route exact path={RECEIVE} component={Receive} />
			<Route exact path={FROZEN_FUNDS} component={FrozenFunds} />

			<Route exact path="*" component={Page404} />


		</Switch>
	</App>
);
