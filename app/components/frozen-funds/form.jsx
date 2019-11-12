import React from 'react';
import {
	Input, Button, Icon, Popup,
} from 'semantic-ui-react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';

import PropTypes from 'prop-types';

import Avatar from '../avatar';

import InputDropdown from '../input-dropdown';
import ValidateSendHelper from '../../helpers/validate-send-helper';
import {
	ECHO_ASSET_ID, KEY_CODE_ENTER,
	TIME_SHOW_ERROR_ASSET,
	FREEZE_FUNDS_PERIODS,
} from '../../constants/global-constants';


class FrozenFundsForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			feeTimeout: null,
			amountTimeout: null,
			accountsDropdownShow: false,
		};
	}

	componentDidMount() {
		this.props.setMinAmount();
	}

	componentDidUpdate(prevProps) {
		const { form } = this.props;
		const { form: prevForm } = prevProps;

		if (form.get('selectedBalance') !== prevForm.get('selectedBalance')) {
			this.props.setMinAmount();
		}
	}

	componentWillUnmount() {
		this.props.clearForm();
	}

	onChangeDuration(value) {
		this.props.setValue('duration', value);

		this.setFee({ duration: value });
	}

	onAmountChange(e) {

		const {
			form, balances,
		} = this.props;
		const { amountTimeout } = this.state;

		const field = e.target.name;

		const value = e.target.value.replace(/\s+/g, '');

		const precision = null;
		const symbol = null;

		if (amountTimeout) {
			clearTimeout(amountTimeout);
		}

		let assetId = balances.getIn([form.get('selectedBalance'), 'assetId']);

		if (!assetId) {
			assetId = ECHO_ASSET_ID;
		}

		const asset = balances.find((b) => b.assetId === assetId) || form.get('echoAsset');

		const { value: validatedValue, error, warning } = ValidateSendHelper.amountInput(value, {
			precision: precision || asset.precision,
			symbol: symbol || asset.symbol,
		});

		if (error) {
			this.props.setFormError(field, error);

			if (warning) {
				this.setState({
					amountTimeout: setTimeout(() => this.props.setFormError(field, ''), TIME_SHOW_ERROR_ASSET),
				});
			}

			return false;
		}

		this.props.setFormValue(field, validatedValue);

		this.setFee({ amount: validatedValue });

		return true;
	}

	onApply() {
		this.props.freezeFunds();
	}

	onKeyPress(e) {
		const code = e.keyCode || e.which;

		if (KEY_CODE_ENTER === code && this.isTransactionValidate()) {
			this.onApply();
		}
	}

	onChangeAccount(id) {
		this.props.changeAccount(id);
	}

	onAccountsDropdownToggle() {
		const { accountsDropdownShow } = this.state;

		this.setState({
			accountsDropdownShow: !accountsDropdownShow,
		});
	}

	setFee(data) {
		if (this.state.feeTimeout) {
			clearTimeout(this.state.feeTimeout);
		}

		const { form } = this.props;
		const amount = Object.prototype.hasOwnProperty.call(data, 'amount') ? data.amount : form.get('amount').value;
		const duration = Object.prototype.hasOwnProperty.call(data, 'duration') ? data.duration : form.get('duration');
		if (duration && amount && !form.get('loading')) {
			this.setState({
				feeTimeout: setTimeout(() => {
					this.props.setFeeFormValue();
				}, 300),
			});
		} else {
			this.props.setFormValue('fee', '');
		}
	}

	isTransactionValidate() {
		const { form } = this.props;
		return form.get('amount').value && !form.get('amount').error
			&& form.get('fee').value && !form.get('fee').error
			&& form.get('duration');
	}

	render() {
		const { accountsDropdownShow } = this.state;
		const {
			accounts, form, balances, loading, intl, hiddenAssets,
		} = this.props;

		const fromAccountName = accounts && (
			accounts.getIn([form.get('from').value, 'name'])
			|| accounts.getIn([form.get('initialData').accountId, 'name'])
			|| accounts.find((a) => a.get('primary')).get('name')
		);

		const placeholderFee = intl.formatMessage({ id: 'send.dropdown.input.placeholder.fee' });
		const returnButtonText = intl.formatMessage({ id: 'freeze_funds.button.return' });
		const pageTitle = intl.formatMessage({ id: 'freeze_funds.pageTitle' });
		const amountLabel = intl.formatMessage({ id: 'freeze_funds.amount.label' });
		const periodLabel = intl.formatMessage({ id: 'freeze_funds.period.label' });
		const periodPlaceholder = intl.formatMessage({ id: 'freeze_funds.period.placeholder' });
		const coefficientLabel = intl.formatMessage({ id: 'freeze_funds.coefficient.label' });
		const coefficientPopup = intl.formatMessage({ id: 'freeze_funds.coefficient.popup' });
		const fromLabel = intl.formatMessage({ id: 'freeze_funds.from' });

		const durationObject = FREEZE_FUNDS_PERIODS.find(({ value }) => value === form.get('duration')) || {};

		return (
			<div>
				<div className="return">
					<Button
						className="btn-return"
						content={(
							<React.Fragment>
								<Icon className="arrow-left" />
								<div className="text">{returnButtonText}</div>
							</React.Fragment>
						)}
						onClick={this.props.hideForm}
					/>
				</div>
				<section className="frozen-form-wrap">
					<h1 className="page-title">{pageTitle}</h1>

					<div className="form">

						<div className="line">
							<div className="line-label">
								<span className="line-label-text">{amountLabel}</span>
							</div>
							<div className="line-content">
								<FormattedMessage id="freeze_funds.amount.placeholder">
									{
										(content) => (
											<Input
												name="amount"
												placeholder={content}
												value={form.get('amount').value}
												error={!!form.get('amount').error}
												disabled={form.get('isCheckLoading')}
												loading={form.get('isCheckLoading')}
												className="white"
												autoFocus
												onChange={(e) => this.onAmountChange(e)}
												onKeyPress={(e) => this.onKeyPress(e)}
											/>
										)
									}
								</FormattedMessage>
								{
									!!form.get('amount').error && (
										<div className="error-message">
											{form.get('amount').error}
										</div>
									)
								}
							</div>
						</div>

						<div className="line">
							<div className="line-label">
								<span className="line-label-text">{periodLabel}</span>
							</div>
							<div className="line-content">
								<Dropdown className="white select-period">
									<Dropdown.Toggle variant="Info">
										<span className={classnames('dropdown-toggle-text', { disabled: (durationObject.text || periodPlaceholder) === periodPlaceholder })}>
											{durationObject.text || periodPlaceholder}
										</span>
										<span className="carret" />
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<PerfectScrollbar>
											{FREEZE_FUNDS_PERIODS && FREEZE_FUNDS_PERIODS.map(({ text, value }, id) => {
												const key = id;

												return (
													<Dropdown.Item
														key={key}
														eventKey={key}
														onClick={() => this.onChangeDuration(value)}
													>
														{text}
													</Dropdown.Item>
												);
											})}
										</PerfectScrollbar>
									</Dropdown.Menu>
								</Dropdown>
							</div>
							{
								durationObject.coefficient && (
									<div className="line">
										<div className="line-label">
											<span className="line-label-text">{coefficientLabel}
												<Popup
													content={coefficientPopup}
													className="tooltip-frozen"
													trigger={<Icon className="icon-info" />}
												/>
											</span>

										</div>
										<div className="line-content">
											<Input
												className="white"
												name="coefficient"
												placeholder={durationObject.coefficient}
												disabled
											/>
										</div>
									</div>
								)
							}
						</div>
						<div className="line">
							<FormattedMessage id="freeze_funds.fee">
								{
									(content) => (
										<React.Fragment>
											<div className="line-label">
												<span className="line-label-text">{content}</span>
											</div>

											<div className="line-content">
												<InputDropdown
													title={content}
													name="fee"
													disable
													globalLoading={!!loading}
													errorText={form.get('fee').error}
													setValue={(field, value) => this.props.setValue(field, value)}
													path={{ field: 'selectedFeeBalance' }}
													data={{
														balances,
														from: form.get('from').value || accounts.findKey((a) => a.get('primary')),
														hiddenAssets,
													}}
													value={form.get('fee').value}
													setFee={this.props.setFeeFormValue}
													placeholder={placeholderFee}
												/>
											</div>
										</React.Fragment>
									)
								}
							</FormattedMessage>
						</div>

						<div className="line">
							<div className="line-label">
								<span className="line-label-text">{fromLabel}</span>
							</div>
							<div className="line-content">
								<Dropdown
									className="white select-account"
									show={accountsDropdownShow && accounts && accounts.size > 1}
									onToggle={() => this.onAccountsDropdownToggle()}
								>
									<Dropdown.Toggle variant="Info">
										<Avatar accountName={fromAccountName} />
										<span className="dropdown-toggle-text">
											{fromAccountName}
										</span>
										{accounts && accounts.size > 1 ? <span className="carret" /> : null}
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<PerfectScrollbar>

											{accounts && [...accounts.map((account, id) => {
												const key = id;

												return (
													<Dropdown.Item
														key={key}
														eventKey={id}
														onClick={() => this.onChangeAccount(id)}
													>
														{accounts.getIn([id, 'name'])}
													</Dropdown.Item>
												);
											}).values()]}
										</PerfectScrollbar>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</div>
					</div>
				</section>
				<section className="frozen-btn-wrap">
					<FormattedMessage id="freeze_funds.button.send">
						{
							(content) => (
								<Button
									className="btn-primary white"
									content={(
										<div className="text">{content}</div>
									)}
									disabled={!this.isTransactionValidate() || !!loading}
									onClick={() => this.onApply()}
								/>
							)
						}
					</FormattedMessage>
					<FormattedMessage id="freeze_funds.button.cancel">
						{
							(content) => (
								<Button
									className="btn-gray round"
									content={(
										<div className="text">{content}</div>
									)}
									disabled={!!loading}
									onClick={() => this.props.hideForm()}
								/>
							)
						}
					</FormattedMessage>
				</section>
			</div>
		);
	}

}


FrozenFundsForm.propTypes = {
	form: PropTypes.object.isRequired,
	loading: PropTypes.string.isRequired,
	accounts: PropTypes.object,
	balances: PropTypes.object,
	hiddenAssets: PropTypes.object,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	freezeFunds: PropTypes.func.isRequired,
	setFeeFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	setMinAmount: PropTypes.func.isRequired,
	changeAccount: PropTypes.func.isRequired,
	hideForm: PropTypes.func.isRequired,
	intl: intlShape.isRequired,
};

FrozenFundsForm.defaultProps = {
	accounts: null,
	balances: null,
	hiddenAssets: null,
};

export default injectIntl(FrozenFundsForm);
