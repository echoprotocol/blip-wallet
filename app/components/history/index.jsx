/* eslint-disable react/jsx-no-target-blank */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button, Icon } from 'semantic-ui-react';
import classnames from 'classnames';

import BN from 'bignumber.js';

import settings from '../../assets/images/settings.svg';
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

	renderTransactionDetails() {
		return (
			<React.Fragment>
				<ul className="line-details">
					<li>
						<div className="line-details-wrap">
							<div className="status">
								<div className="status-title">Status</div>
								<div className="status-content">Success</div>
							</div>
							<div className="bytecode">
								<div className="bytecode-title">Bytecode</div>
								<Button
									content={(
										<React.Fragment>
											<span className="text">sd0x64d201c8911e9026508ff209148334babae1350438aa9343434343434</span>
											<Icon className="copy" />
										</React.Fragment>
									)}
								/>
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

	renderTransaction() {
		const { history, language, accounts } = this.props;
		return (
			<div className="table-transactions">
				<div className="transaction-header">
					<ul className="line">
						<li className="type">Type</li>
						<li className="age">Age</li>
						<li className="from">From</li>
						<li />
						<li className="to">To</li>
						<li className="amount">Amount</li>
						<li className="fee">Fee</li>
						<li />
					</ul>
				</div>
				{history.get('transactions').map((transaction, key) => (
					<React.Fragment key={Math.random()}>
						<button
							className={classnames('transaction-item', { selected: transaction.get('selected') })}
							type="button"
							onClick={(e) => this.onToggleTransactionDetails(e, key)}
						>
							<ul className="line contract">
								<li className="type">
									<Icon className="icon-contract" /> {/* receive-trans, send-trans, contract, account  */}
									<span className="line-content">
										{transaction.get('name') && <FormattedMessage id={transaction.get('name')} />}
									</span>
								</li>
								<li className="age">
									<span className="line-content">
										{FormatHelper.transformDate(transaction.get('timestamp'), language, 'DD MMM, HH:mm')}
									</span>
								</li>
								<li className="from">
									<span className="line-content">
										<a href="">homer341234-df</a>
									</span>
								</li>
								<li className="from-to-icon">
									<Icon className="arrow-direction" /> {/* can be  with .left */}
								</li>
								<li className="to">
									<span className="line-content">
										<a href="">homer341234-df</a>
									</span>
								</li>
								<li className="amount">
									<span className="line-content coins">
										<span>
											{
												this.renderAmount(
													transaction.getIn(['amount', 'value']),
													transaction.getIn(['asset', 'precision']),
												)
											}
										</span>
										<span> {transaction.getIn(['asset', 'value']) || ECHO_ASSET_SYMBOL}</span>
									</span>
								</li>
								<li className="fee">
									<span className="line-content">
									0.00010 ECHO
									</span>
								</li>
								<li className="handler" />
							</ul>
						</button>
						{ transaction.get('selected') && this.renderTransactionDetails(transaction, accounts) }
						<button className="transaction-item" type="button">
							<ul className="line">
								<li className="type">
									<Icon className="icon-contract" /> {/* receive-trans, send-trans, contract, account  */}
									<span className="line-content">
									esdsdsdsdsd
									</span>
								</li>
								<li className="age">
									<span className="line-content">
								12 min
									</span>
								</li>
								<li className="from">
									<span className="line-content">
										<a href="">homer341234-df</a>
									</span>
								</li>
								<li className="from-to-icon">
									<Icon className="arrow-direction" /> {/* can be  with .left */}
								</li>
								<li className="to">
									<span className="line-content">
										<a href="">homer341234-df</a>
									</span>
								</li>
								<li className="amount">
									<span className="line-content coins">
										<span>0.000000</span>
										<span>ECHO</span>
									</span>
								</li>
								<li className="fee">
									<span className="line-content">
									0.00010 ECHO
									</span>
								</li>
								<li className="handler" />
							</ul>
						</button>
					</React.Fragment>
				))}


			</div>
		);
	}

	render() {
		const { history } = this.props;
		const { open } = this.state;

		return (
			<div className={classnames('page-wrap', { open })}>
				<div className="transactions page">
					<PerfectScrollbar className="page-scroll">
						<div className="transactions-wrap">
							<div className="title">My transitions</div>
							{ this.renderTransaction() }
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
