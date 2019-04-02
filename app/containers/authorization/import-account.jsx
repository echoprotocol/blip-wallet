import React from 'react';
import { Animated } from 'react-animated-css';
import { Input, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ImportAccount extends React.Component {

	componentDidMount() {
		setTimeout(() => {
			this.nameInput.focus();
		}, 500);
	}

	render() {
		const { error, errorMessage, isVisible } = this.props;
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
							<div className="line-label">Account name</div>
							<div className="line-content">
								<div className="field">
									<Input
										placeholder="Account name"
										ref={(input) => { this.nameInput = input; }}
										error={error}
										loading={false}
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
							<div className="line-label">WIF key</div>
							<div className="line-content">
								<div className="field">
									<Input
										placeholder="WIF key"
										error={error}
										loading={false}
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
										<div className="hint">You can import any Echo account here</div>
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
										content={<span className="text">Import account</span>}
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
ImportAccount.propTypes = {
	error: PropTypes.bool,
	errorMessage: PropTypes.string,
	isVisible: PropTypes.bool.isRequired,
};

ImportAccount.defaultProps = {
	error: false,
	errorMessage: '',
};

export default ImportAccount;
