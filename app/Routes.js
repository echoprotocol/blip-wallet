import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import Authorization from './containers/Authorization';


export default () => (
	<App>
		<Switch>
			<Route path={routes.AUTHORIZATION} component={Authorization} />
		</Switch>
	</App>
);
