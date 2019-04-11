import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { Animated } from 'react-animated-css';
import blipLogo from '../../assets/images/blip-logo.svg';
import { startAnimation } from '../../actions/animation-actions';
import { RESTORE_PASSWORD } from '../../constants/routes-constants';

class RestorePassword extends React.Component {

	componentWillUnmount() {
		this.props.startAnimation(RESTORE_PASSWORD, true);
	}

	render() {
		const { isVisible } = this.props;

		return (
			<div className="restore-page page">
				<div className="restore-wrap">
					<Animated
						className="restore-logo-wrap"
						animationIn="fadeInRightBig"
						animationOut="fadeOutLeft"
						isVisible={isVisible}
					>
						<img className="blip-logo" src={blipLogo} alt="" />
					</Animated>
					<div className="restore-info">
						<Animated
							animationIn="fadeInRightBig"
							animationOut="fadeOutLeft"
							isVisible={isVisible}
						>
							<h1>
							Your Password number cannot be restored
							</h1>
						</Animated>
						<Animated
							animationIn="fadeInRightBig"
							animationOut="fadeOutLeft"
							animationInDelay={80}
							isVisible={isVisible}
						>
							<p>
								You can clear your account data from Blip and set a new password.
								If you do, you will lose access to the accounts you&apos;ve logged into.
								You will need to log into them again, after you have set a&nbsp;new&nbsp;password.
							</p>
						</Animated>

					</div>
					<Animated
						className="clear-container"
						animationIn="fadeIn"
						animationOut="fadeOut"
						animationInDelay={80}
						isVisible={isVisible}
					>
						<div className="checkbox">
							<input type="checkbox" id="clear-data" />
							<label htmlFor="clear-data" className="checkbox-label">
								<div className="label-text">
									I understand that Blip does not store backups of my account keys,
									and I will lose access to them by clearing my account data.
								</div>
							</label>
						</div>
						<Button
							className="btn-white"
							disabled
							fluid
							content={(
								<React.Fragment>
									<div className="text">Clear Blip Data</div>
								</React.Fragment>
							)}
						/>
					</Animated>
				</div>

			</div>
		);
	}

}
RestorePassword.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	startAnimation: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		isVisible: state.animation.getIn([RESTORE_PASSWORD, 'isVisible']),
	}),
	(dispatch) => ({
		startAnimation: (type, value) => dispatch(startAnimation(type, value)),
	}),
)(RestorePassword);
