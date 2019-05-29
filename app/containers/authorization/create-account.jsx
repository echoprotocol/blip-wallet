import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import { Animated } from 'react-animated-css';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import Registrator from './registrator';
import { FORM_SIGN_UP } from '../../constants/form-constants';
import {
	toggleLoading, setInValue, setValue,
} from '../../actions/form-actions';
import { registerAccount, validateCreateAccount } from '../../actions/account-actions';
import { loadRegistrators, changeRegistratorAccount } from '../../actions/auth-actions';
import ValidateAccountHelper from '../../helpers/validate-account-helper';
import { KEY_CODE_ENTER } from '../../constants/global-constants';
import Avatar from '../../components/avatar';
import Services from '../../services';

class CreateAccount extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			...ValidateAccountHelper.accountNameHints(this.props.accountName),
			timeout: null,
			startCountAccounts: props.accounts.size,
		};
	}

	componentDidMount() {
		this.nameInput.focus();

		if (this.props.accounts.size) {
			this.props.loadRegistrators();
		}
	}

	onChange(e) {
		const { timeout } = this.state;

		if (timeout) {
			clearTimeout(timeout);
		}

		const {
			setError, validateAccount: validate, toggleLoading: toggle,
		} = this.props;

		const { value } = e.target;
		const field = e.target.name;

		this.props.onChange(field, value);

		const hints = ValidateAccountHelper.accountNameHints(value);

		if (Object.values(hints).every((hint) => hint === 'active')) {
			toggle('loading', true);
			this.setState({
				timeout: setTimeout(async () => {
					await validate(FORM_SIGN_UP, value);
					toggle('loading', false);
				}, 300),
			});
		} else {
			toggle('loading', false);
		}

		setError(field, '');
		this.setState(hints);
	}

	async onCreate() {
		const { registerAccount: create, goForward, accountName } = this.props;

		const createData = await create(accountName);

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

	isSuccess() {
		const { form } = this.props;
		const {
			hint1, hint2, hint3, hint4,
		} = this.state;


		return [hint1, hint2, hint3, hint4].every((hint) => hint === 'active')
			&& !form.get('accountNameError')
			&& !form.get('loading');
	}

	selectAccount(id, name) {
		this.nameInput.focus();
		this.props.changeRegistratorAccount(id, name);
	}

	render() {
		const {
			error, isVisible, form, intl, registrators, accountName,
		} = this.props;
		const {
			hint1, hint2, hint3, hint4, startCountAccounts,
		} = this.state;

		const isSuccess = this.isSuccess();

		const placeholder = intl.formatMessage({ id: 'account.create.name.placeholder' });

		return (

			<div className="form-content">
				<div className="lines">
					{
						startCountAccounts ? (
							<Registrator
								isVisible={isVisible}
								registrators={registrators}
								form={form.get('registrator')}
								changeRegistrator={(id, name) => this.selectAccount(id, name)}
								setIn={this.props.setInValue}
							/>
						) : null
					}
					<Animated
						className="line"
						animationIn="fadeInRight"
						animationOut="fadeOutLeft"
						isVisible={isVisible}
					>
						<div className="line-label">
							<span className="line-label-text"><FormattedMessage id="account.create.name" /></span>
						</div>
						<div className="line-content">
							<div className="field">
								<Input
									className={classnames('pink')}
									placeholder={placeholder}
									ref={(input) => { this.nameInput = input; }}
									error={error}
									loading={form.get('loading')}
									fluid
									name="accountName"
									value={accountName}
									onChange={(e) => this.onChange(e)}
									onKeyPress={(e) => this.onKeyPress(e)}
								/>
								{
									form.get('accountNameError')
										&& (
											<div className="error-message">
												<FormattedMessage
													id={`account.create.error.${form.get('accountNameError')}`}
													defaultMessage={form.get('accountNameError')}
												/>
											</div>
										)
								}
								<div className="hints">
									<div className={`hint ${hint1}`}><FormattedMessage id="account.create.hint1" /></div>
									<div className={`hint ${hint2}`}><FormattedMessage id="account.create.hint2" /></div>
									<div className={`hint ${hint3}`}><FormattedMessage id="account.create.hint3" /></div>
									<div className={`hint ${hint4}`}><FormattedMessage id="account.create.hint4" /></div>
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
							<span className="line-label-text"><FormattedMessage id="account.create.avatar" /></span>
						</div>
						<div className="line-content">
							<div className={
								classnames('avatar-box',
									{ fadeOut: !isSuccess && accountName.length },
									{ visible: form.get('accountNameError') })
							}
							>
								<Avatar
									reset={!accountName.length}
									loading={form.get('loading')}
									accountName={isSuccess ? accountName : ''}
								/>
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

		);
	}

}
CreateAccount.propTypes = {
	accountName: PropTypes.string.isRequired,
	error: PropTypes.bool,
	form: PropTypes.object.isRequired,
	accounts: PropTypes.object.isRequired,
	registrators: PropTypes.object.isRequired,
	intl: intlShape.isRequired,
	goForward: PropTypes.func.isRequired,
	registerAccount: PropTypes.func.isRequired,
	loadRegistrators: PropTypes.func.isRequired,
	changeRegistratorAccount: PropTypes.func.isRequired,
	setInValue: PropTypes.func.isRequired,
	validateAccount: PropTypes.func.isRequired,
	isVisible: PropTypes.bool.isRequired,
	toggleLoading: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
};

CreateAccount.defaultProps = {
	error: false,
};

const positiveBalanceAccounts = Services.getSelector().getPositiveBalanceAccountsSelector();

export default injectIntl(connect(
	(state) => ({
		form: state.form.get(FORM_SIGN_UP),
		accounts: state.global.get('accounts'),
		registrators: positiveBalanceAccounts(state),
	}),
	(dispatch) => ({
		setError: (field, value) => dispatch(setValue(FORM_SIGN_UP, `${field}Error`, value)),
		registerAccount: (accountName) => dispatch(registerAccount(accountName)),
		validateAccount: (form, name) => dispatch(validateCreateAccount(form, name)),
		toggleLoading: (field, value) => dispatch(toggleLoading(FORM_SIGN_UP, field, value)),
		loadRegistrators: () => dispatch(loadRegistrators()),
		changeRegistratorAccount: (id, name) => dispatch(changeRegistratorAccount(id, name)),
		setInValue: (field, params) => dispatch(setInValue(FORM_SIGN_UP, field, params)),
	}),
)(CreateAccount));
