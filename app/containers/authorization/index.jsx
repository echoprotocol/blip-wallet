import React from 'react';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { Animated } from 'react-animated-css';
import classnames from 'classnames';

import CreateAccount from './create-account';

import ImportAccount from './import-account';
import blipLogo from '../../assets/images/blip-logo.svg';
import AccountCreated from '../account-сreated';


class Authorization extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			isVisible: true,
			wif: '',
			accountName: '',
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (props.locked) {
			return { isVisible: false };
		}
		return state;
	}

	setActiveTab(e, active) {

		e.stopPropagation();
		this.setState({
			isVisible: false,
			activeIndex: active,
		});

		setTimeout(() => {
			this.setState({
				isVisible: true,
				activeIndex: active,
			});
		}, 150);
	}

	goForward(accountName, wif) {
		this.setState({
			isVisible: false,
		});

		setTimeout(() => {
			this.setState({ wif, accountName });
		}, 200);
	}

	renderMenu() {
		const { activeIndex, isVisible } = this.state;

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
			isVisible={isVisible}
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
			isVisible={isVisible}
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

		const { activeIndex, isVisible } = this.state;
		return (
			<div className="page">
				<div className="logo-wrap">
					<img src={blipLogo} alt="" />
				</div>
				<div className="auth-tabs">
					<div className="menu">
						{
							this.renderMenu()
						}
					</div>
					<div className="segment active tab">
						<div className="inner">
							{
								activeIndex
									? (
										<ImportAccount
											goForward={(path) => this.goForward(path)}
											isVisible={isVisible}
										/>
									)
									: (
										<CreateAccount
											goForward={(accountName, wif) => this.goForward(accountName, wif)}
											isVisible={isVisible}
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
