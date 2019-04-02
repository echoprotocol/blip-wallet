import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Animated } from 'react-animated-css';
import classnames from 'classnames';

import SignIn from './sign-in';
import ImportAccount from './import-account';
import blipLogo from '../../assets/images/blip-logo.svg';
import googleLogo from '../../assets/images/google-logo.svg';


class Authorization extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			isVisibleMenu: true,
			isVisibleTab: true,
		};
	}

	setActiveTab(e, active) {

		e.stopPropagation();
		this.setState({
			isVisibleMenu: false,
			isVisibleTab: false,
			activeIndex: active,
		});

		setTimeout(() => {
			this.setState({
				isVisibleTab: true,
			});
		}, 200);

		setTimeout(() => {
			this.setState({
				isVisibleMenu: true,
			});
		}, 100);

	}

	goForward(path) {

		const { history } = this.props;

		this.setState({
			isVisibleTab: false,
			isVisibleMenu: false,
		});

		setTimeout(() => {
			history.push(path);
		}, 200);
	}

	renderMenu() {
		const { activeIndex, isVisibleMenu } = this.state;

		const menuItems = [
			{
				menuItem:
	<Button
		key="0"
		className={
			classnames(
				'menu-item',
				{ active: !activeIndex },
			)
		}
		disabled={!activeIndex}
		onClick={(e) => this.setActiveTab(e, 0)}
	>
		<Animated
			animationIn={activeIndex ? 'fadeInRightBig' : 'slideInRight'}
			animationOut="fadeOutLeft"
			isVisible={isVisibleMenu}
		>
			Create new account
		</Animated>
	</Button>,
			},
			{
				menuItem:
	<Button
		key="1"
		className={
			classnames(
				'menu-item',
				{ active: !!activeIndex },
			)
		}
		disabled={!!activeIndex}
		onClick={(e) => this.setActiveTab(e, 1)}
	>
		<Animated
			animationIn={!activeIndex ? 'fadeInRightBig' : 'slideInRight'}
			animationOut="fadeOutLeft"
			isVisible={isVisibleMenu}
		>
			Import account
		</Animated>

	</Button>,
			},
		];

		if (activeIndex) {
			menuItems.reverse();
		}

		return (
			menuItems.map((item) => (
				item.menuItem
			)));
	}

	render() {

		const { activeIndex, isVisibleTab } = this.state;

		return (
			<div className="main-bg">
				<div className="logo-wrap">
					<img src={blipLogo} alt="" />
				</div>
				<div className="auth-tabs">
					<div className="menu">
						{
							this.renderMenu()
						}

						<Button
							className="g-auth"
							content={(
								<React.Fragment>
									<img className="ic" src={googleLogo} alt="" />
									<span className="text">Sign in with Google</span>
								</React.Fragment>
							)}
						/>
					</div>
					<div className="segment active tab">
						<div className="inner">
							{
								activeIndex
									? (
										<ImportAccount
											goForward={(path) => this.goForward(path)}
											isVisible={isVisibleTab}
										/>
									)
									: (
										<SignIn
											goForward={(path) => this.goForward(path)}
											isVisible={isVisibleTab}
										/>
									)
							}
						</div>
					</div>
				</div>

			</div>
		);
	}

}
Authorization.propTypes = {
	history: PropTypes.object.isRequired,
};
export default Authorization;
