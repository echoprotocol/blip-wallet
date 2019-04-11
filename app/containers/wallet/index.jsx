import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
// import { Animated } from 'react-animated-css';
// import { FormattedMessage } from 'react-intl';
// import { CREATE_PASSWORD } from '../../constants/routes-constants';
// import { EN_LOCALE, RU_LOCALE } from '../../constants/global-constants';
import settings from '../../assets/images/settings.svg';


class Wallet extends React.Component {


	render() {

		return (
			<div className="wallet page">
				<PerfectScrollbar className="page-scroll">
					<div className="settings-wrap">
						<Button
							className="btn-settings"
							content={
								<img src={settings} alt="" />
							}
						/>
					</div>
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
								<a href="/">homeres</a> {/*  or span (for From) */}
							</span>
							<span className="action-info">
								<span className="action-label">Creator:</span>
								<a href="/">homeres</a> {/*  or span (for From) */}
							</span>
						</div>
					</div>
					<div className="footer-actions">
						<div className="btn-wrap btns-2">
							<Button className="btn-main" />
							<Button className="btn-main" />
						</div>
					</div>
					<div className="loading-status" />
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
	() => ({
	}),
)(Wallet);
