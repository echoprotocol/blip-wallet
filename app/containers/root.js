// @flow
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

// import type { Store } from '../reducers/types';
import Routes from '../routes';
import { initApp } from '../actions/global-actions';

// type Props = {
//   store: Store,
//   history: {}
// };

export default class Root extends Component {

	componentDidMount() {
		const { store } = this.props;
		store.dispatch(initApp(store));
	}

	render() {
		const { store, history } = this.props;

		return (
			<Provider store={store}>
				<ConnectedRouter history={history}><Routes /></ConnectedRouter>
			</Provider>
		);
	}

}
