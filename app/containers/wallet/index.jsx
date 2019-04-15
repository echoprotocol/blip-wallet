import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
// import { FormattedMessage } from 'react-intl';
// import { CREATE_PASSWORD } from '../../constants/routes-constants';
// import { EN_LOCALE, RU_LOCALE } from '../../constants/global-constants';
import settings from '../../assets/images/settings.svg';
import Settings from './settings';


class Wallet extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showSettings: false,
		};
	}

	toggleSettings(e) {
		e.target.blur();
		const { showSettings } = this.state;
		this.setState({
			showSettings: !showSettings,
		});
	}

	render() {
		const { showSettings } = this.state;

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
											<span className="int">0.</span>
											<span className="fraction">00000 </span>
										</span>
										<span className="currency">Echo</span>
									</div>
									<div className="info">
										<span className="coins">+ 0.00000 </span>
										<span className="currency">ECHO </span>
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
									<span className="currency">ECHO </span>
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
								<div className="mode">Local mode</div>
								<div className="sync">
									<span className="percent">100%</span> synced with network

								</div>
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
					<Settings open={showSettings} />

				</div>
			</div>
		);
	}

}

Wallet.propTypes = {
};

export default connect(
	(state) => ({
		language: state.global.get('language'),
	}),
)(Wallet);
