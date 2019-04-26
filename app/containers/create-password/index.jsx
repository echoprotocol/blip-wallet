import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Button } from 'semantic-ui-react';
import { Animated } from 'react-animated-css';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Header from '../../components/header';
import ValidatePasswordHelper from '../../helpers/validate-password-helper';
import { FORM_CREATE_PASSWORD } from '../../constants/form-constants';
import { CREATE_PASSWORD } from '../../constants/routes-constants';
import { KEY_CODE_ENTER } from '../../constants/global-constants';

import { startAnimation } from '../../actions/animation-actions';
import { createDB } from '../../actions/global-actions';

class CreatePassword extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			prevFocusTarget: null,
			showPas: false,
			showRepeatPas: false,
			password: '',
			repeatPassword: '',
			repeatError: false,
			hintsError: true,
			hint1: '',
			hint2: '',
			hint3: '',
			hint4: '',
			focused: '',
		};
		this.eye = React.createRef();
		this.repeatPassword = React.createRef();
		this.password = React.createRef();
		this.onTogglePrivacy = this.onTogglePrivacy.bind(this);
		this.changeFocusTarget = this.changeFocusTarget.bind(this);
		this.renderPrivacyEyeBlur = this.renderPrivacyEyeBlur.bind(this);
	}

	componentWillUnmount() {
		this.props.startAnimation(CREATE_PASSWORD, true);
	}

	onChange(e) {
		const { value, name } = e.target;

		if (name === 'password') {
			const hints = ValidatePasswordHelper.passwordHints(value);

			this.setState({
				hintsError: Object.values(hints).some((hint) => hint !== 'active'),
				...hints,
			});
		}

		this.setState({
			[name]: value,
			repeatError: false,
		});

	}

	onKeyDown(e) {
		const { hintsError } = this.state;
		const { loading } = this.props;

		if (loading || hintsError) { return; }

		const { keyCode } = e;

		if ([KEY_CODE_ENTER].includes(keyCode)) {
			e.preventDefault();
			this.onSubmit();
		}

	}

	async onSubmit() {
		const { password, repeatPassword, repeatError } = this.state;

		if (repeatError) {
			return;
		}

		if (password !== repeatPassword) {
			this.setState({ repeatError: true });
			return;
		}

		await this.props.createDB(password);

	}

	onTogglePrivacy(pas, a) {
		if (this.state.prevFocusTarget && this[this.state.prevFocusTarget.name]) {
			this[this.state.prevFocusTarget.name].current.focus();
		}
		if (a) {
			this.setState({ showPas: !pas });

		} else {
			this.setState({ showRepeatPas: !pas });
		}
	}

	changeFocusTarget(e) {
		if (e.target.name === this.eye.current.props.name && this.state.prevFocusTarget && this.state.prevFocusTarget.parentNode === e.target.parentNode) {
			this.setState((prevState) => ({ focused: prevState.prevFocusTarget.name }));
			return;
		}

		this.setState({
			prevFocusTarget: e.target,
			focused: '',
		});
	}

	renderPrivacyEyeBlur() {
		this.setState({ focused: '' });
	}

	renderPrivacyEye(pas, isInputPassword) {
		return (
			<Button
				tabIndex="-1"
				name="eye"
				ref={this.eye}
				className={
					classnames(
						'icon-eye',
						{ enable: pas },
						{ disabled: !pas },
					)
				}
				onBlur={() => this.renderPrivacyEyeBlur()}
				onClick={() => this.onTogglePrivacy(pas, isInputPassword)}
			/>
		);
	}

	render() {
		const { error, loading, isVisible } = this.props;
		const {
			showPas, showRepeatPas,
			hint1, hint2, hint3, hint4, repeatError,
			password, repeatPassword, hintsError, focused,
		} = this.state;

		return (

			<div
				className="page"
				role="presentation"
				onFocus={this.changeFocusTarget}
				onClick={this.changeFocusTarget}
			>
				<Header />
				<div className="form-wrap">
					<div className="form-content">
						<Animated
							animationIn="fadeInRightBig"
							animationOut="fadeOutLeft"
							isVisible={isVisible}
							className="lines"
						>
							<div className="line">
								<div className="line-label">
									<span className="line-label-text">
										<FormattedMessage id="createPassword.passwordLabel" />
									</span>
								</div>
								<div className="line-content">
									<div className="field">
										<FormattedMessage id="createPassword.passwordLabel">
											{(placeholder) => (
												<Input
													placeholder={placeholder}
													ref={this.password}
													name="password"
													error={!!error}
													value={password}
													className={
														classnames(
															'password pink',
															{ focused: focused === 'password' },
														)
													}
													onKeyDown={(e) => this.onKeyDown(e)}
													disabled={loading}
													type={showPas ? 'text' : 'password'}
													icon={this.renderPrivacyEye(showPas, true)}
													fluid
													onChange={(e) => this.onChange(e)}
												/>
											)}
										</FormattedMessage>
										{
											error
											&& (
												<div className="error-message">
													{error}
												</div>
											)
										}
									</div>

								</div>

							</div>
							<div className="line">
								<div className="line-label">
									<span className="line-label-text">
										<FormattedMessage id="createPassword.repeatLabel" />
									</span>
								</div>
								<div className="line-content">
									<div className="field">
										<FormattedMessage id="createPassword.repeatLabel">
											{(placeholder) => (
												<Input
													placeholder={placeholder}
													error={!!repeatError}
													ref={this.repeatPassword}
													name="repeatPassword"
													value={repeatPassword}
													className={
														classnames(
															'password pink',
															{ focused: focused === 'repeatPassword' },
														)
													}
													disabled={loading}
													onKeyDown={(e) => this.onKeyDown(e)}
													type={showRepeatPas ? 'text' : 'password'}
													icon={this.renderPrivacyEye(showRepeatPas)}
													fluid
													onChange={(e) => this.onChange(e)}
												/>
											)}
										</FormattedMessage>

										{
											repeatError
											&& (
												<div className="error-message">
													<FormattedMessage id="createPassword.repeatError" />
												</div>
											)
										}
										<div className="hints">
											<div className={`hint ${hint1}`}><FormattedMessage id="createPassword.hint1" /></div>
											<div className={`hint ${hint2}`}><FormattedMessage id="createPassword.hint2" /></div>
											<div className={`hint ${hint3}`}><FormattedMessage id="createPassword.hint3" /></div>
											<div className={`hint ${hint4}`}><FormattedMessage id="createPassword.hint4" /></div>
										</div>
									</div>
								</div>
							</div>
						</Animated>
						<div className="form-action">
							<div className="line">
								<div className="line-label" />
								<div className="line-content">
									<Animated
										className="btns-wrap"
										animationIn="fadeInRight"
										animationOut="fadeOutLeft"
										animationInDelay={100}
										isVisible={isVisible}
									>
										<FormattedMessage id="createPassword.createPassword">
											{(createPassword) => (
												<Button
													className="btn-primary"
													disabled={!!(loading || !password || !repeatPassword || error || hintsError || repeatError)}
													onClick={() => this.onSubmit()}
													content={<span className="text">{createPassword}</span>}
												/>
											)}
										</FormattedMessage>

									</Animated>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

CreatePassword.propTypes = {
	error: PropTypes.any,
	startAnimation: PropTypes.func.isRequired,
	isVisible: PropTypes.bool.isRequired,
	createDB: PropTypes.func.isRequired,
	loading: PropTypes.bool,
};

CreatePassword.defaultProps = {
	error: false,
	loading: false,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_CREATE_PASSWORD, 'loading']),
		error: state.form.getIn([FORM_CREATE_PASSWORD, 'error']),
		isVisible: state.animation.getIn([CREATE_PASSWORD, 'isVisible']),
	}),
	(dispatch) => ({
		startAnimation: (type, value) => dispatch(startAnimation(type, value)),
		createDB: (value) => dispatch(createDB(FORM_CREATE_PASSWORD, value)),
	}),
)(CreatePassword);
