import React from 'react';
import { Animated } from 'react-animated-css';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router';

import avatar from '../../assets/images/default-avatar.svg';

class AccountCreated extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isVisible: true,
			isVisibleWif: false,
		};
	}

	render() {
		const {
			wif, accountName, intl, history,
		} = this.props;
		const { isVisible, isVisibleWif } = this.state;

		const hint1 = intl.formatMessage({ id: 'account.created.wif.hint1' });
		const hint2 = intl.formatMessage({ id: 'account.created.wif.hint2' });
		const hint3 = intl.formatMessage({ id: 'account.created.wif.hint3' });
		const wifButton = intl.formatMessage({ id: 'account.created.wif.button' });

		return (
			<div className="welcome-page page">
				<div
					className="welcome-wrap"

				>

					<Animated
						className="welcome-info"
						animationIn="fadeInRight"
						animationOut="fadeOutLeft"
						isVisible={isVisible}
					>
						<h1>
							<FormattedMessage id="account.created.title1" />
							<br />
							<FormattedMessage id="account.created.title2" />
						</h1>
						<p>
							<FormattedMessage id="account.created.description1" />
							<FormattedMessage id="account.created.description2" />
						</p>
						<Button
							className="btn-primary arrow"
							onClick={() => history.push('/select-language')}
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
								<img className="avatar" src={avatar} alt="" />
								<div className="account-info">
									<div className="label"><FormattedMessage id="account.created.wif.name" /></div>
									<div className="name">{accountName}</div>
								</div>
							</div>
						</div>
						<div className="body">
							<div className="card-wrap">
								<span>
									{hint1}
									<br />
									{hint2}
									<br />
									{hint3}
								</span>
								<div className="wif-wrap">
									<div className="wif-label">WIF</div>
									<div className="wif">
										{wif}
									</div>
								</div>
								<CopyToClipboard text={wif}>
									<Button
										className="btn-white"
										onClick={() => this.setState({ isVisibleWif: true })}
										content={(
											<React.Fragment>
												<Icon name="copy" />
												<div className="text">{wifButton}</div>
											</React.Fragment>
										)}
									/>
								</CopyToClipboard>
							</div>
						</div>
					</Animated>
				</div>
				<Animated
					className="wif-toast"
					animationIn="fadeIn"
					animationOut="fadeOut"
					isVisible={isVisibleWif}
				> <FormattedMessage id="account.created.wif.copied" />
				</Animated>

			</div>
		);
	}

}

AccountCreated.propTypes = {
	history: PropTypes.object.isRequired,
	wif: PropTypes.string.isRequired,
	accountName: PropTypes.string.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl(withRouter(AccountCreated));
