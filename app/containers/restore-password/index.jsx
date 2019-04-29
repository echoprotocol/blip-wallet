import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import { Animated } from 'react-animated-css';
import blipLogo from '../../assets/images/blip-logo.svg';
import { startAnimation } from '../../actions/animation-actions';
import { clearWalletData } from '../../actions/global-actions';
import {
	CREATE_PASSWORD,
	RESTORE_PASSWORD, UNLOCK,
} from '../../constants/routes-constants';


class RestorePassword extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			checked: false,
		};

		this.onChange = this.onChange.bind(this);
		this.onClearData = this.onClearData.bind(this);
	}

	componentWillUnmount() {
		this.props.startAnimation(RESTORE_PASSWORD, true);
	}

	onChange() {
		this.setState((prevState) => ({
			checked: !prevState.checked,
		}));
	}

	async onClearData() {
		await this.props.clearWalletData();
		await this.props.startAnimation(RESTORE_PASSWORD, false);
		this.props.history.push(CREATE_PASSWORD);
	}

	async returnFunction() {
		await this.props.startAnimation(RESTORE_PASSWORD, false);
		this.props.history.goBack();
		this.props.startAnimation(UNLOCK, true);
	}


	render() {
		const { isVisible } = this.props;

		return (
			<div className="restore-page">
				<Animated
					className="restore-back"
					animationIn="fadeInRightBig"
					animationOut="fadeOutLeft"
					isVisible={isVisible}
				>
					<Button
						className="btn-return arrow left"
						onClick={() => this.returnFunction()}
						content={(
							<React.Fragment>
								<div className="text">Return</div>
								<Icon className="arrow-left" />
							</React.Fragment>
						)}
					/>
				</Animated>
				<Animated
					className="restore-logo-wrap"
					animationIn="fadeInRightBig"
					animationOut="fadeOutLeft"
					isVisible={isVisible}
				>
					<img className="blip-logo" src={blipLogo} alt="" />
				</Animated>

				<div className="restore-info">
					<Animated
						animationIn="fadeInRightBig"
						animationOut="fadeOutLeft"
						isVisible={isVisible}
					>
						<h1>
							<FormattedMessage id="restorePassword.title" />
						</h1>
					</Animated>
					<Animated
						animationIn="fadeInRightBig"
						animationOut="fadeOutLeft"
						animationInDelay={80}
						isVisible={isVisible}
					>
						<p>
							<FormattedHTMLMessage id="restorePassword.description" />
						</p>
					</Animated>

				</div>
				<Animated
					className="clear-container"
					animationIn="fadeIn"
					animationOut="fadeOut"
					animationInDelay={80}
					isVisible={isVisible}
				>
					<div className="checkbox">
						<input onChange={this.onChange} checked={this.state.checked} type="checkbox" id="clear-data" />
						<label htmlFor="clear-data" className="checkbox-label">
							<div className="label-text">
								<FormattedMessage id="restorePassword.checkboxLabel" />
							</div>
						</label>
					</div>
					<Button
						className="btn-white"
						disabled={!this.state.checked}
						fluid
						onClick={this.onClearData}
						content={(
							<React.Fragment>
								<div className="text"><FormattedMessage id="restorePassword.btn" /></div>
							</React.Fragment>
						)}
					/>
				</Animated>
			</div>
		);
	}

}
RestorePassword.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	startAnimation: PropTypes.func.isRequired,
	clearWalletData: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
};


export default connect(
	(state) => ({
		isVisible: state.animation.getIn([RESTORE_PASSWORD, 'isVisible']),
	}),
	(dispatch) => ({
		startAnimation: (type, value) => dispatch(startAnimation(type, value)),
		clearWalletData: () => dispatch(clearWalletData()),
	}),
)(RestorePassword);
