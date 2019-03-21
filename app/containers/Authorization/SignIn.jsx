import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import avatar from '../../assets/images/default-avatar.svg';

class SignIn extends React.Component {

	componentDidMount() {
		this.nameInput.focus();
	}

	render() {
		const { error, loading, errorMessage } = this.props;
		return (

			<div className="authorization-form">
				<div className="form-content">
					<div className="lines">
						<div className="line">
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
										errorMessage &&
										<div className="error-message">
											{errorMessage}
										</div>
									}
									<div className="hints">
										<div className="hint">- must be 3-63 characters long</div>
										<div className="hint active">- must start with latin letter</div>
										<div className="hint error">- may contain only lowercase letters, digits and hyphen</div>
									</div>
								</div>

							</div>

						</div>
						<div className="line">

							<div className="line-label">
						Echo avatar
							</div>
							<div className="line-content">
								<div className="avatar-box">
									<img src={avatar} alt="" />
									<div className="avatar-desciption">
										Avatar is created automatically after account <br /> confirmation
									</div>
								</div>

							</div>
						</div>
					</div>
					<div className="form-action">
						<div className="line">
							<div className="line-label" />
							<div className="line-content">
								<div className="btns-wrap">

									<Button
										disabled
										className="btn-primary"
										content={<span className="text">Create account</span>}
									/>
								</div>
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
};

SignIn.defaultProps = {
	error: false,
	loading: true,
	errorMessage: '',
};

export default SignIn;
