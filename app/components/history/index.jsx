/* eslint-disable react/jsx-no-target-blank */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button, Icon } from 'semantic-ui-react';
import classnames from 'classnames';
import { OPERATIONS_IDS } from 'echojs-lib';
import BN from 'bignumber.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import settings from '../../assets/images/settings.svg';
import dimmerLoading from '../../assets/images/dimmer-loader.png';

import {
	ECHO_ASSET_PRECISION, ECHO_ASSET_SYMBOL, MAX_ASSET_SYMBOL_LENGTH,
} from '../../constants/global-constants';
import { CONTRACT_TYPES, ACCOUNT_TYPES } from '../../constants/transaction-constants';
import FormatHelper from '../../helpers/format-helper';
import Services from '../../services';
import { newOperation as newOperationSubscription } from '../../services/subscriptions/transaction-subscriptions';

import Filter from './filter';
import Footer from '../footer';

class History extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false,
		};

		this.subscription = null;
	}

	componentDidMount() {
		this.props.loadTransactions();
		this.subscribe(this.props.filter);
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.filter.equals(this.props.filter)) {
			this.unsubscribe();
			this.subscribe(this.props.filter);
		}
	}

	componentWillUnmount() {
		this.unsubscribe();
		this.props.clear();
	}

	onToggleTransactionDetails(e, key) {
		if (!CONTRACT_TYPES.includes(this.props.transactions.getIn([key, 'type']))) {
			return;
		}

		this.props.toggleTransactionDetails(key);
	}

	onToggleSettings(e, status) {
		e.preventDefault();
		e.target.blur();
		this.setState({ open: !status });
	}

	onCloseFilter() {
		this.setState({ open: false });
	}

	onResetFilter(accounts, coins, types) {
		this.props.saveFilters(accounts, coins, types);
	}

	onApplyFilter(accounts, coins, types) {
		this.setState({ open: false });
		this.props.saveFilters(accounts, coins, types);
	}

	onLoadMore() {
		const { transactions, total } = this.props;

		if (!transactions.size || transactions.size === total) {
			return;
		}

		this.props.loadMoreTransactions();
	}

	getIconClassName(transaction, sender) {
		if (CONTRACT_TYPES.includes(transaction.get('type'))) {
			return 'icon-contract';
		}

		if (ACCOUNT_TYPES.includes(transaction.get('type'))) {
			return 'icon-account';
		}

		if (OPERATIONS_IDS.TRANSFER === transaction.get('type') && sender) {
			return 'icon-send-trans';
		}

		return 'icon-receive-trans';
	}

	cutAsset(transaction, type, value) {
		return (
			transaction.getIn([type, value]).length > MAX_ASSET_SYMBOL_LENGTH
				? transaction.getIn([type, value]).slice(0, 5).concat('..')
				: transaction.getIn([type, value])
		);
	}

	subscribe(filter) {
		this.subscription = newOperationSubscription(filter);

		if (this.subscription) {
			this.subscription = this.subscription.subscribe(({ data: { newOperation } }) => {
				this.props.setNewTransaction(newOperation);
			});
		}
	}

	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
			this.subscription = null;
		}
	}

	renderAmount(value = 0, precision = ECHO_ASSET_PRECISION) {
		return BN(value).div(BN(10).pow(precision)).toFixed(precision);
	}

	renderParticipant(field, accounts) {
		if (!field) {
			return null;
		}

		const networkId = Services.getUserStorage().getNetworkId();

		return !accounts.has(field.get('id')) ? (
			// eslint-disable-next-line no-undef
			<a target="_blank" href={`${EXPLORER_URL[networkId]}${field.get('link')}`}>
				{field.get('value')}
			</a>
		) : field.get('value');

	}

	renderTransactionDetails(transaction) {
		const status = transaction.get('status') ? 'success' : 'fail';

		return (
			<React.Fragment>
				<ul className="line-details">
					<li>
						<div className="line-details-wrap">
							<div className="status">
								<div className="status-title"><FormattedMessage id="history.table.status.title" /></div>
								<div className="status-content"><FormattedMessage id={`history.table.status.${status}`} /></div>
							</div>
							<div className="bytecode">
								<div className="bytecode-title"><FormattedMessage id="history.table.bytecode" /></div>
								<CopyToClipboard text={transaction.get('code')}>
									<Button
										content={(
											<React.Fragment>
												<span className="text">0x{transaction.get('code')}</span>
												<Icon className="copy" />
											</React.Fragment>
										)}
									/>
								</CopyToClipboard>
							</div>
						</div>
					</li>
					<li />
					<li />
					<li />
					<li />
					<li />
					<li />
					<li />
				</ul>
				<ul className="line-air">
					<li />
				</ul>
			</React.Fragment>

		);
	}

	renderTransaction(transaction, key) {
		const { language, accounts } = this.props;

		const sender = accounts.has(transaction.getIn(['from', 'id']));

		return (
			<React.Fragment key={key}>
				<button

					className={classnames('transaction-item', { selected: transaction.get('selected') })}
					type="button"
					onClick={(e) => this.onToggleTransactionDetails(e, key)}
				>
					<ul className={classnames('line', { contract: CONTRACT_TYPES.includes(transaction.get('type')) })}>
						<li className="type">
							<span className={this.getIconClassName(transaction, sender)} />
							<span className="line-content">
								{transaction.get('name') && <FormattedMessage id={transaction.get('name')} />}
							</span>
						</li>
						<li className="age">
							<span className="line-content">
								{FormatHelper.getLocaleDateFromNow(transaction.get('timestamp'), language, 'DD MMM HH:mm')}
							</span>
						</li>
						<li className="from">
							<span className="line-content">
								{this.renderParticipant(transaction.get('from'), accounts)}
							</span>
						</li>
						<li className="from-to-icon">
							{
								/* left */
								transaction.get('from') && transaction.get('subject') ? (
									<Icon className="arrow-direction" />
								) : null
							}
						</li>
						<li className="to">
							<span className="line-content">
								{this.renderParticipant(transaction.get('subject'), accounts)}
							</span>
						</li>
						<li className="amount">
							<span className="line-content coins">
								{
									this.renderAmount(
										transaction.getIn(['amount', 'value']),
										transaction.getIn(['asset', 'precision']),
									)
								}
								<span>
									{
										transaction.getIn(['asset', 'value'])
											? this.cutAsset(transaction, 'asset', 'value') : ECHO_ASSET_SYMBOL
									}
								</span>
							</span>
						</li>
						<li className="fee">
							<span className="line-content">
								{`${this.renderAmount(
									transaction.getIn(['fee', 'amount']),
									transaction.getIn(['fee', 'precision']),
								)} ${
									transaction.getIn(['fee', 'symbol'])
										? this.cutAsset(transaction, 'fee', 'symbol') : ECHO_ASSET_SYMBOL}`}
							</span>
						</li>
						<li className="handler" />
					</ul>
				</button>
				{ transaction.get('selected') && this.renderTransactionDetails(transaction) }
			</React.Fragment>
		);
	}

	render() {
		const {
			loading, transactions, filter, history, currentNode,
		} = this.props;
		const { open } = this.state;

		return (
			<div className={classnames('page-wrap', { open })}>
				<div className="transactions page">
					<PerfectScrollbar className="page-scroll" onYReachEnd={() => this.onLoadMore()}>
						<div className="transactions-wrap">
							<div className="page-title"><FormattedMessage id="history.table.title" /></div>
							{
								loading ? (
									<div className="dimmer">
										<img className="dimmer-loading" src={dimmerLoading} alt="" />
									</div>
								) : (
									<div className="table-transactions">
										{
											transactions.size ? (
												<div className="transaction-header">
													<ul className="line">
														<li className="type"><FormattedMessage id="history.table.type" /></li>
														<li className="age"><FormattedMessage id="history.table.age" /></li>
														<li className="from"><FormattedMessage id="history.table.from" /></li>
														<li />
														<li className="to"><FormattedMessage id="history.table.to" /></li>
														<li className="amount"><FormattedMessage id="history.table.amount" /></li>
														<li className="fee"><FormattedMessage id="history.table.fee" /></li>
														<li />
													</ul>
												</div>
											) : <div />
										}
										{transactions.map((tr, key) => this.renderTransaction(tr, key))}
									</div>
								)
							}
						</div>
						<div className="settings-wrap">
							{
								open ? (
									<Button className="btn-close" onClick={(e) => this.onToggleSettings(e, open)} />
								) : (
									<Button
										className="btn-settings"
										onClick={(e) => this.onToggleSettings(e, open)}
										content={
											<img src={settings} alt="" />
										}
									/>
								)
							}

						</div>
					</PerfectScrollbar>
					<div className="page-footer">
						<Footer history={history} currentNode={currentNode} platform={this.props.platform} localNodePercent={this.props.localNodePercent} />
					</div>

					<Filter
						filter={filter}
						apply={(accounts, coins, types) => this.onApplyFilter(accounts, coins, types)}
						reset={(accounts, coins, types) => this.onResetFilter(accounts, coins, types)}
						close={() => this.onCloseFilter()}
					/>
				</div>
			</div>
		);
	}

}

History.propTypes = {
	loading: PropTypes.bool,
	language: PropTypes.string.isRequired,
	accounts: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	transactions: PropTypes.object.isRequired,
	filter: PropTypes.object.isRequired,
	total: PropTypes.number,
	currentNode: PropTypes.string.isRequired,
	loadTransactions: PropTypes.func.isRequired,
	toggleTransactionDetails: PropTypes.func.isRequired,
	saveFilters: PropTypes.func.isRequired,
	loadMoreTransactions: PropTypes.func.isRequired,
	setNewTransaction: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	localNodePercent: PropTypes.number.isRequired,
	platform: PropTypes.string,
};

History.defaultProps = {
	loading: false,
	total: null,
	platform: null,
};

export default History;
