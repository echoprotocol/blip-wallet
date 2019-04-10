import React from 'react';
import { Animated } from 'react-animated-css';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import blipLogo from '../../assets/images/blip-logo.svg';

class Header extends React.Component {

	render() {
		return (

			<header className="header">
				<div className="logo-wrap">
					<Link to="/">
						<img src={blipLogo} alt="" />
					</Link>
				</div>
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
