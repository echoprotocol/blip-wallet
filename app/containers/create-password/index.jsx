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
import { AUTHORIZATION } from '../../constants/routes-constants';
import { KEY_CODE_ENTER } from '../../constants/global-constants';
import { createDB } from '../../actions/global-actions';

class CreatePassword extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showPas: false,
			showRepeatPas: false,
			isVisible: true,
			password: '',
			repeatPassword: '',
			repeatError: false,
			hintsError: true,
			hint1: '',
			hint2: '',
			hint3: '',
			hint4: '',
		};

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
		const { password, repeatPassword, repeatError } = this.state;
		const { loading, error } = this.props;

		if (loading || !password || !repeatPassword || error || repeatError) { return; }

		const { keyCode } = e;

		if ([KEY_CODE_ENTER].includes(keyCode)) {
			e.preventDefault();
			this.onSubmit();
		}

	}

	async onSubmit() {
		const { password, repeatPassword, repeatError } = this.state;

		if (repeatError || this.props.error) {
			return;
		}

		if (password !== repeatPassword) {
			this.setState({ repeatError: true });
			return;
		}

		await this.props.createDB(password);

	}

	onTogglePrivacy(pas, a) {
		if (a) {
			this.setState({ showPas: !pas });

		} else {
			this.setState({ showRepeatPas: !pas });
		}
	}

	goForward() {

		const { history } = this.props;

		this.setState({
			isVisible: false,
		});

		setTimeout(() => {
			history.push(AUTHORIZATION);
		}, 200);
	}

	renderPrivacyEye(pas, a) {
		return (
			<Button
				tabIndex="-1"
				className={
					classnames(
						'icon-eye',
						{ enable: pas },
						{ disabled: !pas },
					)
				}
				onClick={() => this.onTogglePrivacy(pas, a)}
			/>
		);
	}

	render() {
		const { error, loading } = this.props;
		const {
			showPas, showRepeatPas, isVisible,
			hint1, hint2, hint3, hint4, repeatError,
			password, repeatPassword, hintsError,
		} = this.state;

		return (

			<div className="page">
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
									<FormattedMessage id="createPassword.passwordLabel" />
								</div>
								<div className="line-content">
									<div className="field">
										<FormattedMessage id="createPassword.passwordLabel">
											{(placeholder) => (
												<Input
													placeholder={placeholder}
													ref={(input) => { this.nameInput = input; }}
													name="password"
													error={!!error}
													value={password}
													className="password"
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
									<FormattedMessage id="createPassword.repeatLabel" />
								</div>
								<div className="line-content">
									<div className="field">
										<FormattedMessage id="createPassword.repeatLabel">
											{(placeholder) => (
												<Input
													placeholder={placeholder}
													error={!!repeatError}
													name="repeatPassword"
													value={repeatPassword}
													className="password"
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
	history: PropTypes.object.isRequired,
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
		locked: state.global.get('locked'),
	}),
	(dispatch) => ({
		createDB: (value) => dispatch(createDB(FORM_CREATE_PASSWORD, value)),
	}),

)(CreatePassword);
