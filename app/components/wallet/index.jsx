import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import FormatHelper from '../../helpers/format-helper';
import settings from '../../assets/images/settings.svg';
import Settings from './settings';
import { ECHO_ASSET_ID, ECHO_ASSET_PRECISION, ECHO_ASSET_SYMBOL } from '../../constants/global-constants';
import { HISTORY } from '../../constants/routes-constants';
import { TOKEN_TYPE } from '../../constants/graphql-constants';
import Footer from '../footer';
import LastTransaction from './last-transaction';
import { getBalance } from '../../actions/balance-actions';

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
		this.props.updateTokens();
	}

	componentDidUpdate(prevProps) {
		const { updateBalance, histories } = this.props;

		if (!histories.equals(prevProps.histories)) {
			this.updateLastTransaction();
			updateBalance();
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

	sortTokens(tokens) {
		return tokens.sort((a, b) => {
			if (!a || !b) {
				return 0;
			}

			if (a.getIn(['contract', 'token', 'symbol']) < b.getIn(['contract', 'token', 'symbol'])) { return -1; }
			if (a.getIn(['contract', 'token', 'symbol']) > b.getIn(['contract', 'token', 'symbol'])) { return 1; }

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

	changeVisibilityAsset(e, idAsset) {
		e.stopPropagation();

		this.props.toggleVisibiltyAsset(idAsset);
	}

	switchToSend(currencyId) {
		const { balances } = this.props;

		this.props.goToSend(currencyId, balances);
	}

	renderTokens() {
		const {
			tokens, accounts, hiddenAssets,
		} = this.props;

		if (!tokens) {
			return null;
		}

		const tokensArray = [];

		tokens.forEach((balance) => {
			if (
				balance.get('type') === TOKEN_TYPE
				&& !tokensArray.find((t) => balance.getIn(['contract', 'id']) === t.getIn(['contract', 'id']))
				&& accounts.getIn([balance.getIn(['account', 'id']), 'selected'])
				&& !hiddenAssets.has(balance.getIn(['contract', 'id']))
			) {
				tokensArray.push(balance);
			}
		});

		return this.sortTokens(tokensArray).map((token, id) => {
			const key = `${id}token`;

			const amounts = tokens.reduce((arr, balance) => {
				if (balance.getIn(['contract', 'id']) === token.getIn(['contract', 'id']) && accounts.getIn([balance.getIn(['account', 'id']), 'selected'])) {
					arr.push(balance.get('amount'));
				}
				return arr;
			}, []);

			const amount = FormatHelper.accumulateBalances(amounts);

			const amountResult = FormatHelper.formatAmount(amount, parseInt(token.getIn(['contract', 'token', 'decimals']), 10));
			const precision = token.getIn(['contract', 'token', 'decimals']);

			return (
				<div
					className="balance-item"
					key={key}
					onClick={() => this.switchToSend(token.getIn(['contract', 'id']))}
					role="button"
					tabIndex="0"
					onKeyPress={() => { }}
				>
					<div className="balance-item-header">
						<div className="wrap">
							<Button
								className="balance-item-close"
								content={
									<Icon className="icon-close-big" />
								}
								onClick={(e) => this.changeVisibilityAsset(e, token.getIn(['contract', 'id']))}
							/>
						</div>
					</div>
					<div className="line">
						<div className="balance-title">{token.getIn(['contract', 'token', 'symbol'])}</div>
						<div className="balance-type">{`${token.getIn(['contract', 'type'])} token`}</div>
					</div>
					<div className="balance">
						<span className="integer">{amountResult ? `${amountResult.split('.')[0]}` : '0'}</span>
						<span className="fractional">{FormatHelper.getFraction(amountResult, precision)}</span>
					</div>
				</div>
			);
		});
	}

	renderAssets() {
		const {
			balances, hiddenAssets,
		} = this.props;

		let assets = this.getAssets(balances);

		if (!assets) {
			return null;
		}

		assets = assets.filter((asset) => !hiddenAssets.has(asset.id));

		return assets.map((asset, index) => {
			const key = index;
			const { id, precision } = asset;

			return (
				<div
					className="balance-item"
					key={key}
					onClick={() => this.switchToSend(asset.id)}
					role="button"
					tabIndex="0"
					onKeyPress={() => { }}
				> {/* add class hide */}
					<div className="balance-item-header">
						<div className="wrap">
							<Button
								className="balance-item-close"
								content={
									<Icon className="icon-close-big" />
								}
								onClick={(e) => this.changeVisibilityAsset(e, id)}
							/>
						</div>
					</div>
					<div className="line">
						<div className="balance-title">{asset.symbol}</div>
						<div className="balance-type">asset</div>
					</div>
					<div className="balance">
						<span className="integer">{asset.amount ? `${asset.amount.split('.')[0]}` : '0'}</span>
						<span className="fractional">{FormatHelper.getFraction(asset.amount, precision)}</span>
					</div>
				</div>
			);
		});
	}

	render() {
		const {
			accounts, saveSelectedAccounts: saveAccounts, balances, updateBalance: updBalance, currentNode, language, transaction, hiddenAssets, tokens: stateTokens, history,
		} = this.props;

		const { showSettings } = this.state;

		const balance = getBalance(balances);

		const assets = this.renderAssets();
		const tokens = this.renderTokens();

		return (
			<div
				className={
					classnames(
						'page-wrap',
						{ open: showSettings },
					)
				}
			>
				<div className="page">
					<PerfectScrollbar className="page-scroll">
						<div className="wallet-wrap">
							<div className="page-title"><FormattedMessage id="wallet.balance" /></div>
							<div className="wallet-container">
								<div className="balance-info">
									<div className="balance">
										<span className="coins">
											<span className="int">{balance ? `${balance.split('.')[0]}` : '0'}</span>
											<span className="fraction">{FormatHelper.getFraction(balance, ECHO_ASSET_PRECISION)} </span>
										</span>
										<span className="currency">{ECHO_ASSET_SYMBOL}</span>
									</div>
								</div>
								<div className="balances-list">
									{assets ? assets.concat(tokens) : tokens}
								</div>
							</div>
						</div>
					</PerfectScrollbar>

					<div className="page-footer ">
						<LastTransaction transaction={transaction} language={language} accounts={accounts} click={() => history.push(HISTORY)} />
						<Footer history={history} currentNode={currentNode} platform={this.props.platform} localNodePercent={this.props.localNodePercent} />
					</div>
					<div className="settings-wrap">
						{
							showSettings ? (
								<Button className="btn-close" onClick={(e) => this.toggleSettings(e)} />
							) : (
								<Button
									className="btn-settings"
									onClick={(e) => { this.toggleSettings(e); }}
									content={
										<img src={settings} alt="" />
									}
								/>
							)
						}
					</div>
					<Settings
						open={showSettings}
						toggleSettings={(e) => this.toggleSettings(e)}
						accounts={accounts}
						saveSelectedAccounts={saveAccounts}
						updateBalance={updBalance}
						assets={this.getAssets(balances) || []}
						hiddenAssets={hiddenAssets}
						changeVisibilityAsset={(e, id) => this.changeVisibilityAsset(e, id)}
						tokens={stateTokens}
					/>

				</div>
			</div>
		);
	}

}

Wallet.defaultProps = {
	platform: null,
};

Wallet.propTypes = {
	accounts: PropTypes.object.isRequired,
	hiddenAssets: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired,
	platform: PropTypes.string,
	localNodePercent: PropTypes.number.isRequired,
	transaction: PropTypes.object.isRequired,
	histories: PropTypes.object.isRequired,
	balances: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	tokens: PropTypes.object.isRequired,
	currentNode: PropTypes.string.isRequired,
	setTransaction: PropTypes.func.isRequired,
	updateBalance: PropTypes.func.isRequired,
	saveSelectedAccounts: PropTypes.func.isRequired,
	initHiddenAssets: PropTypes.func.isRequired,
	updateTokens: PropTypes.func.isRequired,
	toggleVisibiltyAsset: PropTypes.func.isRequired,
	goToSend: PropTypes.func.isRequired,
};

export default Wallet;
