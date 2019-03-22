/* eslint-disable react/prop-types */ // TODO::
import * as React from 'react';

export default class App extends React.Component {

	render() {
		const { children } = this.props;
		return <React.Fragment>{children}</React.Fragment>;
	}

}
