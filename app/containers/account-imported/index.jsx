import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Animated } from 'react-animated-css';
import { Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

import Avatar from '../../components/avatar';
import { startAnimation } from '../../actions/animation-actions';
import { ACCOUNT_IMPORTED, WALLET } from '../../constants/routes-constants';

class AccountImported extends React.Component {

	componentWillUnmount() {
		this.props.startAnimation(ACCOUNT_IMPORTED, 'isVisible', true);
	}

	render() {
		const { accountName, history } = this.props;
		const { isVisible } = this.props;

		return (

			<div className="welcome-page page">
				<div className="welcome-wrap">
					<div className="welcome-info import">
						<Animated
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							isVisible={isVisible}
						>
							<h1>
								<FormattedMessage id="account.imported.title1" />
								<br />
								<FormattedMessage id="account.imported.title2" />
							</h1>
						</Animated>
						<Animated
							className="account"
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							animationInDelay={50}
							isVisible={isVisible}
						>
							<Avatar accountName={accountName} />
							<div className="account-info">
								<div className="label"><FormattedMessage id="account.imported.name" /></div>
								<div className="name">
									{accountName}
								</div>
							</div>
						</Animated>
						<Animated
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							animationInDelay={100}
							isVisible={isVisible}
						>
							<Button
								className="btn-primary arrow"
								onClick={() => history.push(WALLET)}
								content={(
									<React.Fragment>
										<div className="text"><FormattedMessage id="account.imported.button" /></div>
										<Icon className="arrow-right" />
									</React.Fragment>
								)}
							/>
						</Animated>
					</div>
				</div>
			</div>
		);
	}

}

AccountImported.propTypes = {
	history: PropTypes.object.isRequired,
	accountName: PropTypes.string.isRequired,
	isVisible: PropTypes.bool.isRequired,
	startAnimation: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		isVisible: state.animation.getIn([ACCOUNT_IMPORTED, 'isVisible']),
	}),
	(dispatch) => ({
		startAnimation: (type, field, value) => dispatch(startAnimation(type, field, value)),
	}),
)(AccountImported));
