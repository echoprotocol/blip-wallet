/* eslint-disable react/jsx-no-target-blank */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';

import BN from 'bignumber.js';

import { EXPLORER_URL, ECHO_ASSET_PRECISION, ECHO_ASSET_SYMBOL } from '../../constants/global-constants';
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
		this.props.getFilteredHistory();
	}

	onToggleTransactionDetails(e, key) {
		e.preventDefault();
		this.props.toggleTransactionDetails(key);
	}

	onToggleSettings(e, status) {
		e.preventDefault();
		this.setState({ open: !status });
	}

	renderAmount(value = 0, precision = ECHO_ASSET_PRECISION) {
		return BN(value).div(BN(10).pow(precision)).toFixed(precision);
	}

	renderParticipant(field, accounts) {
		const networkId = Services.getUserStorage().getNetworkId();

		const name = !accounts.has(field.get('id')) ? (
			<a target="_blank" href={`${EXPLORER_URL[networkId]}${field.get('link')}`}>
				{field.get('value')}
			</a>
		) : <span>{field.get('value')}</span>;

		return (
			<span className="action-info">
				<span className="action-label">
					<FormattedMessage id={field.get('label')} />:
				</span>
				{name}
			</span>
		);
	}

	renderTransactionDetails(transaction, accounts) {
		return (
			<div className="line">
				{transaction.get('from') && this.renderParticipant(transaction.get('from'), accounts)}
				{transaction.get('subject') && this.renderParticipant(transaction.get('subject'), accounts)}
				<div className="balance">
					<span className="coins">
						{
							this.renderAmount(
								transaction.getIn(['fee', 'amount']),
								transaction.getIn(['fee', 'precision']),
							)
						}
					</span>
					<span className="currency">{transaction.getIn(['fee', 'symbol']) || ECHO_ASSET_SYMBOL}</span>
				</div>
			</div>
		);
	}

	renderTransaction(transaction, key, language, accounts) {
		return (
			<button className="last-transaction" key={key} type="button" onClick={(e) => this.onToggleTransactionDetails(e, key)}>
				<div className="line">
					<span className="date">
						{FormatHelper.transformDate(transaction.get('timestamp'), language, 'DD MMM, HH:mm')}
					</span>
					<span className="action">
						{transaction.get('name') && <FormattedMessage id={transaction.get('name')} />}
					</span>
					<div className="balance">
						<span className="coins">
							{
								this.renderAmount(
									transaction.getIn(['amount', 'value']),
									transaction.getIn(['asset', 'precision']),
								)
							}
						</span>
						<span className="currency">{transaction.getIn(['asset', 'value']) || ECHO_ASSET_SYMBOL}</span>
					</div>
				</div>
				{transaction.get('selected') && this.renderTransactionDetails(transaction, accounts)}
			</button>
		);
	}

	render() {
		const { language, accounts, history } = this.props;
		const { open } = this.state;

		return (
			<div className={classnames('wallet-page-wrap', { open })}>
				<div className="wallet page">
					<PerfectScrollbar className="page-scroll">
						<div className="wallet-footer">
							{history.get('transactions').map((t, i) => this.renderTransaction(t, i, language, accounts))}
						</div>
					</PerfectScrollbar>
					<div className="settings-wrap">
						<Button className="btn-settings" onClick={(e) => this.onToggleSettings(e, open)}>
							Filter
						</Button>
					</div>
					<Filter filter={history.get('filter')} toggleChecked={this.props.updateFilter} />
				</div>
			</div>
		);
	}

}

History.propTypes = {
	// intl: intlShape.isRequired,
	language: PropTypes.string.isRequired,
	accounts: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	getFilteredHistory: PropTypes.func.isRequired,
	toggleTransactionDetails: PropTypes.func.isRequired,
	updateFilter: PropTypes.func.isRequired,
};

export default History;
