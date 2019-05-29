import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { Dropdown } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import Qr from 'qrcode.react';
import Avatar from '../avatar';
import FormatHelper from '../../helpers/format-helper';
import InputDropdown from '../input-dropdown';
import ValidateSendHelper from '../../helpers/validate-send-helper';
import {
	ECHO_ASSET_ID,
	ECHO_ASSET_SYMBOL,
	QR_SERVER_URL,
	TIME_SHOW_ERROR_ASSET,
} from '../../constants/global-constants';
import Services from '../../services';

class Receive extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			copied: false,
			copiedAccounts: [],
			precision: null,
			amountTimeout: null,
		};
	}

	componentDidMount() {
		Services.getEcho().api.getObject(ECHO_ASSET_ID);
	}

	componentDidUpdate(prevProps) {
		const { updateBalance, histories } = this.props;

		if (!histories.equals(prevProps.histories)) {
			updateBalance();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.listener);
	}

	onCopy(accountName) {
		const { copiedAccounts } = this.state;

		copiedAccounts.push(accountName);
		this.setState({ copiedAccounts });
		setTimeout(() => {
			copiedAccounts.shift();
			this.setState({ copiedAccounts });
		}, 2500);
	}

	onCopyUrl() {
		this.setState({ copied: true });
		setTimeout(() => {
			this.setState({ copied: false });
		}, 2500);
	}

	onAmountChange(e) {

		const {
			form, balances, tokens, echoAsset,
		} = this.props;
		const { amountTimeout } = this.state;

		const field = e.target.name;

		const value = e.target.value.replace(/\s+/g, '');


		let precision = null;
		let symbol = null;

		if (amountTimeout) {
			clearTimeout(amountTimeout);
		}


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

		const asset = balances.find((b) => b.assetId === assetId)
			|| { symbol: echoAsset.get('symbol'), precision: echoAsset.get('precision') };
		this.setState({ precision: precision || asset.precision });

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

		return true;
	}

	getQr(accountName, type) {
		const { form, echoAsset } = this.props;
		const { precision } = this.state;

		return FormatHelper.formatQr(
			form.get('amount').value,
			precision || echoAsset.get('precision'),
			form.get('selectedBalance'),
			accountName,
			type,
		);
	}

	renderAccountList() {
		const { accounts, balancesAccounts } = this.props;
		const { copiedAccounts } = this.state;

		return [...accounts.map((account, id) => {
			const key = id;
			const amount = FormatHelper.getBalance(id, balancesAccounts);
			const customAssetsCount = FormatHelper.getCustomAssetsCount(id, balancesAccounts);

			return (
				<div className="account-item" key={key}>
					<div className="account-info">
						<div className="avatar">
							<Avatar accountName={account.get('name')} />
						</div>
						<div className="copy-name">
							<div className="name">{account.get('name')}</div>

							<CopyToClipboard
								onCopy={() => this.onCopy(account.get('name'))}
								text={account.get('name')}
							>
								<Button
									className="btn-copy gray sm"
									content={(
										<React.Fragment>
											<Icon className="copy" />
											{
												copiedAccounts.includes(account.get('name')) && <div className="copy-label"><FormattedMessage id="receive.hint.copied" /></div>
											}
										</React.Fragment>
									)}
								/>
							</CopyToClipboard>
						</div>
					</div>
					<div className="currency-wrap">
						<div className="balance">
							{amount}
							<div className="currency">{ECHO_ASSET_SYMBOL}</div>
						</div>
						{customAssetsCount ? <div className="assets">{`+${customAssetsCount} assets`}</div> : ''}
					</div>
				</div>
			);
		}).values()];
	}

	render() {
		const {
			accounts, form, balances, tokens, hiddenAssets,
		} = this.props;
		const { copied } = this.state;

		const selectedAccountName = accounts && (accounts.getIn([form.get('selectedAccount').value, 'name']) || accounts.find((a) => a.get('primary')).get('name'));

		return (
			<div className="page receive">
				<PerfectScrollbar className="page-in-scroll">
					<div className="page-in-wrap">
						<div className="title"><FormattedMessage id="receive.copy.account.title" /></div>
						<p className="description-block">
							<FormattedMessage id="receive.copy.account.description" />
						</p>
						<div className="accounts-list sm">
							{this.renderAccountList()}
						</div>

						<div className="title"><FormattedMessage id="receive.copy.qrcode.title" /></div>
						<p className="description-block">
							<FormattedMessage id="receive.copy.qrcode.description" />
						</p>

						<div className="form-wrap">
							<div className="line">

								<div className="line-label">
									<span className="line-label-text"><FormattedMessage id="receive.select.account.label" /></span>
								</div>

								<div className="line-content">
									<Dropdown className="white select-account">
										<Dropdown.Toggle variant="Info">
											<Avatar accountName={selectedAccountName} />
											<span className="dropdown-toggle-text">
												{selectedAccountName}
											</span>
											<span className="carret" />
										</Dropdown.Toggle>

										<Dropdown.Menu>
											<PerfectScrollbar>
												{accounts && [...accounts.map((account, id) => (
													<Dropdown.Item key={id.toString()} eventKey={id} onClick={(() => this.props.setFormValue('selectedAccount', id))}>
														{account.get('name')}
													</Dropdown.Item>
												)).values()]}
											</PerfectScrollbar>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							</div>
							<div className="line">
								<div className="line-label">
									<span className="line-label-text"><FormattedMessage id="receive.select.amount.label" /></span>
								</div>
								<div className="line-content">
									<FormattedMessage id="receive.select.amount.placeholder">
										{
											(content) => (
												<InputDropdown
													title="Amount"
													name="amount"
													value={form.get('amount').value}
													errorText={form.get('amount').error}
													path={{ field: 'selectedBalance' }}
													onChange={(e) => this.onAmountChange(e)}
													data={{
														balances,
														tokens,
														from: form.get('selectedAccount').value || accounts.findKey((a) => a.get('primary')),
														hiddenAssets,
													}}
													placeholder={content}
													setValue={(field, value) => this.props.setValue(field, value)}
												/>
											)
										}
									</FormattedMessage>
								</div>
							</div>
							<div className="line">
								<div className="line-label" />
								<div className="line-content">
									<div className="qr-wrap">
										<div className="qr">
											<Qr
												value={this.getQr(selectedAccountName, 'key')}
												renderAs="svg"
												fgColor="#3F4A52"
												bgColor="transparent"
											/>
										</div>
										<div className="qr-info">
											<div className="qr-link">
												<span className="qr-link-content">
													{`${QR_SERVER_URL}${this.getQr(selectedAccountName, 'url')}`}
												</span>
												<CopyToClipboard
													onCopy={() => this.onCopyUrl()}
													text={`${QR_SERVER_URL}${this.getQr(selectedAccountName, 'url')}`}
												>
													<Button
														className="btn-copy gray sm"
														content={(
															<React.Fragment>
																<Icon className="copy" />
																{
																	copied && <div className="copy-label"><FormattedMessage id="receive.hint.copied" /></div>
																}
															</React.Fragment>
														)}
													/>
												</CopyToClipboard>
											</div>
											<div className="qr-description">
												<FormattedMessage id="receive.select.qr.description" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</PerfectScrollbar>
			</div>
		);
	}

}

Receive.propTypes = {
	form: PropTypes.object.isRequired,
	accounts: PropTypes.object.isRequired,
	balances: PropTypes.object,
	balancesAccounts: PropTypes.object,
	tokens: PropTypes.object,
	hiddenAssets: PropTypes.object,
	histories: PropTypes.object.isRequired,
	echoAsset: PropTypes.object.isRequired,
	updateBalance: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
};

Receive.defaultProps = {
	balances: null,
	balancesAccounts: null,
	tokens: null,
	hiddenAssets: null,
};

export default Receive;
