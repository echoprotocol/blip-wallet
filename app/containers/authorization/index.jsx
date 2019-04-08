import React from 'react';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { Animated } from 'react-animated-css';
import classnames from 'classnames';

import CreateAccount from './create-account';
import ImportAccount from './import-account';
import blipLogo from '../../assets/images/blip-logo.svg';
import googleLogo from '../../assets/images/google-logo.svg';
import AccountCreated from '../account-сreated';


class Authorization extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			isVisibleMenu: true,
			isVisibleTab: true,
			wif: '',
			accountName: '',
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

	goForward(accountName, wif) {
		this.setState({
			isVisibleTab: false,
			isVisibleMenu: false,
		});

		setTimeout(() => {
			this.setState({ wif, accountName });
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
			<FormattedMessage id="account.create.title" />
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
			<FormattedMessage id="account.import" />
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

	renderAuth() {

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
									<span className="text"><FormattedMessage id="account.google" /></span>
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
										<CreateAccount
											goForward={(accountName, wif) => this.goForward(accountName, wif)}
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

	render() {
		const { wif, accountName } = this.state;

		return (
			wif ? <AccountCreated wif={wif} accountName={accountName} /> : this.renderAuth()
		);
	}

}

export default Authorization;
