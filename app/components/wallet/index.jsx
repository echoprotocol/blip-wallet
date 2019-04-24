import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import FormatHelper from '../../helpers/format-helper';
import settings from '../../assets/images/settings.svg';
import Settings from './settings';
import { ECHO_ASSET_ID, ECHO_ASSET_SYMBOL } from '../../constants/global-constants';
import LastTransaction from './last-transaction';

class Wallet extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showSettings: false,
		};
	}

	componentDidMount() {
		this.updateLastTransaction();
		this.props.initHiddenAssets();
	}

	componentDidUpdate(prevProps) {
		const { accounts, updateBalance: updBalance, histories } = this.props;
		const { accounts: prevAccounts } = prevProps;

		if (!histories.equals(prevProps.histories)) {
			this.updateLastTransaction();
			updBalance();
		}

		if (!accounts.equals(prevAccounts)) {
			updBalance();
		}
	}

	getAssets(balances) {
		if (!balances.size) {
			return null;
		}

		const uniqAssets = [];

		balances.forEach((value) => {
			const id = value.asset.get('id');

			if (id !== ECHO_ASSET_ID && !uniqAssets.find((v) => v.id === id)) {
				uniqAssets.push({
					id,
					precision: value.asset.get('precision'),
					symbol: value.asset.get('symbol'),
				});
			}
		});

		const assets = [];

		uniqAssets.forEach((asset) => {
			const amounts = balances.reduce((arr, balance) => {
				if (balance.asset.get('id') === asset.id) {
					arr.push(balance.amount);
				}
				return arr;
			}, []);

			const amount = FormatHelper.accumulateBalances(amounts);

			assets.push({
				id: asset.id,
				amount: FormatHelper.formatAmount(amount, asset.precision),
				symbol: asset.symbol,
			});
		});

		return this.sortAssets(assets);
	}

	getBalance(balances) {
		if (!balances.size) {
			return null;
		}

		const amounts = [];

		balances.forEach((b) => {
			if (b.asset.get('id') === ECHO_ASSET_ID) {
				amounts.push(b.amount);
			}
		});

		const result = FormatHelper.accumulateBalances(amounts);

		const precision = [...balances.values()][0].asset.get('precision');

		return FormatHelper.formatAmount(result, precision);
	}

	getFraction(balance) {
		if (balance) {
			if (balance.split('.')[1]) {
				return balance.split('.')[1];
			}
		}

		return '00000';
	}

	sortAssets(assets) {
		return assets.sort((a, b) => {
			if (!a || !b) {
				return 0;
			}

			if (a.symbol < b.symbol) { return -1; }
			if (a.symbol > b.symbol) { return 1; }

			return 0;
		});
	}

	updateLastTransaction() {
		this.props.setTransaction();
	}

	toggleSettings(e) {
		e.target.blur();
		const { showSettings } = this.state;
		this.setState({
			showSettings: !showSettings,
		});
	}

	changeVisibilityAsset(id) {
		this.props.changeVisabilityAssets(id);
	}

	renderAssets() {
		const { balances, hiddenAssets } = this.props;

		let assets = this.getAssets(balances);

		if (!assets) {
			return null;
		}

		assets = assets.filter((asset) => !hiddenAssets.has(asset.id));

		return assets.map((asset, index) => {
			const key = index;
			const { id } = asset;

			return (
				<div className="balance-item" key={key}> {/* add class hide */}
					<div className="balance-item-header">
						<div className="wrap">
							<Button
								className="balance-item-close"
								content={
									<Icon className="icon-close-big" />
								}
								onClick={() => this.changeVisibilityAsset(id)}
							/>
						</div>
					</div>
					<div className="line">
						<div className="balance-title">{asset.symbol}</div>
						<div className="balance-type">asset</div>
					</div>
					<div className="balance">
						<span className="integer">{asset.amount ? `${asset.amount.split('.')[0]}.` : '0.'}</span>
						<span className="fractional">{this.getFraction(asset.amount)}</span>
					</div>
				</div>
			);
		});
	}

	render() {
		const {
			accounts, saveSelectedAccounts: saveAccounts, balances, updateBalance: updBalance, currentNode, language, transaction, hiddenAssets,
		} = this.props;

		const { showSettings } = this.state;

		const balance = this.getBalance(balances);

		return (
			<div
				className={
					classnames(
						'wallet-page-wrap',
						{ open: showSettings },
					)
				}
			>
				<div className="wallet page">
					<PerfectScrollbar className="page-scroll">
						<div className="wallet-wrap">
							<div className="title"><FormattedMessage id="wallet.balance" /></div>
							<div className="wallet-container">
								<div className="balance-info">
									<div className="balance">
										<span className="coins">
											<span className="int">{balance ? `${balance.split('.')[0]}.` : '0.'}</span>
											<span className="fraction">{this.getFraction(balance)} </span>
										</span>
										<span className="currency">{ECHO_ASSET_SYMBOL}</span>
									</div>
									<div className="info">
										<span className="coins">+ 0.00000 </span>
										<span className="currency">{ECHO_ASSET_SYMBOL} </span>
										<span className="message">(unclaimed)</span>
										<Link to="/" className="claim-link">Claim balance</Link>
									</div>
								</div>
								<div className="balances-list">
									{this.renderAssets()}
								</div>
							</div>
						</div>
					</PerfectScrollbar>

					<div className="wallet-footer">
						<LastTransaction transaction={transaction} language={language} accounts={accounts} />
						<div className="footer-actions">
							<div className="btn-wrap btns-2">
								<Button
									className="btn-main"
									content={
										<span className="text"><FormattedMessage id="wallet.send" /></span>
									}
								/>
								<Button
									className="btn-gray"
									content={
										<span className="text"><FormattedMessage id="wallet.receive" /></span>
									}
								/>
							</div>
							<div className="footer-info">
								<div className="mode"><FormattedMessage id={`wallet.${FormatHelper.capitalizeFirstLetter(currentNode)} node`} /></div>
								{/* <div className="sync"> */}
								{/*	Syncing with network: */}
								{/*	<span className="percent">100%</span> */}
								{/* </div> */}
							</div>
						</div>
						<div className="loading-status" />
					</div>
					<div className="settings-wrap">
						<Button
							className="btn-settings"
							onClick={(e) => { this.toggleSettings(e); }}
							content={
								<img src={settings} alt="" />
							}
						/>
					</div>
					<Settings
						open={showSettings}
						toggleSettings={(e) => this.toggleSettings(e)}
						accounts={accounts}
						saveSelectedAccounts={saveAccounts}
						updateBalance={updBalance}
						assets={this.getAssets(balances) || []}
						hiddenAssets={hiddenAssets}
						changeVisibilityAsset={(id) => this.changeVisibilityAsset(id)}
					/>

				</div>
			</div>
		);
	}

}

Wallet.propTypes = {
	accounts: PropTypes.object.isRequired,
	hiddenAssets: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired,
	transaction: PropTypes.object.isRequired,
	histories: PropTypes.object.isRequired,
	balances: PropTypes.object.isRequired,
	currentNode: PropTypes.string.isRequired,
	setTransaction: PropTypes.func.isRequired,
	updateBalance: PropTypes.func.isRequired,
	saveSelectedAccounts: PropTypes.func.isRequired,
	initHiddenAssets: PropTypes.func.isRequired,
	changeVisabilityAssets: PropTypes.func.isRequired,
};

export default Wallet;
