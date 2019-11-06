import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-animated-css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import {
	Sidebar, Button, Icon, Popup,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { lockApp } from '../../actions/global-actions';
import {
	WALLET, MANAGE_ACCOUNTS, SEND, HISTORY, SETTINGS, RECEIVE, FROZEN_FUNDS,
} from '../../constants/routes-constants';
import Services from '../../services';
import { getBalance, getFrozenBalance } from '../../actions/balance-actions';
import { setFreezeDefaultFilter } from '../../actions/transaction-actions';
import { newOperation as newOperationSubscription } from '../../services/subscriptions/transaction-subscriptions';

import lock from '../../assets/images/lock.svg';


class SideMenu extends React.Component {

	constructor(props) {
		super(props);
		this.subscription = null;
	}

	componentDidMount() {
		this.props.getFrozenBalance();
		this.subscribe();
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	async subscribe() {
		await this.props.setFreezeDefaultFilter();
		const { filter } = this.props;
		this.subscription = newOperationSubscription(filter);
		if (this.subscription) {
			this.subscription = this.subscription.subscribe(() => {
				this.props.getFrozenBalance();
			});
		}
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
	}

	lock() {
		this.props.lock();
	}

	goTo(e, path) {
		e.target.blur();
		this.props.history.push(path);
	}


	render() {
		const {
			pathname, locked, history, balances, freezeSum,
		} = this.props;
		const balance = getBalance(balances);
		return (
			<Sidebar direction="right">
				<div className="sidebar-wrap">
					<Animated
						animationIn="fadeInRightBig"
						animationOut="fadeOut"
						animateOnMount={false}
						isVisible={!locked}
						className="visible"
					>
						{
							[SEND, RECEIVE].includes(pathname)
							&& (
								<Button
									className="btn-return arrow right"
									onClick={() => history.goBack()}
									content={(
										<React.Fragment>
											<div className="text">Return</div>
											<Icon className="arrow-right" />
										</React.Fragment>
									)}
								/>
							)
						}

						<ul className="sidebar-nav">
							<li className={classnames({ active: pathname === WALLET || pathname === FROZEN_FUNDS })}>
								<FormattedMessage id="wallet.menu.mywallet">
									{
										(content) => (
											<Button
												className="sidebar-nav-link"
												content={content}
												onClick={(e) => this.goTo(e, WALLET)}
											/>
										)
									}
								</FormattedMessage>
							</li>

							<li className="submenu">
								<Button
									className={classnames('sidebar-nav-link sub', { active: pathname === WALLET })}
									onClick={(e) => this.goTo(e, WALLET)}
									content={(
										<React.Fragment>
											<span>
												Balance
											</span>
											<span>{balance}</span> ECHO
										</React.Fragment>
									)}
								/>

							</li>
							<li className="submenu">
								<Button
									className={classnames('sidebar-nav-link sub', { active: pathname === FROZEN_FUNDS })}
									onClick={(e) => this.goTo(e, FROZEN_FUNDS)}
									content={(
										<React.Fragment>
											<span>Frozen funds</span>
											<Popup
												content="Frozen funds allow you to get bigger reward for participating in blocks creation."
												className="tooltip-frozen"
												trigger={<Icon className="info-empty" />}
											/>
											<span>{freezeSum}</span> ECHO
										</React.Fragment>
									)}
								/>
							</li>
							<li className={classnames({ active: pathname === HISTORY })}>
								<FormattedMessage id="wallet.menu.history">
									{
										(content) => (
											<Button
												className="sidebar-nav-link"
												content={content}
												onClick={(e) => this.goTo(e, HISTORY)}
											/>
										)
									}
								</FormattedMessage>
							</li>
							<li className={classnames({ active: pathname === MANAGE_ACCOUNTS })}>
								<FormattedMessage id="wallet.menu.manage">
									{
										(content) => (
											<Button
												className="sidebar-nav-link"
												content={content}
												onClick={(e) => this.goTo(e, MANAGE_ACCOUNTS)}
											/>
										)
									}
								</FormattedMessage>
							</li>
							<li className={classnames({ active: pathname === SETTINGS })}>
								<FormattedMessage id="wallet.menu.settings">
									{
										(content) => (
											<Button
												className="sidebar-nav-link"
												content={content}
												onClick={(e) => this.goTo(e, SETTINGS)}
											/>
										)
									}
								</FormattedMessage>
							</li>
						</ul>

						<Button
							className="btn-transparent"
							onClick={() => this.lock()}
							content={(
								<React.Fragment>
									<img className="icon" src={lock} alt="" />
									<FormattedMessage id="wallet.menu.lock" />
								</React.Fragment>
							)}
						/>
					</Animated>
				</div>
			</Sidebar>

		);
	}

}

SideMenu.propTypes = {
	pathname: PropTypes.string.isRequired,
	history: PropTypes.object.isRequired,
	balances: PropTypes.object.isRequired,
	locked: PropTypes.bool.isRequired,
	lock: PropTypes.func.isRequired,
	setFreezeDefaultFilter: PropTypes.func.isRequired,
	getFrozenBalance: PropTypes.func.isRequired,
	freezeSum: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	filter: PropTypes.object.isRequired,
};

export default withRouter(connect(
	(state) => {
		const balanceSelector = Services.getSelector().getSelectedAccountBalancesSelector();
		return ({
			pathname: state.router.location.pathname,
			locked: state.global.get('locked'),
			balances: balanceSelector(state),
			freezeSum: state.wallet.get('freezeSum'),
			accounts: state.global.get('accounts'),
			filter: state.wallet.getIn(['freeze', 'filter']),
		});
	},
	(dispatch) => ({
		lock: () => dispatch(lockApp()),
		getFrozenBalance: () => dispatch(getFrozenBalance()),
		setFreezeDefaultFilter: () => dispatch(setFreezeDefaultFilter()),
	}),
)(SideMenu));
