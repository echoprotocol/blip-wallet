import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Animated } from 'react-animated-css';

import BlipDimmer from '../components/blip-dimmer';
import SideMenu from '../components/side-menu';
import Unlock from '../components/unlock-wallet';
import { PUBLIC_ROUTES } from '../constants/routes';


class App extends React.Component {

	render() {

		const {
			children, loading, locked,
			pathname, dimmerContent,
		} = this.props;

		return (
			<React.Fragment>

				{ (PUBLIC_ROUTES.includes(pathname) || locked) && <div className="bg" />}

				<div
					className="global-wrap"
				>
					{locked
						? (
							<Animated
								animationIn="fadeInRightBig"
								animationOut="fadeOutLeft"
								isVisible={locked}
								className="unlock-page"
								animateOnMount={false}
							>
								<Unlock />
							</Animated>
						) : (
							<Animated
								animationIn="fadeInRightBig"
								animationOut="fadeOutLeft"
							>
								{children}
							</Animated>
						) }


				</div>
				{
					loading && (
						<BlipDimmer content={dimmerContent} />
					)
				}

				{ !PUBLIC_ROUTES.includes(pathname) && <SideMenu /> }
			</React.Fragment>

		);
	}

}

App.propTypes = {
	pathname: PropTypes.string.isRequired,
	loading: PropTypes.bool,
	locked: PropTypes.bool.isRequired,
	children: PropTypes.element.isRequired,
	dimmerContent: PropTypes.string,
};

App.defaultProps = {
	loading: false,
	dimmerContent: 'Account is about to be imported',
};

export default connect(
	(state) => ({
		locked: state.global.get('locked'),
		pathname: state.router.location.pathname,
	}),
)(App);
