import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-animated-css';
import { FormattedMessage } from 'react-intl';
import blipLogo from '../../assets/images/blip-logo.svg';

class Header extends React.Component {

	render() {
		const { showLogo } = this.props;
		return (
			<header className="header">

				{showLogo && <div className="logo-wrap"><img src={blipLogo} alt="" /></div>}

				<Animated
					animationIn="slideInRight"
					animationOut="fadeOutLeft"
					className="page-title"
				>
					<FormattedMessage id="createPassword.title" />
				</Animated>
			</header>
		);
	}

}
Header.propTypes = {
	showLogo: PropTypes.bool.isRequired,
};

export default Header;
