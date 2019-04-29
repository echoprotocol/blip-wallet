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
import { EXPLORER_URL, ECHO_ASSET_PRECISION, ECHO_ASSET_SYMBOL } from '../../constants/global-constants';
import { CONTRACT_TYPES, ACCOUNT_TYPES } from '../../constants/transaction-constants';
import FormatHelper from '../../helpers/format-helper';
import Services from '../../services';

import Filter from './filter';

class History extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false,
		};
	}

	componentDidMount() {
		this.props.loadTransactions();
	}

	onToggleTransactionDetails(e, key) {
		e.preventDefault();

		if (!CONTRACT_TYPES.includes(this.props.history.getIn(['transactions', key, 'type']))) {
			return;
		}

		this.props.toggleTransactionDetails(key);
	}

	onToggleSettings(e, status) {
		e.preventDefault();
		this.setState({ open: !status });
	}

	onResetFilter() {
		this.setState({ open: false });
		this.props.resetFilters();
	}

	onCloseFilter() {
		this.setState({ open: false });
	}

	onApplyFilter(accounts, coins, types) {
		this.setState({ open: false });
		this.props.saveFilters(accounts, coins, types);
	}

	onLoadMore() {
		const { history } = this.props;

		if (!history.get('transactions').size || history.get('transactions').size === history.get('total')) {
			return;
		}

		this.props.loadMoreTransactions();
	}

	getIconClassName(transaction, received) {
		if (CONTRACT_TYPES.includes(transaction.get('type'))) {
			return 'icon-contract';
		}

		if (ACCOUNT_TYPES.includes(transaction.get('type'))) {
			return 'icon-account';
		}

		if (OPERATIONS_IDS.TRANSFER === transaction.get('type') && received) {
			return 'icon-receive-trans';
		}

		return 'icon-send-trans';
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

		const received = !accounts.has(transaction.getIn(['subject', 'id']));

		return (
			<React.Fragment key={key}>
				<button

					className={classnames('transaction-item', { selected: transaction.get('selected') })}
					type="button"
					onClick={(e) => this.onToggleTransactionDetails(e, key)}
				>
					<ul className={classnames('line', { contract: CONTRACT_TYPES.includes(transaction.get('type')) })}>
						<li className="type">
							<Icon className={this.getIconClassName(transaction, received)} />
							<span className="line-content">
								{transaction.get('name') && <FormattedMessage id={transaction.get('name')} />}
							</span>
						</li>
						<li className="age">
							<span className="line-content">
								{FormatHelper.getLocaleDateFromNow(transaction.get('timestamp'), language, 'DD MMM, HH:mm')}
							</span>
						</li>
						<li className="from">
							<span className="line-content">
								{this.renderParticipant(transaction.get('from'), accounts)}
							</span>
						</li>
						<li className="from-to-icon">
							{
								transaction.get('subject') ? (
									<Icon
										className={classnames(
											'arrow-direction',
											{ left: OPERATIONS_IDS.TRANSFER === transaction.get('type') && received },
										)}
									/>
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
								<span> {transaction.getIn(['asset', 'value']) || ECHO_ASSET_SYMBOL}</span>
							</span>
						</li>
						<li className="fee">
							<span className="line-content">
								{`${this.renderAmount(
									transaction.getIn(['fee', 'amount']),
									transaction.getIn(['fee', 'precision']),
								)} ${transaction.getIn(['fee', 'symbol']) || ECHO_ASSET_SYMBOL}`}
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
		const { history } = this.props;
		const { open } = this.state;

		return (
			<div className={classnames('page-wrap', { open })}>
				<div className="transactions page">
					<PerfectScrollbar className="page-scroll" onYReachEnd={() => this.onLoadMore()}>
						<div className="transactions-wrap">
							<div className="title"><FormattedMessage id="history.table.title" /></div>
							{
								history.get('transactions').size ? (
									<div className="table-transactions">
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
										{history.get('transactions').map((tr, key) => this.renderTransaction(tr, key))}
									</div>
								) : <div />
							}
						</div>
						<div className="settings-wrap">
							<Button
								className="btn-settings"
								onClick={(e) => this.onToggleSettings(e, open)}
								content={
									<img src={settings} alt="" />
								}
							/>
						</div>
					</PerfectScrollbar>
					<div className="page-footer">
						<div className="footer-actions">
							<div className="btn-wrap">
								<Button
									className="btn-main"
									content={
										<span className="text"><FormattedMessage id="wallet.send" /></span>
									}
								/>
							</div>
							<div className="footer-info">
								<div className="mode">Remote node</div>
							</div>
						</div>
						<div className="loading-status" />
					</div>

					<Filter
						filter={history.get('filter')}
						apply={(accounts, coins, types) => this.onApplyFilter(accounts, coins, types)}
						reset={() => this.onResetFilter()}
						close={() => this.onCloseFilter()}
					/>
				</div>
			</div>
		);
	}

}

History.propTypes = {
	language: PropTypes.string.isRequired,
	accounts: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	loadTransactions: PropTypes.func.isRequired,
	toggleTransactionDetails: PropTypes.func.isRequired,
	saveFilters: PropTypes.func.isRequired,
	resetFilters: PropTypes.func.isRequired,
	loadMoreTransactions: PropTypes.func.isRequired,
};

export default History;
