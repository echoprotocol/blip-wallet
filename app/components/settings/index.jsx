import React from 'react';
import PropTypes from 'prop-types';

import Networks from './networks';

class Settings extends React.Component {

	render() {
		return (
			<Networks
				networks={this.props.networks}
				changeNetwork={this.props.changeNetwork}
			/>
		);
	}

}

Settings.propTypes = {
	networks: PropTypes.object.isRequired,
	changeNetwork: PropTypes.func.isRequired,
};

// Settings.defaultProps = {};

export default Settings;
