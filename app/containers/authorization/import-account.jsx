import React from 'react';
import { Animated } from 'react-animated-css';
import { Input, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { importAccount } from '../../actions/account-actions';
import { clearForm, setValue } from '../../actions/form-actions';
import { FORM_SIGN_IN } from '../../constants/form-constants';
import { KEY_CODE_ENTER } from '../../constants/global-constants';

class ImportAccount extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			wif: {
				value: '',
				error: '',
			},
			accountName: {
				value: '',
				error: '',
			},
			showPas: false,
		};
	}


	componentDidMount() {
		this.nameInput.focus();
	}

	componentWillUnmount() {
		const { clearForm: reset } = this.props;

		reset();
	}

	onChange(e) {
		const { setError } = this.props;

		const { value } = e.target;
		const field = e.target.name;

		this.setState({ [field]: { value, error: '' } });
		setError(field, '');
	}

	async onImport() {
		const { importAccount: importAcc, goForward } = this.props;
		const { accountName, wif } = this.state;

		const isSuccess = await importAcc(accountName.value, wif.value);

		if (isSuccess) {
			goForward(accountName.value);
		}
	}

	async onKeyPress(e) {
		const code = e.keyCode || e.which;

		if (KEY_CODE_ENTER === code && this.isSuccess()) {
			await this.onImport();
		}
	}

	isSuccess() {
		const { signInForm } = this.props;

		return !(signInForm.get('accountNameError') || signInForm.get('wifError'));
	}

	render() {
		const { isVisible, signInForm, intl } = this.props;
		const { wif, accountName, showPas } = this.state;

		const placeholderName = intl.formatMessage({ id: 'account.import.name.placeholder' });
		const placeholderWIF = intl.formatMessage({ id: 'account.import.wif.placeholder' });

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
							<div className="line-label"><FormattedMessage id="account.import.name" /></div>
							<div className="line-content">
								<div className="field">
									<Input
										placeholder={placeholderName}
										ref={(input) => { this.nameInput = input; }}
										error={!!signInForm.get('accountNameError')}
										loading={false}
										fluid
										name="accountName"
										value={accountName.value}
										onChange={(e) => this.onChange(e)}
										onKeyPress={(e) => this.onKeyPress(e)}
									/>
									{
										signInForm.get('accountNameError')
										&& (
											<div className="error-message">
												<FormattedMessage
													id={`account.import.error.${signInForm.get('accountNameError')}`}
													defaultMessage={signInForm.get('accountNameError')}
												/>
											</div>
										)
									}
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
							<div className="line-label"><FormattedMessage id="account.import.wif" /></div>
							<div className="line-content">
								<div className="field">
									<Input
										className="password"
										placeholder={placeholderWIF}
										error={!!signInForm.get('wifError')}
										loading={false}
										fluid
										name="wif"
										value={wif.value}
										onChange={(e) => this.onChange(e)}
										type={showPas ? 'text' : 'password'}
										onKeyPress={(e) => this.onKeyPress(e)}
										icon={(
											<Button
												tabIndex="-1"
												className={
													classnames(
														'icon-eye',
														{ enable: showPas },
														{ disabled: !showPas },
													)
												}
												onClick={() => this.setState({ showPas: !showPas })}
											/>
										)}
									/>
									{
										signInForm.get('wifError')
										&& (
											<div className="error-message">
												<FormattedMessage
													id={`account.import.error.${signInForm.get('wifError')}`}
													defaultMessage={signInForm.get('wifError')}
												/>
											</div>
										)
									}
									<div className="hints">
										<div className="hint"><FormattedMessage id="account.import.description" /></div>
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
										disabled={!this.isSuccess()}
										className="btn-primary"
										onClick={() => this.onImport()}
										content={<span className="text"><FormattedMessage id="account.import.button" /></span>}
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
ImportAccount.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	signInForm: PropTypes.object.isRequired,
	intl: intlShape.isRequired,
	goForward: PropTypes.func.isRequired,
	importAccount: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

export default injectIntl(connect(
	(state) => ({
		signInForm: state.form.get(FORM_SIGN_IN),
	}),
	(dispatch) => ({
		importAccount: (accountName, wif) => dispatch(importAccount(accountName, wif)),
		setError: (field, value) => dispatch(setValue(FORM_SIGN_IN, `${field}Error`, value)),
		clearForm: () => dispatch(clearForm(FORM_SIGN_IN)),
	}),
)(ImportAccount));
