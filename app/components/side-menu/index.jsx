import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-animated-css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { Sidebar, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { lockApp } from '../../actions/global-actions';
import { WALLET, MANAGE_ACCOUNTS, HISTORY } from '../../constants/routes-constants';

import lock from '../../assets/images/lock.png';


class SideMenu extends React.Component {

	lock() {
		this.props.lock();
	}


	render() {
		const { pathname, locked } = this.props;

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
						<ul className="sidebar-nav">
							<li className={classnames({ active: pathname === WALLET })}>
								<FormattedMessage id="wallet.menu.mywallet">
									{
										(content) => (
											<Button
												className="sidebar-nav-link"
												content={content}
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
											/>
										)
									}
								</FormattedMessage>
							</li>
							<li>
								<FormattedMessage id="wallet.menu.settings">
									{
										(content) => (
											<Button
												className="sidebar-nav-link"
												content={content}
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
