import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Animated } from 'react-animated-css';
import blipLogo from '../../assets/images/blip-logo.svg';
import { setValue } from '../../actions/global-actions';

class UnlockWallet extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showPas: false,
			isVisible: true,
		};
	}

	onTogglePrivacy() {
		const { showPas } = this.state;
		this.setState({ showPas: !showPas });
	}

	lockToggle() {
		const { isVisible } = this.state;
		this.setState({ isVisible: !isVisible });

		setTimeout(() => {
			this.props.lockToggle(!this.props.locked);
		}, 200);
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
		const { showPas, isVisible } = this.state;
		return (
			<React.Fragment>
				<Animated
					className="blip-logo"
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					animateOnMount={false}
					isVisible={isVisible}
				><img src={blipLogo} alt="" />
				</Animated>
				<Animated
					className="unlock-info"
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					isVisible={isVisible}
					animationInDelay={50}
				>Unlock your wallet
				</Animated>
				<Animated
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					className="form-wrap"
					isVisible={isVisible}
					animateOnMount={false}
					animationInDelay={100}
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
				<Animated
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					className="btn-wrap"
					animateOnMount={false}
					animationInDelay={150}
					isVisible={isVisible}
				>
					{/* Toggle class ok */}
					<Button
						className="btn-primary round-animation ok"
						fluid
						onClick={() => this.lockToggle()}
						content={(
							<React.Fragment>
								<div className="text">Unlock</div>{/* text will "Clear" if disabled */}
							</React.Fragment>
						)}
					/>
				</Animated>
				<Animated
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					className="link-wrap"
					animateOnMount={false}
					animationInDelay={150}
					isVisible={isVisible}
				>
					<a className="link" href="/restore-password">Forgot password?</a>
				</Animated>
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
		lockToggle: (value) => dispatch(setValue('locked', value)),
	}),
)(UnlockWallet);
