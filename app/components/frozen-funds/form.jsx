import React from 'react';
import {
	Input, Button, Icon, Popup,
} from 'semantic-ui-react';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
	// FormattedMessage,
	injectIntl,
	// intlShape
} from 'react-intl';

import PropTypes from 'prop-types';
// import classnames from 'classnames';

import Avatar from '../avatar';

// import InputDropdown from '../input-dropdown';
import ValidateSendHelper from '../../helpers/validate-send-helper';
import { ECHO_ASSET_ID, KEY_CODE_ENTER, TIME_SHOW_ERROR_ASSET } from '../../constants/global-constants';


class FrozenFundsForm extends React.Component {


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

	onChange(e, from) {
		const { timeout } = this.state;

		if (timeout) {
			clearTimeout(timeout);
		}

		const field = e.target.name;
		const { value } = e.target;

		this.props.setFormValue(field, value);

		if (field === 'to' && value) {
			this.props.setValue('isCheckLoading', true);
			this.setState({
				timeout: setTimeout(async () => {
					await this.props.checkAccount(from, value);
				}, 300),
			});
		} else {
			this.props.setValue('isCheckLoading', false);
		}

		this.setFee({ to: value });
	}

	onChangeCoefficient(value) {
		this.props.setValue('coefficient', value);
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

		if (!ValidateSendHelper.validateContractId(form.get('selectedBalance'))) {
			// tokens.forEach((token) => {
			// 	if (token.getIn(['contract', 'id']) === form.get('selectedBalance')) {
			// 		precision = token.getIn(['contract', 'token', 'decimals']);
			// 		symbol = token.getIn(['contract', 'token', 'symbol']);
			// 	}
			// });
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

	onSend() {
		this.props.send();
	}

	onKeyPress(e) {
		const code = e.keyCode || e.which;

		if (KEY_CODE_ENTER === code) {
			this.onSend();
		}
	}

	onChangeAccount(id, from) {
		const { form } = this.props;
		const to = form.get('to').value;

		this.props.changeAccount(id);
		if (to) {
			this.props.checkAccount(from, to);
		}
	}

	setFee(data) {
		if (this.state.feeTimeout) {
			clearTimeout(this.state.feeTimeout);
		}

		const { form } = this.props;
		const amount = Object.prototype.hasOwnProperty.call(data, 'amount') ? data.amount : form.get('amount').value;
		const to = Object.prototype.hasOwnProperty.call(data, 'to') ? data.to : form.get('to').value;
		if (to && amount && !form.get('loading')) {
			this.setState({
				feeTimeout: setTimeout(() => {
					this.props.setFeeFormValue();
				}, 300),
			});
		} else {
			this.props.setFormValue('fee', '');
		}
	}

	isSuccessCheckAccount() {
		const { form } = this.props;
		return form.get('to').value && !form.get('to').error && !form.get('isCheckLoading');
	}

	isTransactionValidate() {
		const { form } = this.props;
		return form.get('to').value && !form.get('to').error
			&& form.get('amount').value && !form.get('amount').error
			&& form.get('fee').value && !form.get('fee').error;
	}


	render() {

		// const {
		// 	accounts, form, balances, loading, intl, hiddenAssets,
		// } = this.props;
		const {
			form,
		} = this.props;


		const periods = [
			{ text: '3 months', value: 90, coefficient: '1.4' },
			{ text: '6 months', value: 180, coefficient: '1.4' },
			{ text: '10 months', value: 360, coefficient: '1.5' },
		];

		// const fromAccountName = accounts && (
		// 	accounts.getIn([form.get('from').value, 'name'])
		// 	|| accounts.getIn([form.get('initialData').accountId, 'name'])
		// 	|| accounts.find((a) => a.get('primary')).get('name')
		// );

		// const amountTitle = intl.formatMessage({ id: 'send.amount.title' });

		// const placeholderAmount = intl.formatMessage({ id: 'send.dropdown.input.placeholder.amount' });
		// const placeholderFee = intl.formatMessage({ id: 'send.dropdown.input.placeholder.fee' });
		const coefficientObject = periods.find(({ value }) => value === form.get('coefficient')) || {};

		return (
			<div>
				<div className="return">
					<Button
						className="btn-return"
						content={(
							<React.Fragment onClick={this.props.return}>
								<Icon className="arrow-left" />
								<div className="text">Return</div>
							</React.Fragment>
						)}
					/>
				</div>
				<section className="frozen-form-wrap">
					<h1 className="page-title">freeze funds</h1>

					<div className="form">

						<div className="line">
							<div className="line-label">
								<span className="line-label-text">Amount, ECHO</span>
							</div>
							<div className="line-content">
								<Input
									className="white"
									// TODO error/success
									name="amount"
									placeholder="0.001"
									autoFocus
								/>
							</div>
						</div>

						<div className="line">
							<div className="line-label">
								<span className="line-label-text">Period</span>
							</div>
							<div className="line-content">
								<Dropdown className="white select-period">
									<Dropdown.Toggle variant="Info">
										<span className="dropdown-toggle-text">
											{coefficientObject.text || 'Select period'}
										</span>
										<span className="carret" />
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<PerfectScrollbar>
											{periods && periods.map(({ text, value }, id) => {
												const key = id;

												return (
													<Dropdown.Item
														key={key}
														eventKey={key}
														onClick={() => this.onChangeCoefficient(value)}
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
								coefficientObject.coefficient && (
									<div className="line">
										<div className="line-label">
											<span className="line-label-text">Coefficient
												<Popup
													content="This is the coefficient that will be used to calculate the reward for participating in blocks creation."
													className="tooltip-frozen"
													trigger={<Icon className="icon-info" />}
												/>
											</span>

										</div>
										<div className="line-content">
											<Input
												className="white"
												name="Coefficient"
												placeholder={coefficientObject.coefficient}
												disabled
											/>
										</div>
									</div>
								)
							}
						</div>
						<div className="line">
							{/* <FormattedMessage id="send.fee">
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
							</FormattedMessage> */}

							<div className="line-label">
								<span className="line-label-text">Transaction Fee, ECHO</span>
							</div>
							<div className="line-content">
								<Input
									className="white"
									name="Fee"
									placeholder="0.00001"
									disabled
								/>
							</div>
						</div>

						<div className="line">
							<div className="line-label">
								<span className="line-label-text">From</span>
							</div>
							<div className="line-content">
								<Dropdown className="white select-account">
									<Dropdown.Toggle variant="Info">
										<Avatar accountName="test" />
										<span className="dropdown-toggle-text">
											AccountName
										</span>
										<span className="carret" />
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<PerfectScrollbar>
											<Dropdown.Item>
												Vasya
											</Dropdown.Item>
											<Dropdown.Item>
												Grisha
											</Dropdown.Item>
										</PerfectScrollbar>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</div>
					</div>
				</section>
				<section className="frozen-btn-wrap">
					<Button
						className="btn-primary white"
						content={(
							<div className="text">Freeze funds</div>
						)}
						onClick={() => this.onApply()}
					/>
					<Button
						className="btn-gray round"
						content={(
							<div className="text">Cancel</div>
						)}
						onClick={() => this.onCancel()}
					/>
				</section>
			</div>
		);
	}

}


FrozenFundsForm.propTypes = {
	form: PropTypes.object.isRequired,
	// loading: PropTypes.string.isRequired,
	// accounts: PropTypes.object,
	balances: PropTypes.object,
	// hiddenAssets: PropTypes.object,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	send: PropTypes.func.isRequired,
	setFeeFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	setMinAmount: PropTypes.func.isRequired,
	changeAccount: PropTypes.func.isRequired,
	return: PropTypes.func.isRequired,
	// intl: intlShape.isRequired,
};

FrozenFundsForm.defaultProps = {
	// accounts: null,
	balances: null,
	// hiddenAssets: null,
};

export default injectIntl(FrozenFundsForm);


// class Send extends React.Component {

// 	render() {
// 		const {
// 			accounts, form, balances, tokens, loading, intl, hiddenAssets,
// 		} = this.props;

// 		const fromAccountName = accounts && (
// 			accounts.getIn([form.get('from').value, 'name'])
// 			|| accounts.getIn([form.get('initialData').accountId, 'name'])
// 			|| accounts.find((a) => a.get('primary')).get('name')
// 		);

// 		const amountTitle = intl.formatMessage({ id: 'send.amount.title' });

// 		const placeholderAmount = intl.formatMessage({ id: 'send.dropdown.input.placeholder.amount' });
// 		const placeholderFee = intl.formatMessage({ id: 'send.dropdown.input.placeholder.fee' });

// 		return (
// 			<div className="page-wrap">
// 				<div className="send page">
// 					<PerfectScrollbar className="page-scroll">
// 						<div className="send-wrap">
// 							<div className="page-title"><FormattedMessage id="send.title" /></div>
// 							<section className="rectangle">
// 								<div className="form-wrap">
// 									<div className="lines">
// 										<div className="line">

// 											<div className="line-label">
// 												<span className="line-label-text"><FormattedMessage id="send.from" /></span>
// 											</div>

// 											<div className="line-content">
// 												<Dropdown className="white select-account">
// 													<Dropdown.Toggle variant="Info">
// 														<Avatar accountName={fromAccountName} />
// 														<span className="dropdown-toggle-text">
// 															{fromAccountName}
// 														</span>
// 														<span className="carret" />
// 													</Dropdown.Toggle>

// 													<Dropdown.Menu>
// 														<PerfectScrollbar>

// 															{accounts && [...accounts.map((account, id) => {
// 																const key = id;

// 																return (
// 																	<Dropdown.Item key={key} eventKey={id} onClick={() => this.onChangeAccount(id, account.get('name'))}>
// 																		{accounts.getIn([id, 'name'])}
// 																	</Dropdown.Item>
// 																);
// 															}).values()]}
// 														</PerfectScrollbar>
// 													</Dropdown.Menu>
// 												</Dropdown>
// 											</div>
// 										</div>
// 										<div className="line">

// 											<div className="line-label">
// 												<span className="line-label-text"><FormattedMessage id="send.to" /></span>
// 											</div>

// 											<div className="line-content">
// 												<div className="field">
// 													<FormattedMessage id="send.to.placeholder">
// 														{
// 															(content) => (
// 																<Input
// 																	className={classnames('white', { success: this.isSuccessCheckAccount() })}
// 																	name="to"
// 																	placeholder={content}
// 																	error={!!form.get('to').error}
// 																	loading={form.get('isCheckLoading')}
// 																	fluid
// 																	onChange={(e) => this.onChange(e, fromAccountName)}
// 																	onKeyPress={(e) => this.onKeyPress(e)}
// 																	value={form.get('to').value}
// 																	autoFocus
// 																	disabled={!!loading}
// 																/>
// 															)
// 														}
// 													</FormattedMessage>
// 													{
// 														form.get('to').error
// 											&& (
// 												<div className="error-message">
// 													{form.get('to').error}
// 												</div>
// 											)
// 													}
// 												</div>
// 											</div>
// 										</div>
// 										<div className="line">

// 											<div className="line-label">
// 												<FormattedMessage id="send.amount">
// 													{
// 														(content) => (
// 															<span className="line-label-text">{content}</span>
// 														)
// 													}
// 												</FormattedMessage>
// 											</div>

// 											<div className="line-content">
// 												<FormattedMessage id="send.amount">
// 													{
// 														(content) => (
// 															<InputDropdown
// 																title={content}
// 																name="amount"
// 																value={form.get('amount').value}
// 																hints={[`${amountTitle} ${form.get('minAmount').amount} ${form.get('minAmount').symbol}`]}
// 																onChange={(e) => this.onAmountChange(e)}
// 																errorText={form.get('amount').error}
// 																setValue={(field, value) => this.props.setValue(field, value)}
// 																onKeyPress={(e) => this.onKeyPress(e)}
// 																path={{ field: 'selectedBalance' }}
// 																data={{
// 																	balances,
// 																	tokens,
// 																	from: form.get('from').value || form.get('initialData').accountId || accounts.findKey((a) => a.get('primary')),
// 																	hiddenAssets,
// 																}}
// 																initialData={{
// 																	selectedBalance: form.get('selectedBalance'),
// 																	symbol: form.get('initialData').symbol,
// 																}}
// 																disable={!!loading}
// 																globalLoading={!!loading}
// 																setFee={this.props.setFeeFormValue}
// 																placeholder={placeholderAmount}
// 															/>
// 														)
// 													}
// 												</FormattedMessage>
// 											</div>
// 										</div>
// 										<div className="line">
// 											<FormattedMessage id="send.fee">
// 												{
// 													(content) => (
// 														<React.Fragment>
// 															<div className="line-label">
// 																<span className="line-label-text">{content}</span>
// 															</div>

// 															<div className="line-content">
// 																<InputDropdown
// 																	title={content}
// 																	name="fee"
// 																	disable
// 																	globalLoading={!!loading}
// 																	errorText={form.get('fee').error}
// 																	setValue={(field, value) => this.props.setValue(field, value)}
// 																	path={{ field: 'selectedFeeBalance' }}
// 																	data={{
// 																		balances,
// 																		from: form.get('from').value || accounts.findKey((a) => a.get('primary')),
// 																		hiddenAssets,
// 																	}}
// 																	value={form.get('fee').value}
// 																	setFee={this.props.setFeeFormValue}
// 																	placeholder={placeholderFee}
// 																/>
// 															</div>
// 														</React.Fragment>
// 													)
// 												}
// 											</FormattedMessage>
// 										</div>
// 									</div>
// 								</div>
// 							</section>
// 							{
// 								!(!this.isTransactionValidate() || !this.isSuccessCheckAccount() || !!loading) && (
// 									<div className="btn-wrap">
// 										<FormattedMessage id="send.button">
// 											{
// 												(content) => (
// 													<Button
// 														className="btn-primary white"
// 														content={(
// 															<div className="text">
// 																{content}
// 															</div>
// 														)}
// 														onClick={() => this.onSend()}
// 													/>
// 												)
// 											}
// 										</FormattedMessage>
// 									</div>
// 								)
// 							}
// 						</div>
// 					</PerfectScrollbar>
// 				</div>
// 			</div>
// 		);
// 	}

// }
