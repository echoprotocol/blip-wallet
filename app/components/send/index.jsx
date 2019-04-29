import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import Avatar from '../avatar';
import InputDropdown from '../input-dropdown';
import { FORM_SEND } from '../../constants/form-constants';
import ValidateSendHelper from '../../helpers/validate-send-helper';
import { ECHO_ASSET_ID, KEY_CODE_ENTER } from '../../constants/global-constants';

class Send extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			from: '',
			timeout: null,
			feeTimeout: null,
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

	onAmountChange(e) {

		const {
			form, balances, tokens,
		} = this.props;

		const field = e.target.name;

		const value = e.target.value.replace(/\s+/g, '');


		let precision = null;
		let symbol = null;

		if (!ValidateSendHelper.validateContractId(form.get('selectedBalance'))) {
			tokens.forEach((token) => {
				if (token.getIn(['contract', 'id']) === form.get('selectedBalance')) {
					precision = token.getIn(['contract', 'token', 'decimals']);
					symbol = token.getIn(['contract', 'token', 'symbol']);
				}
			});
		}
		let assetId = balances.getIn([form.get('selectedBalance'), 'assetId']);

		if (!assetId) {
			assetId = ECHO_ASSET_ID;
		}

		const asset = balances.find((b) => b.assetId === assetId);

		const { value: validatedValue, error } = ValidateSendHelper.amountInput(value, {
			precision: precision || asset.precision,
			symbol: symbol || asset.symbol,
		});

		if (error) {
			this.props.setFormError(field, error);

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

	render() {
		const {
			accounts, form, balances, tokens, loading, intl, hiddenAssets,
		} = this.props;
		const { from } = this.state;

		const fromAccountName = accounts && (accounts.getIn([from, 'name']) || [...accounts.values()][0].get('name'));

		const amountTitle = intl.formatMessage({ id: 'send.amount.title' });
		const feeTitle = intl.formatMessage({ id: 'send.fee.title' });

		const placeholderAmount = intl.formatMessage({ id: 'send.dropdown.input.placeholder.amount' });
		const placeholderFee = intl.formatMessage({ id: 'send.dropdown.input.placeholder.fee' });

		return (
			<div className="send page">
				<PerfectScrollbar className="page-in-scroll">
					<div className="page-in-wrap">
						<div className="title"><FormattedMessage id="send.title" /></div>
						<div className="form-wrap">
							<div className="line">

								<div className="line-label">
									<span className="line-label-text"><FormattedMessage id="send.from" /></span>
								</div>

								<div className="line-content">
									<Dropdown className="white select-account">
										<Dropdown.Toggle variant="Info">
											<Avatar accountName={fromAccountName} />
											<span className="dropdown-toggle-text">
												{fromAccountName}
											</span>
											<span className="carret" />
										</Dropdown.Toggle>

										<Dropdown.Menu>
											<PerfectScrollbar>

												{accounts && [...accounts.map((account, id) => {
													const key = id;

													return (
														<Dropdown.Item key={key} eventKey={id} onClick={(() => this.setState({ from: id }))}>
															{accounts.getIn([id, 'name'])}
														</Dropdown.Item>
													);
												}).values()]}
											</PerfectScrollbar>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							</div>
							<div className="line">

								<div className="line-label">
									<span className="line-label-text"><FormattedMessage id="send.to" /></span>
								</div>

								<div className="line-content">
									<div className="field">
										<FormattedMessage id="send.to.placeholder">
											{
												(content) => (
													<Input
														className={classnames('white', { success: this.isSuccessCheckAccount() })}
														name="to"
														placeholder={content}
														error={!!form.get('to').error}
														loading={form.get('isCheckLoading')}
														fluid
														onChange={(e) => this.onChange(e, fromAccountName)}
														onKeyPress={(e) => this.onKeyPress(e)}
														value={form.get('to').value}
														autoFocus
														disabled={!!loading}
													/>
												)
											}
										</FormattedMessage>
										{
											form.get('to').error
											&& (
												<div className="error-message">
													{form.get('to').error}
												</div>
											)
										}
									</div>
								</div>
							</div>
							<div className="line">

								<div className="line-label">
									<FormattedMessage id="send.amount">
										{
											(content) => (
												<span className="line-label-text">{content}</span>
											)
										}
									</FormattedMessage>
								</div>

								<div className="line-content">
									<FormattedMessage id="send.amount">
										{
											(content) => (
												<InputDropdown
													title={content}
													name="amount"
													value={form.get('amount').value}
													hints={[`${amountTitle} ${form.get('minAmount').amount} ${form.get('minAmount').symbol}`]}
													onChange={(e) => this.onAmountChange(e)}
													error={!!form.get('amount').error}
													errorText={form.get('amount').error}
													setValue={(field, value) => this.props.setValue(field, value)}
													onKeyPress={(e) => this.onKeyPress(e)}
													path={{ field: 'selectedBalance' }}
													data={{
														account: from || [...accounts.keys()][0],
														balances,
														tokens,
														hiddenAssets,
													}}
													disable={!!loading}
													globalLoading={!!loading}
													setFee={this.props.setFeeFormValue}
													placeholder={placeholderAmount}
												/>
											)
										}
									</FormattedMessage>
								</div>
							</div>
							<div className="line">

								<FormattedMessage id="send.fee">
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
														hints={[feeTitle]}
														disable
														globalLoading={!!loading}
														error={!!form.get('amount').error}
														errorText={form.get('amount').error}
														setValue={(field, value) => this.props.setValue(FORM_SEND, field, value)}
														path={{ field: 'selectedFeeBalance' }}
														data={{
															account: from || [...accounts.keys()][0],
															balances,
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

						</div>
						<div className="page-in-action">
							<FormattedMessage id="send.button">
								{
									(content) => (
										<Button
											className="btn-primary white"
											content={(
												<div className="text">
													{content}
												</div>
											)}
											onClick={() => this.onSend()}
											disabled={!form.get('amount').value || !form.get('to').value || !this.isSuccessCheckAccount() || !!loading}
										/>
									)
								}
							</FormattedMessage>
						</div>
					</div>
				</PerfectScrollbar>
			</div>
		);
	}

}

Send.propTypes = {
	form: PropTypes.object.isRequired,
	loading: PropTypes.string.isRequired,
	accounts: PropTypes.object,
	balances: PropTypes.object,
	tokens: PropTypes.object,
	hiddenAssets: PropTypes.object,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	send: PropTypes.func.isRequired,
	setFeeFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	setMinAmount: PropTypes.func.isRequired,
	intl: intlShape.isRequired,
};

Send.defaultProps = {
	accounts: null,
	balances: null,
	tokens: null,
	hiddenAssets: null,
};

export default injectIntl(Send);
