import React from 'react';
import { Button } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FormatHelper from '../../helpers/format-helper';
import settings from '../../assets/images/settings.svg';
import Settings from './settings';
import { CORE_ASSET_SYMBOL } from '../../constants/global-constants';


class Wallet extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showSettings: false,
		};
	}

	componentDidUpdate(prevProps) {
		const { accounts, updateBalance: updBalance } = this.props;
		const { accounts: prevAccounts } = prevProps;

		if (!accounts.equals(prevAccounts)) {
			updBalance();
		}
	}

	getBalance(balances) {
		if (!balances.size) {
			return null;
		}

		const result = FormatHelper.accumulateBalances([...balances.map((a) => a.amount).values()]);

		const precision = [...balances.values()][0].asset.get('precision');

		return result.div(10 ** precision).toString();
	}

	getFraction(balance) {
		if (balance) {
			if (balance.split('.')[1]) {
				return balance.split('.')[1];
			}
		}

		return '00000';
	}

	toggleSettings(e) {
		e.target.blur();
		const { showSettings } = this.state;
		this.setState({
			showSettings: !showSettings,
		});
	}

	render() {
		const {
			accounts, saveSelectedAccounts: saveAccounts, balances, updateBalance: updBalance, currentNode,
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
							<div className="title">My balance</div>
							<div className="wallet-container">
								<div className="balance-info">
									<div className="balance">
										<span className="coins">
											<span className="int">{balance ? `${balance.split('.')[0]}.` : '0.'}</span>
											<span className="fraction">{this.getFraction(balance)} </span>
										</span>
										<span className="currency">{CORE_ASSET_SYMBOL}</span>
									</div>
									<div className="info">
										<span className="coins">+ 0.00000 </span>
										<span className="currency">{CORE_ASSET_SYMBOL} </span>
										<span className="message">(unclaimed)</span>
										<Link to="/" className="claim-link">Claim balance</Link>
									</div>
								</div>
							</div>
						</div>
					</PerfectScrollbar>

					<div className="wallet-footer">
						<div className="last-transaction">
							<div className="label">last transaction</div>
							<div className="line">
								<span className="date">
								22 Sep, 11:35
								</span>
								<span className="action">
								Account created
								</span>
								<div className="balance">
									<span className="coins">0.00000</span>
									<span className="currency">{CORE_ASSET_SYMBOL} </span>
								</div>
							</div>
							<div className="line">
								<span className="action-info">
									<span className="action-label">Creator:</span>
									<Link to="/">homeres</Link> {/*  or span (for From) */}
								</span>
								<span className="action-info">
									<span className="action-label">Creator:</span>
									<Link to="/">homeres</Link> {/*  or span (for From) */}
								</span>
							</div>
						</div>
						<div className="footer-actions">
							<div className="btn-wrap btns-2">
								<Button
									className="btn-main"
									content={
										<span className="text">Send</span>
									}
								/>
								<Button
									className="btn-gray"
									content={
										<span className="text">Receive</span>
									}
								/>
							</div>
							<div className="footer-info">
								<div className="mode">{`${FormatHelper.capitalizeFirstLetter(currentNode)} node`}</div>
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
					/>

				</div>
			</div>
		);
	}

}

Wallet.propTypes = {
	accounts: PropTypes.object.isRequired,
	balances: PropTypes.object.isRequired,
	currentNode: PropTypes.string.isRequired,
	updateBalance: PropTypes.func.isRequired,
	saveSelectedAccounts: PropTypes.func.isRequired,
};

export default Wallet;
