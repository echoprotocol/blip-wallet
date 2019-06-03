import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-animated-css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { Sidebar, Button, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { lockApp } from '../../actions/global-actions';
import {
	WALLET, MANAGE_ACCOUNTS, SEND, HISTORY, SETTINGS, RECEIVE,
} from '../../constants/routes-constants';

import lock from '../../assets/images/lock.png';


class SideMenu extends React.Component {

	lock() {
		this.props.lock();
	}

	goTo(e, path) {
		e.target.blur();
		this.props.history.push(path);
	}


	render() {
		const { pathname, locked, history } = this.props;

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
							<li className={classnames({ active: pathname === WALLET })}>
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
	locked: PropTypes.bool.isRequired,
	lock: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		pathname: state.router.location.pathname,
		locked: state.global.get('locked'),
	}),
	(dispatch) => ({
		lock: () => dispatch(lockApp()),
	}),
)(SideMenu));
