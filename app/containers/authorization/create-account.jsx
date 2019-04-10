import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import { Animated } from 'react-animated-css';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import avatar from '../../assets/images/default-avatar.svg';
import { FORM_SIGN_UP } from '../../constants/form-constants';
import { clearForm, setFormValue, toggleLoading } from '../../actions/form-actions';
import { registerAccount, validateAccount } from '../../actions/account-actions';
import ValidateAccountHelper from '../../helpers/validate-account-helper';
import { KEY_CODE_ENTER } from '../../constants/global-constants';

class CreateAccount extends React.Component {

	constructor() {
		super();

		this.state = {
			hint1: '',
			hint2: '',
			hint3: '',
			timeout: null,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			this.nameInput.focus();
		}, 500);
	}

	componentWillUnmount() {
		const { clearForm: reset } = this.props;

		reset();
	}

	onChange(e) {
		const { timeout } = this.state;

		if (timeout) {
			clearTimeout(timeout);
		}

		const {
			setFormValue: setForm, validateAccount: validate, toggleLoading: toggle,
		} = this.props;

		const { value } = e.target;

		setForm('accountName', value);

		const hints = ValidateAccountHelper.accountNameHints(value);

		this.setState(hints);

		if (Object.values(hints).every((hint) => hint === 'active')) {
			toggle('loading', true);
			this.setState({
				timeout: setTimeout(async () => {
					await validate(FORM_SIGN_UP, value);
				}, 300),
			});
		} else {
			toggle('loading', false);
		}
	}

	async onCreate() {
		const { registerAccount: create, goForward } = this.props;

		const createData = await create();

		if (createData) {
			goForward(createData.accountName, createData.wif);
		}
	}

	async onKeyPress(e) {
		const code = e.keyCode || e.which;

		if (KEY_CODE_ENTER === code && this.isSuccess()) {
			await this.onCreate();
		}
	}

	getAvatar() {
		if (this.isSuccess()) {
			return avatar;// call generate avatar method
		}

		return avatar;
	}

	isSuccess() {
		const { form } = this.props;
		const {
			hint1, hint2, hint3,
		} = this.state;

		return [hint1, hint2, hint3].every((hint) => hint === 'active')
			&& !form.get('accountName').error
			&& !form.get('loading');
	}

	render() {
		const {
			error, isVisible, form, intl,
		} = this.props;
		const {
			hint1, hint2, hint3,
		} = this.state;

		const isSuccess = this.isSuccess();

		const placeholder = intl.formatMessage({ id: 'account.create.name.placeholder' });

		return (

			<div className="form-wrap">
				<div className="form-content">
					<div className="lines">
						<Animated
							className="line"
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							isVisible={isVisible}
						>
							<div className="line-label">
								<FormattedMessage id="account.create.name" />
							</div>
							<div className="line-content">
								<div className="field">
									<Input
										className={classnames({ success: isSuccess })}
										placeholder={placeholder}
										ref={(input) => { this.nameInput = input; }}
										error={error}
										loading={form.get('loading')}
										fluid
										value={form.get('accountName').value}
										onChange={(e) => this.onChange(e)}
										onKeyPress={(e) => this.onKeyPress(e)}
									/>
									{
										form.get('accountName').error
										&& (
											<div className="error-message">
												<FormattedMessage
													id={`account.create.error.${form.get('accountName').error}`}
													defaultMessage={form.get('accountName').error}
												/>
											</div>
										)
									}
									<div className="hints">
										<div className={`hint ${hint1}`}><FormattedMessage id="account.create.hint1" /></div>
										<div className={`hint ${hint2}`}><FormattedMessage id="account.create.hint2" /></div>
										<div className={`hint ${hint3}`}><FormattedMessage id="account.create.hint3" /></div>
									</div>
								</div>

							</div>

						</Animated>
						<Animated
							className="line"
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							animationInDelay={50}
							isVisible={isVisible}
						>

							<div className="line-label">
								<FormattedMessage id="account.create.avatar" />
							</div>
							<div className="line-content">
								<div className="avatar-box">
									<img src={this.getAvatar()} alt="" />
									<div className="avatar-desciption">
										<FormattedMessage id="account.create.avatar.description" />
									</div>
								</div>

							</div>
						</Animated>
					</div>
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
									<Button
										disabled={!isSuccess}
										className="btn-primary"
										onClick={() => this.onCreate()}
										content={<span className="text"><FormattedMessage id="account.create.button" /></span>}
									/>
								</Animated>
							</div>
						</div>

					</div>

				</div>

			</div>
		);
	}

}
CreateAccount.propTypes = {
	error: PropTypes.bool,
	form: PropTypes.object.isRequired,
	intl: intlShape.isRequired,
	goForward: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	toggleLoading: PropTypes.func.isRequired,
	registerAccount: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	validateAccount: PropTypes.func.isRequired,
	isVisible: PropTypes.bool.isRequired,
};

CreateAccount.defaultProps = {
	error: false,
};

export default injectIntl(connect(
	(state) => ({
		form: state.form.get(FORM_SIGN_UP),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_UP, field, value)),
		toggleLoading: (field, value) => dispatch(toggleLoading(FORM_SIGN_UP, field, value)),
		registerAccount: () => dispatch(registerAccount()),
		clearForm: () => dispatch(clearForm(FORM_SIGN_UP)),
		validateAccount: (form, name) => dispatch(validateAccount(form, name)),
	}),
)(CreateAccount));
