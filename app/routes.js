import React from 'react';
import { Switch, Route } from 'react-router';

import App from './containers/app';
import Authorization from './containers/authorization';
import accountCreated from './containers/account-сreated';
import selectLanguage from './containers/select-language';
import accountImported from './containers/account-imported';
import CreatePassword from './containers/create-password';
import RestorePassword from './containers/restore-password';
import UnlockWallet from './containers/unlock-wallet';


import {
	AUTHORIZATION, CREATE_PASSWORD,
	RESTORE_PASSWORD, ACCOUNT_CREATED,
	ACCOUNT_IMPORTED, SELECT_LANGUAGE,
	UNLOCK_WALLET,
} from './constants/routes';

export default () => (
	<App>
		<Switch>
			<Route path={AUTHORIZATION} component={Authorization} />
			<Route path={ACCOUNT_CREATED} component={accountCreated} />
			<Route path={ACCOUNT_IMPORTED} component={accountImported} />
			<Route path={CREATE_PASSWORD} component={CreatePassword} />
			<Route path={RESTORE_PASSWORD} component={RestorePassword} />
			<Route path={SELECT_LANGUAGE} component={selectLanguage} />
			<Route path={UNLOCK_WALLET} component={UnlockWallet} />

		</Switch>
	</App>
);
