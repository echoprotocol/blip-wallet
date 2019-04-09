import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Animated } from 'react-animated-css';
import blipLogo from '../../assets/images/blip-logo.svg';
import { lockToggle } from '../../actions/global-actions';

class UnlockWallet extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showPas: false,
		};
	}

	onTogglePrivacy() {
		const { showPas } = this.state;
		this.setState({ showPas: !showPas });
	}


	unlock() {
		this.props.lockToggle(this.props.locked);
	}


	renderPrivacyEye() {
		const { showPas } = this.state;
		return (
			<Button
				tabIndex="-1"
				className={
					classnames(
						'icon-eye',
						{ enable: showPas },
						{ disabled: !showPas },
					)
				}
				onClick={() => this.onTogglePrivacy()}
			/>
		);
	}

	render() {
		const { showPas } = this.state;
		const { locked } = this.props;
		return (
			<React.Fragment>
				<Animated
					className="blip-logo"
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					animateOnMount={false}
					isVisible={locked}
				><img src={blipLogo} alt="" />
				</Animated>
				<Animated
					className="unlock-info"
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					animateOnMount={false}
					isVisible={locked}
					animationInDelay={100}
				>Unlock your wallet
				</Animated>
				<Animated
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					className="form-wrap"
					animateOnMount={false}
					isVisible={locked}
					animationInDelay={150}
				>
					<div className="line">
						<div className="line-content">
							<div className="field">
								<Input
									placeholder="Enter Password"
									ref={(input) => { this.nameInput = input; }}
									className="password"
									error
									loading={false}
									type={showPas ? 'text' : 'password'}
									icon={this.renderPrivacyEye()}
									fluid
								/>
							</div>
						</div>
					</div>
				</Animated>
				<div className="btn-wrap">
					{/* Toggle class ok */}
					<Button
						className="btn-primary round-animation ok"
						fluid
						onClick={() => this.unlock()}
						content={(
							<React.Fragment>
								<div className="text">Unlock</div>{/* text will "Clear" if disabled */}
							</React.Fragment>
						)}
					/>
				</div>
				<div className="link-wrap">
					<a className="link" href="/restore-password">Forgot password?</a>
				</div>
			</React.Fragment>
		);
	}

}

UnlockWallet.propTypes = {
	lockToggle: PropTypes.func.isRequired,
	locked: PropTypes.bool.isRequired,
};

export default connect(
	(state) => ({
		pathname: state.router.location.pathname,
		locked: state.global.get('locked'),
	}),
	(dispatch) => ({
		lockToggle: (value) => dispatch(lockToggle(value)),
	}),
)(UnlockWallet);
