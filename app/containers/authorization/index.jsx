import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { Animated } from 'react-animated-css';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CreateAccount from './create-account';

import ImportAccount from './import-account';
import blipLogo from '../../assets/images/blip-logo.svg';
import AccountCreated from '../account-сreated';
import AccountImported from '../account-imported';

import { startAnimation } from '../../actions/animation-actions';

import { AUTHORIZATION, CREATE_PASSWORD } from '../../constants/routes-constants';
import { changeActiveTabIndex } from '../../actions/auth-actions';

class Authorization extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: this.props.activeTabIndex,

			createAccount: {
				accountName: '',
			},
			importAccount: {
				wif: '',
				accountName: '',
			},
			wif: '',
			accountName: '',
		};
		this.onChangeFormData = this.onChangeFormData.bind(this);
	}

	componentWillUnmount() {
		this.props.startAnimation(AUTHORIZATION, 'isVisible', true);
	}

	onChangeFormData(form, field, value) {
		this.setState((prevState) => ({ [form]: { ...prevState[form], [field]: value } }));
	}

	async setActiveTab(e, active) {

		e.stopPropagation();
		await this.props.startAnimation(AUTHORIZATION, 'isVisible', false);
		await this.props.startAnimation(AUTHORIZATION, 'isVisible', true);
		this.setState({ activeIndex: active });
		this.props.changeActiveTabIndex(active);
	}

	goForward(accountName, wif) {
		this.props.startAnimation(AUTHORIZATION, 'isVisible', false);

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
	<Animated
		animationIn={activeIndex ? 'fadeInRightBig' : 'fadeInRight'}
		animationOut="fadeOutLeft"
		isVisible={isVisible}
		key="0"
	>
		<Button
			className={
				classnames(
					'menu-item',
					{ active: !activeIndex },
				)
			}
			disabled={!activeIndex}
			onMouseDown={(e) => this.setActiveTab(e, 0)}
		>
			<FormattedMessage id="account.create.title" />
		</Button>
	</Animated>,
			},
			{
				menuItem:
	<Animated
		key="1"
		animationIn={!activeIndex ? 'fadeInRightBig' : 'fadeInRight'}
		animationOut="fadeOutLeft"
		isVisible={isVisible}
	>
		<Button
			className={
				classnames(
					'menu-item',
					{ active: !!activeIndex },
				)
			}
			disabled={!!activeIndex}
			onMouseDown={(e) => this.setActiveTab(e, 1)}
		>
			<FormattedMessage id="account.import.title" />
		</Button>
	</Animated>,
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
		const { activeIndex, importAccount, createAccount } = this.state;
		const { isVisible, showLogo } = this.props;

		return (
			<div className="page">
				<div className="logo-wrap">
					{showLogo && <img src={blipLogo} alt="" />}
				</div>
				<div className="auth-tabs">
					<div className="menu">
						{
							this.renderMenu()
						}
					</div>
					<div className="segment tab">
						<PerfectScrollbar className="form-wrap">
							{
								activeIndex
									? (
										<ImportAccount
											accountName={importAccount.accountName}
											wif={importAccount.wif}
											onChange={(field, value) => this.onChangeFormData('importAccount', field, value)}
											goForward={(accountName, wif) => this.goForward(accountName, wif)}
											isVisible={isVisible}
										/>
									)
									: (
										<CreateAccount
											accountName={createAccount.accountName}
											onChange={(field, value) => this.onChangeFormData('createAccount', field, value)}
											goForward={(accountName, wif) => this.goForward(accountName, wif)}
											isVisible={isVisible}
										/>
									)
							}
						</PerfectScrollbar>
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
	activeTabIndex: PropTypes.number.isRequired,
	startAnimation: PropTypes.func.isRequired,
	changeActiveTabIndex: PropTypes.func.isRequired,
	showLogo: PropTypes.bool.isRequired,
};

export default connect(
	(state) => ({
		isVisible: state.animation.getIn([AUTHORIZATION, 'isVisible']),
		activeTabIndex: state.auth.get('activeTabIndex'),
		showLogo: state.animation.getIn([CREATE_PASSWORD, 'showLogo']),
	}),
	(dispatch) => ({
		startAnimation: (type, field, value) => dispatch(startAnimation(type, field, value)),
		changeActiveTabIndex: (value) => dispatch(changeActiveTabIndex(value)),
	}),
)(Authorization);
