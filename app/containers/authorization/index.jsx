import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { Animated } from 'react-animated-css';
import classnames from 'classnames';

import CreateAccount from './create-account';

import ImportAccount from './import-account';
import blipLogo from '../../assets/images/blip-logo.svg';
import AccountCreated from '../account-сreated';
import AccountImported from '../account-imported';

import { startAnimation } from '../../actions/animation-actions';

import { AUTHORIZATION } from '../../constants/routes-constants';

class Authorization extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,

			wif: '',
			accountName: '',
		};
	}

	componentWillUnmount() {
		this.props.startAnimation(AUTHORIZATION, true);
	}

	setActiveTab(e, active) {

		e.stopPropagation();
		this.props.startAnimation(AUTHORIZATION, false);
		this.setState({
			activeIndex: active,
		});

		setTimeout(() => {
			this.props.startAnimation(AUTHORIZATION, true);
			this.setState({
				activeIndex: active,
			});
		}, 200);
	}

	goForward(accountName, wif) {
		this.props.startAnimation(AUTHORIZATION, false);

		setTimeout(() => {
			this.setState({ wif, accountName });
		}, 200);
	}

	renderMenu() {
		const { isVisible } = this.props;
		const { activeIndex } = this.state;

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
			<FormattedMessage id="account.import.title" />
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

		const { activeIndex } = this.state;
		const { isVisible } = this.props;
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
											goForward={(accountName, wif) => this.goForward(accountName, wif)}
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

		if (wif) {
			return (<AccountCreated wif={wif} accountName={accountName} />);
		}

		if (accountName) {
			return (<AccountImported accountName={accountName} />);
		}

		return this.renderAuth();
	}

}

Authorization.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	startAnimation: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		isVisible: state.animation.getIn([AUTHORIZATION, 'isVisible']),
	}),
	(dispatch) => ({
		startAnimation: (type, value) => dispatch(startAnimation(type, value)),
	}),
)(Authorization);
