import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Animated } from 'react-animated-css';

import { Button, Input, Icon } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router';
import classnames from 'classnames';

import { startAnimation } from '../../actions/animation-actions';
import { ACCOUNT_CREATED, WALLET } from '../../constants/routes-constants';
import Avatar from '../../components/avatar';

class AccountCreated extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isVisibleWif: false,
			focused: false,
		};
	}

	componentWillUnmount() {
		this.props.startAnimation(ACCOUNT_CREATED, 'isVisible', true);
	}

	copyBlur() {
		this.setState({ focused: false });
	}

	copyFocus() {
		this.setState({ focused: true });
	}

	changeVisibleCpyWif() {
		this.setState({ isVisibleWif: true });
		setTimeout(() => this.setState({ isVisibleWif: false }), 3000);
	}

	renderCopy(wif) {
		const { isVisibleWif } = this.state;
		return (
			<div className="copy-wrap">
				<CopyToClipboard text={wif}>
					<Button
						onFocus={() => this.copyFocus()}
						onBlur={() => this.copyBlur()}
						onClick={() => this.changeVisibleCpyWif()}
						content={<Icon className="copy" />}
						className={
							classnames(
								'btn-square primary',
								{ copied: isVisibleWif },
							)
						}
					/>
				</CopyToClipboard>
			</div>
		);
	}

	render() {
		const { isVisibleWif, focused } = this.state;
		const {
			wif, accountName, intl, history, isVisible, accountId,
		} = this.props;

		const hint1 = intl.formatMessage({ id: 'account.created.wif.hint1' });
		const hint2 = intl.formatMessage({ id: 'account.created.wif.hint2' });
		const hint3 = intl.formatMessage({ id: 'account.created.wif.hint3' });

		return (
			<div className="welcome-page page">
				<div className="welcome-wrap">

					<Animated
						animationIn="fadeInRight"
						animationOut="fadeOutLeft"
						isVisible={isVisible}
						className="welcome-info"
					>
						<h1>
							<FormattedMessage id="account.created.title1" />
							<br />
							<FormattedMessage id="account.created.title2" />
						</h1>
						<p>
							<FormattedMessage id="account.created.description1" />
							{' '}
							<FormattedMessage id="account.created.description2" />
						</p>
						<Button
							className="btn-primary arrow"
							onClick={() => history.push(WALLET)}
							content={(
								<React.Fragment>
									<div className="text"><FormattedMessage id="account.created.button" /></div>
									<Icon className="arrow-right" />
								</React.Fragment>
							)}
						/>
					</Animated>
					<Animated
						className="welcome-card"
						animationIn="fadeInRight"
						animationOut="fadeOutLeft"
						animationInDelay={50}
						isVisible={isVisible}
					>
						<div className="head">
							<div className="card-wrap">
								<Avatar accountName={accountName} />
								<div className="account-info">
									<div className="label"><FormattedMessage id="account.created.wif.name" /></div>
									<div className="name">{accountName}</div>
								</div>
							</div>
						</div>
						<div className="body">
							<div className="card-wrap">
								<div>
									<div className="wif-label"><FormattedMessage id="account.created.wif.id" /></div>
									<div className="name">{accountId}</div>
								</div>
								<div className="wif-wrap">
									<div className="wif-label">WIF</div>
									<div className="wif">
										<Input
											name="wif"
											disabled
											className={
												classnames(
													'white wif',
													{ focused },
												)
											}
											value={wif}
											icon={this.renderCopy(wif)}
											fluid
										/>

									</div>
								</div>
								<span>
									{hint1}
									<br />
									{hint2}
									<br />
									{hint3}
								</span>
							</div>

						</div>
					</Animated>
				</div>
				<Animated
					className="wif-toast"
					animationIn="fadeInUp"
					animationOut="fadeOutDown"
					animateOnMount={false}
					isVisible={isVisibleWif}
				>	<FormattedMessage id="account.created.wif.copied" />
				</Animated>

			</div>
		);
	}

}

AccountCreated.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	startAnimation: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	wif: PropTypes.string.isRequired,
	accountName: PropTypes.string.isRequired,
	accountId: PropTypes.string.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl(withRouter(connect(
	(state) => ({
		isVisible: state.animation.getIn([ACCOUNT_CREATED, 'isVisible']),
	}),
	(dispatch) => ({
		startAnimation: (type, field, value) => dispatch(startAnimation(type, field, value)),
	}),
)(AccountCreated)));
