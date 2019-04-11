import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Animated } from 'react-animated-css';
import { Button, Icon } from 'semantic-ui-react';
import avatar from '../../assets/images/default-avatar.svg';
import { startAnimation } from '../../actions/animation-actions';
import { ACCOUNT_IMPORTED } from '../../constants/routes-constants';

class AccountImported extends React.Component {

	componentWillUnmount() {
		this.props.startAnimation(ACCOUNT_IMPORTED, true);
	}

	render() {
		const { isVisible } = this.props;
		return (

			<div className="welcome-page page">
				<div className="welcome-wrap">
					<div className="welcome-info import">
						<Animated
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							isVisible={isVisible}
						>
							<h1>
							New Echo account is
								<br />
							succesfully bound to Blip wallet
							</h1>
						</Animated>
						<Animated
							className="account"
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							animationInDelay={50}
							isVisible={isVisible}
						>
							<img className="avatar" src={avatar} alt="" />
							<div className="account-info">
								<div className="label">Account name</div>
								<div className="name">
									Homersimpson223090sdlc56-xf
								</div>
							</div>
						</Animated>
						<Animated
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							animationInDelay={100}
							isVisible={isVisible}
						>
							<Button
								className="btn-primary arrow"
								content={(
									<React.Fragment>
										<div className="text">Proceed to Blip</div>
										<Icon className="arrow-right" />
									</React.Fragment>
								)}
							/>
						</Animated>
					</div>
				</div>
			</div>
		);
	}

}

AccountImported.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	startAnimation: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		isVisible: state.animation.getIn([ACCOUNT_IMPORTED, 'isVisible']),
	}),
	(dispatch) => ({
		startAnimation: (type, value) => dispatch(startAnimation(type, value)),
	}),
)(AccountImported);
