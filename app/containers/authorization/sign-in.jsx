import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import { Animated } from 'react-animated-css';

import PropTypes from 'prop-types';

import avatar from '../../assets/images/default-avatar.svg';

class SignIn extends React.Component {

	componentDidMount() {
		setTimeout(() => {
			this.nameInput.focus();
		}, 500);
	}

	render() {
		const {
			error, loading, errorMessage, isVisible,
		} = this.props;
		return (

			<div className="form-wrap">
				<div className="form-content">
					<div className="lines">
						<Animated
							className="line"
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							isVisible={isVisible}
						>
							<div className="line-label">
								Account name
							</div>
							<div className="line-content">
								<div className="field">
									<Input
										placeholder="Account name"
										ref={(input) => { this.nameInput = input; }}
										error={error}
										loading={loading}
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
										<div className="hint">- must be 3-63 characters long</div>
										<div className="hint active">- must start with latin letter</div>
										<div className="hint error">- may contain only lowercase letters, digits and hyphen</div>
									</div>
								</div>

							</div>

						</Animated>
						<Animated
							className="line"
							animationIn="fadeInRight"
							animationOut="fadeOutLeft"
							animationInDelay={50}
							isVisible={isVisible}
						>

							<div className="line-label">
								Echo avatar
							</div>
							<div className="line-content">
								<div className="avatar-box">
									<img src={avatar} alt="" />
									<div className="avatar-desciption">
										Avatar is created automatically after account confirmation
									</div>
								</div>

							</div>
						</Animated>
					</div>
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
										disabled
										className="btn-primary"
										content={<span className="text">Create account</span>}
									/>
								</Animated>
							</div>
						</div>

					</div>

				</div>

			</div>
		);
	}

}
SignIn.propTypes = {
	error: PropTypes.bool,
	loading: PropTypes.bool,
	errorMessage: PropTypes.string,
	isVisible: PropTypes.bool.isRequired,
};

SignIn.defaultProps = {
	error: false,
	loading: true,
	errorMessage: '',
};

export default SignIn;
