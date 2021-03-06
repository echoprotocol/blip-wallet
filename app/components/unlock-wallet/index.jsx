import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'semantic-ui-react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { Animated } from 'react-animated-css';

import { validateUnlock, setValue } from '../../actions/global-actions';
import { startAnimation, setValue as setValueToAnimation } from '../../actions/animation-actions';

import { UNLOCK, RESTORE_PASSWORD } from '../../constants/routes-constants';
import { clearForm, setValue as setValueToForm } from '../../actions/form-actions';

import { FORM_UNLOCK } from '../../constants/form-constants';
import { KEY_CODE_ENTER } from '../../constants/global-constants';
import { WAITING_ANIMATION } from '../../constants/animation-constants';
import ViewHelper from '../../helpers/view-helper';


import WaitingAnimation from '../waiting-animation';

class UnlockWallet extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			prevFocusTarget: null,
			showPas: false,
			password: '',
			valid: false,
			focused: false,
			isInputFocused: false,
		};

		this.onClickForgotPassword = this.onClickForgotPassword.bind(this);
		this.onTogglePrivacy = this.onTogglePrivacy.bind(this);
		this.changeFocusTarget = this.changeFocusTarget.bind(this);
		this.renderPrivacyEyeBlur = this.renderPrivacyEyeBlur.bind(this);
	}

	componentDidMount() {
		this.unlockInput.focus();
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	componentWillUnmount() {
		document.removeEventListener('keypress', this.handleKeyPress);
		this.props.clearForm();
	}

	async onClickForgotPassword(e) {
		e.preventDefault();

		this.props.setValueToForm('error', null);
		await this.props.startAnimation(UNLOCK, 'isVisible', false);
		await this.props.startAnimation(RESTORE_PASSWORD, 'isVisible', true);
		this.props.history.push(RESTORE_PASSWORD);

	}

	onTogglePrivacy() {
		if (this.state.prevFocusTarget) {
			this[this.state.prevFocusTarget].focus();
		}

		const { showPas } = this.state;
		this.setState({ showPas: !showPas });
	}

	onChange(e) {
		const { value } = e.target;

		this.props.setValueToForm('error', null);
		this.setState({
			password: value,
		});

	}

	async onKeyPress(e) {
		const { password } = this.state;
		const { form } = this.props;

		if (form.get('loading') || !password || form.get('error') || password.length < 8) {
			return;
		}

		const code = e.keyCode || e.which;

		if (KEY_CODE_ENTER === code) {
			await this.validateUnlock();
		}
	}

	handleKeyPress(e) {
		const code = e.keyCode || e.which;
		const { isInputFocused } = this.state;

		if (KEY_CODE_ENTER === code) {
			return null;
		}

		if (!isInputFocused) {
			this.unlockInput.focus();
		}

		return null;
	}

	async validateUnlock() {
		const { password } = this.state;
		const valid = await this.props.validateUnlock(FORM_UNLOCK, password);

		this.setState({ valid });

		if (valid) {
			await ViewHelper.timeout(() => this.props.startAnimation(UNLOCK, 'isVisible', false), 500);
			ViewHelper.timeout(() => this.props.unlockWallet(false), 500);
		}
	}

	changeFocusTarget(e) {
		if (e.target.name === 'eye') {
			this.setState({ focused: true });
			return;
		}
		this.setState({
			prevFocusTarget: e.target.name,
			focused: false,
		});
	}

	renderPrivacyEye() {
		const { showPas } = this.state;
		return (
			<Button
				tabIndex="-1"
				name="eye"
				onBlur={() => this.renderPrivacyEyeBlur()}
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

	renderPrivacyEyeBlur() {
		this.setState({ focused: false });
	}

	render() {
		const {
			showPas, password, valid, focused,
		} = this.state;
		const {
			isVisible, form, intl, waitingAnimation, showLogo,
		} = this.props;

		const placeholder = intl.formatMessage({ id: 'unlock.placeholder' });
		const button = intl.formatMessage({ id: 'unlock.button' });
		const link = intl.formatMessage({ id: 'unlock.link' });

		return (
			<div
				role="presentation"
				className="unlock-page"
				onFocus={this.changeFocusTarget}
				onClick={this.changeFocusTarget}
			>

				{showLogo
					&& (
						<Animated
							className="animation-logo-wrap"
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							animateOnMount={false}
							isVisible={isVisible}
						>
							<WaitingAnimation
								setValueToAnimation={(value) => this.props.setValueToAnimation(value)}
								active={waitingAnimation}
								inited
							/>
						</Animated>
					)
				}
				<Animated
					className="unlock-info"
					animationIn="fadeInRight"
					animationOut="fadeOutLeft"
					isVisible={isVisible}
					animateOnMount={false}
					animationInDelay={50}
				>
					<FormattedMessage id="unlock.title" />
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
									placeholder={placeholder}
									ref={(input) => { this.unlockInput = input; }}
									className={
										classnames(
											'password pink',
											{ focused },
										)
									}
									error={!!form.get('error')}
									loading={false}
									name="unlockInput"
									type={showPas ? 'text' : 'password'}
									icon={this.renderPrivacyEye()}
									fluid
									value={password}
									onChange={(e) => this.onChange(e)}
									onKeyPress={(e) => this.onKeyPress(e)}
									onFocus={() => this.setState({ isInputFocused: true })}
									onBlur={() => this.setState({ isInputFocused: false })}
								/>
								{
									form.get('error')
										&& (
											<div className="error-message">
												<FormattedMessage
													id={`unlock.error.${form.get('error')}`}
													defaultMessage={form.get('error')}
												/>
											</div>
										)
								}
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
					<Button
						className={classnames('btn-primary round-animation', { ok: valid })}
						fluid
						onClick={() => this.validateUnlock()}
						onKeyPress={(e) => this.onKeyPress(e)}
						disabled={password.length < 8}
						content={(
							<React.Fragment>
								<div className="text">{button}</div>
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
					<a className="link" href={RESTORE_PASSWORD} onClick={this.onClickForgotPassword}>{link}</a>
				</Animated>
			</div>
		);
	}

}

UnlockWallet.propTypes = {
	startAnimation: PropTypes.func.isRequired,
	validateUnlock: PropTypes.func.isRequired,
	unlockWallet: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	setValueToForm: PropTypes.func.isRequired,
	intl: intlShape.isRequired,
	form: PropTypes.object.isRequired,
	isVisible: PropTypes.bool.isRequired,
	history: PropTypes.object.isRequired,
	waitingAnimation: PropTypes.bool.isRequired,
	setValueToAnimation: PropTypes.func.isRequired,
	showLogo: PropTypes.bool.isRequired,
};

export default withRouter(injectIntl(connect(
	(state) => ({
		isVisible: state.animation.getIn([UNLOCK, 'isVisible']),
		showLogo: state.animation.getIn([UNLOCK, 'showLogo']),
		form: state.form.get(FORM_UNLOCK),
		waitingAnimation: state.animation.getIn([WAITING_ANIMATION, 'active']),
	}),
	(dispatch) => ({
		validateUnlock: (form, password) => dispatch(validateUnlock(form, password)),
		unlockWallet: (value) => dispatch(setValue('locked', value)),
		setValueToForm: (form, value) => dispatch(setValueToForm(FORM_UNLOCK, form, value)),
		startAnimation: (type, field, value) => dispatch(startAnimation(type, field, value)),
		clearForm: () => dispatch(clearForm(FORM_UNLOCK)),
		setValueToAnimation: (value) => dispatch(setValueToAnimation(WAITING_ANIMATION, 'active', value)),
	}),
)(UnlockWallet)));
