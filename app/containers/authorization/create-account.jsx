import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import { Animated } from 'react-animated-css';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { CACHE_MAPS } from 'echojs-lib';
import Immutable from 'immutable';

import Registrator from './registrator';
import { FORM_SIGN_UP } from '../../constants/form-constants';
import {
	clearForm, setFormValue, toggleLoading, setInValue,
} from '../../actions/form-actions';
import { registerAccount, validateCreateAccount } from '../../actions/account-actions';
import { loadRegistrators, changeRegistratorAccount } from '../../actions/auth-actions';
import ValidateAccountHelper from '../../helpers/validate-account-helper';
import { KEY_CODE_ENTER } from '../../constants/global-constants';
import Avatar from '../../components/avatar';

class CreateAccount extends React.Component {

	constructor() {
		super();

		this.state = {
			hint1: '',
			hint2: '',
			hint3: '',
			hint4: '',
			timeout: null,
		};
	}

	componentDidMount() {
		this.nameInput.focus();

		if (this.props.accounts.size) {
			this.props.loadRegistrators();
		}
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

		setTimeout(() => this.setState(hints), 300);
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

	isSuccess() {
		const { form } = this.props;
		const {
			hint1, hint2, hint3, hint4,
		} = this.state;

		return [hint1, hint2, hint3, hint4].every((hint) => hint === 'active')
			&& !form.get('accountName').error
			&& !form.get('loading');
	}

	selectAccount(id, name) {
		this.nameInput.focus();
		this.props.changeRegistratorAccount(id, name);
	}

	render() {
		const {
			error, isVisible, form, intl, accounts, registrators,
		} = this.props;
		const {
			hint1, hint2, hint3, hint4,
		} = this.state;

		const isSuccess = this.isSuccess();

		const placeholder = intl.formatMessage({ id: 'account.create.name.placeholder' });

		return (

			<div className="form-content">
				<div className="lines">
					{
						accounts.size ? (
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
									{ fadeOut: !isSuccess && form.get('accountName').value.length },
									{ visible: form.get('accountName').error })
							}
							>
								<Avatar
									reset={!form.get('accountName').value.length}
									loading={form.get('loading')}
									accountName={isSuccess ? form.get('accountName').value : ''}
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
	error: PropTypes.bool,
	form: PropTypes.object.isRequired,
	accounts: PropTypes.object.isRequired,
	registrators: PropTypes.object.isRequired,
	intl: intlShape.isRequired,
	goForward: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	registerAccount: PropTypes.func.isRequired,
	loadRegistrators: PropTypes.func.isRequired,
	changeRegistratorAccount: PropTypes.func.isRequired,
	setInValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	validateAccount: PropTypes.func.isRequired,
	isVisible: PropTypes.bool.isRequired,
	toggleLoading: PropTypes.func.isRequired,
};

CreateAccount.defaultProps = {
	error: false,
};


const createImmutableSelector = createSelectorCreator(defaultMemoize, Immutable.is);

const positiveBalanceAccounts = createImmutableSelector(
	(state) => state.global.get('accounts'),
	(state) => state.echoCache.get(CACHE_MAPS.FULL_ACCOUNTS),
	(state) => state.echoCache.get(CACHE_MAPS.OBJECTS_BY_ID),
	(accounts, fullAccounts, objectsById) => accounts.filter((name, id) => {
		const account = fullAccounts.get(id);

		if (!account || !account.get('balances') || account.get('id') !== account.get('lifetime_referrer')) {
			return false;
		}

		return account.get('balances').find(
			(stats, assetId) => objectsById.getIn([stats, 'balance']) && objectsById.get(assetId),
		);
	}),
);

export default injectIntl(connect(
	(state) => ({
		form: state.form.get(FORM_SIGN_UP),
		accounts: state.global.get('accounts'),
		registrators: positiveBalanceAccounts(state),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_UP, field, value)),
		registerAccount: () => dispatch(registerAccount()),
		clearForm: () => dispatch(clearForm(FORM_SIGN_UP)),
		validateAccount: (form, name) => dispatch(validateCreateAccount(form, name)),
		toggleLoading: (field, value) => dispatch(toggleLoading(FORM_SIGN_UP, field, value)),
		loadRegistrators: () => dispatch(loadRegistrators()),
		changeRegistratorAccount: (id, name) => dispatch(changeRegistratorAccount(id, name)),
		setInValue: (field, params) => dispatch(setInValue(FORM_SIGN_UP, field, params)),
	}),
)(CreateAccount));
