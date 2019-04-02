import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';
import { Animated } from 'react-animated-css';
import classnames from 'classnames';
import {
	AUTHORIZATION,
} from '../../constants/routes';
import Header from '../../components/header';


class CreatePassword extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showPas: false,
			showReapeatPas: false,
			isVisible: true,
		};
	}


	onTogglePrivacy(pas, a) {
		if (a) {
			this.setState({ showPas: !pas });

		} else {
			this.setState({ showReapeatPas: !pas });
		}
	}

	goForward() {

		const { history } = this.props;

		this.setState({
			isVisible: false,
		});

		setTimeout(() => {
			history.push(AUTHORIZATION);
		}, 200);
	}

	renderPrivacyEye(pas, a) {
		return (
			<Button
				tabIndex="-1"
				className={
					classnames(
						'icon-eye',
						{ enable: pas },
						{ disabled: !pas },
					)
				}
				onClick={() => this.onTogglePrivacy(pas, a)}
			/>
		);
	}

	render() {
		const { error, errorMessage } = this.props;
		const { showPas, showReapeatPas, isVisible } = this.state;
		return (

			<div className="main-bg">
				<Header />
				<div className="form-wrap">
					<div className="form-content">

						<Animated
							animationIn="fadeInRightBig"
							animationOut="fadeOutLeft"
							isVisible={isVisible}
							className="lines"
						>
							<div className="line">
								<div className="line-label">
									Enter Password
								</div>
								<div className="line-content">
									<div className="field">
										<Input
											placeholder="Enter Password"
											ref={(input) => { this.nameInput = input; }}
											className="password"
											error={error}
											loading={false}
											type={showPas ? 'text' : 'password'}
											icon={this.renderPrivacyEye(showPas, true)}
											fluid
										/>
									</div>

								</div>

							</div>
							<div className="line">
								<div className="line-label">
									Repeat Password
								</div>
								<div className="line-content">
									<div className="field">
										<Input
											placeholder="Repeat Password"
											error
											className="password"
											loading={false}
											type={showReapeatPas ? 'text' : 'password'}
											icon={this.renderPrivacyEye(showReapeatPas)}
											fluid
										/>
										{
											errorMessage
											&& (
												<div className="error-message">
													{errorMessage}
												</div>
											)
										}
										<div className="hints">
											<div className="hint">English alphabet from 8 to 32</div>
											<div className="hint">One uppercase letter</div>
											<div className="hint">One lowercase letter</div>
											<div className="hint">One number</div>
										</div>
									</div>
								</div>
							</div>
						</Animated>
						<div className="form-action">
							<div className="line">
								<div className="line-label" />
								<div className="line-content">
									<Animated
										className="btns-wrap"
										animationIn="fadeInRight"
										animationOut="fadeOutLeft"
										animationInDelay={100}
										isVisible={isVisible}
									>
										<Button
											className="btn-primary"
											onClick={() => this.goForward()}
											content={<span className="text">Create Password</span>}
										/>
									</Animated>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

CreatePassword.propTypes = {
	error: PropTypes.bool,
	errorMessage: PropTypes.string,
	history: PropTypes.object.isRequired,
};

CreatePassword.defaultProps = {
	error: false,
	errorMessage: 'Repeat PIN correctly',
};


export default CreatePassword;
