/* eslint-disable react/prop-types */ // TODO::
import * as React from 'react';
import PropTypes from 'prop-types';

import BlipDimmer from '../components/blip-dimmer';

class App extends React.Component {

	render() {
		const { children, loading, dimmerContent } = this.props;
		return (
			<React.Fragment>
				{children}
				{
					loading && (
						<BlipDimmer content={dimmerContent} />
					)
				}
			</React.Fragment>
		);
	}

}

App.propTypes = {
	loading: PropTypes.bool,
	dimmerContent: PropTypes.string,
};

App.defaultProps = {
	loading: false,
	dimmerContent: 'Account is about to be imported',
};

export default App;
