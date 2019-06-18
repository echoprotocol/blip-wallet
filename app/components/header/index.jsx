import React from 'react';
import { Animated } from 'react-animated-css';
import { FormattedMessage } from 'react-intl';

class Header extends React.Component {

	render() {

		return (
			<header className="header">
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

export default Header;
