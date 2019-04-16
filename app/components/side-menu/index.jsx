import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-animated-css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { Sidebar, Button } from 'semantic-ui-react';
import { lockApp } from '../../actions/global-actions';
import { startAnimation } from '../../actions/animation-actions';
import { UNLOCK, WALLET } from '../../constants/routes-constants';

import lock from '../../assets/images/lock.png';


class SideMenu extends React.Component {

	goForward(path) {
		const { history } = this.props;

		setTimeout(() => {
			history.push(path);
		}, 200);
	}

	async lock() {

		this.props.startAnimation(this.props.pathname, false);
		this.props.lock(true);

		setTimeout(() => {
			this.props.startAnimation(UNLOCK, true);

		}, 200);

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
								<Button
									className="sidebar-nav-link"
									content="My Wallet"
								/>
							</li>
							<li>
								<Button
									className="sidebar-nav-link"
									content="Transaction History"
								/>
							</li>
							<li>
								<Button
									className="sidebar-nav-link"
									content="Manage accounts"
								/>
							</li>
							<li>
								<Button
									className="sidebar-nav-link"
									content="Settings"
								/>
							</li>
						</ul>

						<Button
							className="btn-transparent"
							onClick={() => this.lock()}
							content={(
								<React.Fragment>
									<img className="icon" src={lock} alt="" />
									Lock application
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
	startAnimation: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		pathname: state.router.location.pathname,
		locked: state.global.get('locked'),
	}),
	(dispatch) => ({
		lock: () => dispatch(lockApp()),
		startAnimation: (type, value) => dispatch(startAnimation(type, value)),
	}),
)(SideMenu));
