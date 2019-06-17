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

import { AUTHORIZATION } from '../../constants/routes-constants';
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
		this.props.startAnimation(AUTHORIZATION, true);
	}

	onChangeFormData(form, field, value) {
		this.setState((prevState) => ({ [form]: { ...prevState[form], [field]: value } }));
	}

	async setActiveTab(e, active) {

		e.stopPropagation();
		this.props.startAnimation(AUTHORIZATION, false);
		this.setState({
			activeIndex: active,
		});

		await this.props.startAnimation(AUTHORIZATION, true);

		this.setState({
			activeIndex: active,
		});

		this.props.changeActiveTabIndex(active);
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
		onMouseDown={(e) => this.setActiveTab(e, 0)}
	>
		<Animated
			animationIn={activeIndex ? 'fadeInRightBig' : 'fadeInRight'}
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
		onMouseDown={(e) => this.setActiveTab(e, 1)}
	>
		<Animated
			animationIn={!activeIndex ? 'fadeInRightBig' : 'fadeInRight'}
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
		const { activeIndex, importAccount, createAccount } = this.state;
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
};

export default connect(
	(state) => ({
		isVisible: state.animation.getIn([AUTHORIZATION, 'isVisible']),
		activeTabIndex: state.auth.get('activeTabIndex'),
	}),
	(dispatch) => ({
		startAnimation: (type, value) => dispatch(startAnimation(type, value)),
		changeActiveTabIndex: (value) => dispatch(changeActiveTabIndex(value)),
	}),
)(Authorization);
