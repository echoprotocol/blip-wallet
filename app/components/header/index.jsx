import React from 'react';
import blipLogo from '../../assets/images/blip-logo.svg';

class Header extends React.Component {

	render() {
		return (

			<header className="header">
				<div className="logo-wrap">
					<a href="/">
						<img src={blipLogo} alt="" />
					</a>
				</div>
				<div className="page-title">
					{'Create Password'}
				</div>
			</header>
		);
	}

}


export default Header;
